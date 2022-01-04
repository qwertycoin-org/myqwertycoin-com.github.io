/*
* Copyright (c) 2019-2021, The Qwertycoin Project
*
* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
*
* 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
*
* 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
define(["require", "exports", "./Transaction", "./TransactionsExplorer", "./Constants"], function (require, exports, Transaction_1, TransactionsExplorer_1, Constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WalletWatchdog = /** @class */ (function () {
        function WalletWatchdog(wallet, explorer) {
            this.intervalMempool = 0;
            this.stopped = false;
            this.transactionsToProcess = [];
            this.intervalTransactionsProcess = 0;
            this.workerProcessingReady = false;
            this.workerProcessingWorking = false;
            this.workerCurrentProcessing = [];
            this.workerCountProcessed = 0;
            this.lastBlockLoading = -1;
            this.lastMaximumHeight = 0;
            this.wallet = wallet;
            this.explorer = explorer;
            this.initWorker();
            this.initMempool();
        }
        WalletWatchdog.prototype.initWorker = function () {
            var self = this;
            if (this.wallet.options.customNode) {
                config.nodeUrl = this.wallet.options.nodeUrl;
            }
            else {
                var randInt = Math.floor(Math.random() * Math.floor(config.nodeList.length));
                config.nodeUrl = config.nodeList[randInt].node;
            }
            this.workerProcessing = new Worker('./workers/TransferProcessingEntrypoint.js');
            this.workerProcessing.onmessage = function (data) {
                var message = data.data;
                if (message === 'ready') {
                    console.info('worker ready');
                    self.signalWalletUpdate();
                }
                else if (message === 'readyWallet') {
                    self.workerProcessingReady = true;
                }
                else if (message.type) {
                    if (message.type === 'processed') {
                        var transactions = message.transactions;
                        if (transactions.length > 0) {
                            for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
                                var tx = transactions_1[_i];
                                if (Constants_1.Constants.DEBUG_STATE) {
                                    console.log("Initworker tx: ");
                                    console.log(tx);
                                }
                                self.wallet.addNew(Transaction_1.Transaction.fromRaw(tx));
                            }
                            self.signalWalletUpdate();
                        }
                        if (self.workerCurrentProcessing.length > 0) {
                            var transactionHeight = self.workerCurrentProcessing[self.workerCurrentProcessing.length - 1].height;
                            if (typeof transactionHeight !== 'undefined')
                                self.wallet.lastHeight = transactionHeight;
                        }
                        self.workerProcessingWorking = false;
                    }
                }
            };
        };
        WalletWatchdog.prototype.signalWalletUpdate = function () {
            var self = this;
            console.log('wallet update');
            this.lastBlockLoading = -1; //reset scanning
            this.workerProcessing.postMessage({
                type: 'initWallet',
                wallet: this.wallet.exportToRaw()
            });
            clearInterval(this.intervalTransactionsProcess);
            this.intervalTransactionsProcess = setInterval(function () {
                self.checkTransactionsInterval();
            }, this.wallet.options.readSpeed);
            //force mempool update after a wallet update (new tx, ...)
            self.checkMempool();
        };
        WalletWatchdog.prototype.initMempool = function (force) {
            if (force === void 0) { force = false; }
            var self = this;
            if (this.intervalMempool === 0 || force) {
                if (force && this.intervalMempool !== 0) {
                    clearInterval(this.intervalMempool);
                }
                this.intervalMempool = setInterval(function () {
                    self.checkMempool();
                }, config.avgBlockTime / 2 * 1000);
            }
            self.checkMempool();
        };
        WalletWatchdog.prototype.stop = function () {
            clearInterval(this.intervalTransactionsProcess);
            this.transactionsToProcess = [];
            clearInterval(this.intervalMempool);
            this.stopped = true;
        };
        WalletWatchdog.prototype.checkMempool = function () {
            var self = this;
            if (this.lastMaximumHeight - this.lastBlockLoading > 1) { //only check memory pool if the user is up to date to ensure outs & ins will be found in the wallet
                return false;
            }
            this.wallet.txsMem = [];
            this.explorer.getTransactionPool().then(function (data) {
                if (typeof data.transactions !== 'undefined')
                    for (var _i = 0, _a = data.transactions; _i < _a.length; _i++) {
                        var rawTx = _a[_i];
                        var tx = TransactionsExplorer_1.TransactionsExplorer.parse(rawTx.tx_json, self.wallet);
                        if (tx !== null) {
                            tx.hash = rawTx.id_hash;
                            tx.fees = rawTx.fee;
                            self.wallet.txsMem.push(tx);
                        }
                    }
            }).catch(function () {
            });
            return true;
        };
        WalletWatchdog.prototype.terminateWorker = function () {
            this.workerProcessing.terminate();
            this.workerProcessingReady = false;
            this.workerCurrentProcessing = [];
            this.workerProcessingWorking = false;
            this.workerCountProcessed = 0;
        };
        WalletWatchdog.prototype.checkTransactions = function (rawTransactions) {
            for (var _i = 0, rawTransactions_1 = rawTransactions; _i < rawTransactions_1.length; _i++) {
                var rawTransaction = rawTransactions_1[_i];
                var height = rawTransaction.height;
                if (typeof height !== 'undefined') {
                    var transaction = TransactionsExplorer_1.TransactionsExplorer.parse(rawTransaction, this.wallet);
                    if (transaction !== null) {
                        this.wallet.addNew(transaction);
                    }
                    if (height - this.wallet.lastHeight >= 2) {
                        this.wallet.lastHeight = height - 1;
                    }
                }
            }
            if (this.transactionsToProcess.length == 0) {
                this.wallet.lastHeight = this.lastBlockLoading;
            }
        };
        WalletWatchdog.prototype.checkTransactionsInterval = function () {
            if (this.workerProcessingWorking || !this.workerProcessingReady) {
                return;
            }
            //we destroy the worker in charge of decoding the transactions every 5k transactions to ensure the memory is not corrupted
            //cnUtil bug, see https://github.com/mymonero/mymonero-core-js/issues/8
            if (this.workerCountProcessed >= 5 * 1000) {
                console.log('Recreate worker..');
                this.terminateWorker();
                this.initWorker();
                return;
            }
            var transactionsToProcess = this.transactionsToProcess.splice(0, 30);
            if (transactionsToProcess.length > 0) {
                this.workerCurrentProcessing = transactionsToProcess;
                this.workerProcessing.postMessage({
                    type: 'process',
                    transactions: transactionsToProcess
                });
                this.workerCountProcessed += this.transactionsToProcess.length;
                this.workerProcessingWorking = true;
            }
            else {
                clearInterval(this.intervalTransactionsProcess);
                this.intervalTransactionsProcess = 0;
            }
        };
        WalletWatchdog.prototype.processTransactions = function (transactions) {
            var transactionsToAdd = [];
            for (var _i = 0, transactions_2 = transactions; _i < transactions_2.length; _i++) {
                var tr = transactions_2[_i];
                if (typeof tr.height !== 'undefined')
                    if (tr.height > this.wallet.lastHeight) {
                        transactionsToAdd.push(tr);
                    }
            }
            this.transactionsToProcess.push.apply(this.transactionsToProcess, transactionsToAdd);
            if (this.intervalTransactionsProcess === 0) {
                var self_1 = this;
                this.intervalTransactionsProcess = setInterval(function () {
                    self_1.checkTransactionsInterval();
                }, this.wallet.options.readSpeed);
            }
        };
        WalletWatchdog.prototype.loadHistory = function () {
            if (this.stopped)
                return;
            var self = this;
            if (this.transactionsToProcess.length > 500) {
                //to ensure no pile explosion
                setTimeout(function () {
                    self.loadHistory();
                }, 2 * 1000);
                return;
            }
            // console.log('checking');
            this.explorer.getHeight().then(function (height) {
                if (height > self.lastMaximumHeight)
                    self.lastMaximumHeight = height;
                if (self.lastBlockLoading === -1)
                    self.lastBlockLoading = self.wallet.lastHeight;
                if (self.lastBlockLoading !== height) {
                    var previousStartBlock = self.lastBlockLoading;
                    var endBlock = previousStartBlock + 49;
                    if (previousStartBlock >= self.lastMaximumHeight)
                        previousStartBlock = self.lastMaximumHeight;
                    if (endBlock >= self.lastMaximumHeight)
                        endBlock = self.lastMaximumHeight;
                    self.explorer.getTransactionsForBlocks(previousStartBlock, endBlock, true).then(function (transactions) {
                        //to ensure no pile explosion
                        if (transactions === 'OK') {
                            self.lastBlockLoading += 1;
                            self.wallet.lastHeight += 1;
                            setTimeout(function () {
                                self.loadHistory();
                            }, 1);
                        }
                        else if (transactions.length > 0) {
                            var lastTx = transactions[transactions.length - 1];
                            if (typeof lastTx.height !== 'undefined') {
                                self.lastBlockLoading = lastTx.height + 1;
                            }
                            self.processTransactions(transactions);
                            setTimeout(function () {
                                self.loadHistory();
                            }, 1);
                        }
                        else {
                            setTimeout(function () {
                                self.loadHistory();
                            }, 30 * 1000);
                        }
                    }).catch(function () {
                        setTimeout(function () {
                            self.loadHistory();
                        }, 30 * 1000); //retry 30s later if an error occurred
                    });
                }
                else {
                    setTimeout(function () {
                        self.loadHistory();
                    }, 30 * 1000);
                }
            }).catch(function () {
                setTimeout(function () {
                    self.loadHistory();
                }, 30 * 1000); //retry 30s later if an error occurred
            });
        };
        return WalletWatchdog;
    }());
    exports.WalletWatchdog = WalletWatchdog;
});
