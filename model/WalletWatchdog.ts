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

import {Wallet} from "./Wallet";
import {BlockchainExplorer, RawDaemon_Transaction} from "./blockchain/BlockchainExplorer";
import {Transaction} from "./Transaction";
import {TransactionsExplorer} from "./TransactionsExplorer";
import {Constants} from "./Constants";

export class WalletWatchdog {

    wallet: Wallet;
    explorer: BlockchainExplorer;

    constructor(wallet: Wallet, explorer: BlockchainExplorer) {
        this.wallet = wallet;
        this.explorer = explorer;

        this.initWorker();
        this.initMempool();
    }

    initWorker() {
        let self = this;
        if (this.wallet.options.customNode) {
            config.nodeUrl = this.wallet.options.nodeUrl;
        } else {
            let randInt = Math.floor(Math.random() * Math.floor(config.nodeList.length));
            config.nodeUrl = config.nodeList[randInt].node;
        }

        this.workerProcessing = new Worker('./workers/TransferProcessingEntrypoint.js');
        this.workerProcessing.onmessage = function (data: MessageEvent) {
            let message: string | any = data.data;
            if (message === 'ready') {
                console.info('worker ready');
                self.signalWalletUpdate();
            } else if (message === 'readyWallet') {
                self.workerProcessingReady = true;
            } else if (message.type) {
                if (message.type === 'processed') {
                    let transactions = message.transactions;
                    if (transactions.length > 0) {
                        for (let tx of transactions){
                            if (Constants.DEBUG_STATE) {
                                console.log(`Initworker tx: `)
                                console.log(tx)
                            }
                            self.wallet.addNew(Transaction.fromRaw(tx));
                        }
                        self.signalWalletUpdate();
                    }
                    if (self.workerCurrentProcessing.length > 0) {
                        let transactionHeight = self.workerCurrentProcessing[self.workerCurrentProcessing.length - 1].height;
                        if (typeof transactionHeight !== 'undefined')
                            self.wallet.lastHeight = transactionHeight;
                    }

                    self.workerProcessingWorking = false;
                }
            }
        };
    }

    signalWalletUpdate() {
        let self = this;
        console.log('wallet update');
        this.lastBlockLoading = -1;//reset scanning
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
    }

    intervalMempool = 0;

    initMempool(force: boolean = false) {
        let self = this;
        if (this.intervalMempool === 0 || force) {
            if (force && this.intervalMempool !== 0) {
                clearInterval(this.intervalMempool);
            }

            this.intervalMempool = setInterval(function () {
                self.checkMempool();
            }, config.avgBlockTime / 2 * 1000);
        }
        self.checkMempool();
    }

    stopped: boolean = false;

    stop() {
        clearInterval(this.intervalTransactionsProcess);
        this.transactionsToProcess = [];
        clearInterval(this.intervalMempool);
        this.stopped = true;
    }

    checkMempool(): boolean {
        let self = this;
        if (this.lastMaximumHeight - this.lastBlockLoading > 1) {//only check memory pool if the user is up to date to ensure outs & ins will be found in the wallet
            return false;
        }

        this.wallet.txsMem = [];
        this.explorer.getTransactionPool().then(function (data: any) {
            if (typeof data.transactions !== 'undefined')
                for (let rawTx of data.transactions) {
                    let tx = TransactionsExplorer.parse(rawTx.tx_json, self.wallet);
                    if (tx !== null) {
                        tx.hash = rawTx.id_hash;
                        tx.fees = rawTx.fee;
                        self.wallet.txsMem.push(tx);
                    }
                }
        }).catch(function () {
        });
        return true;
    }

    terminateWorker() {
        this.workerProcessing.terminate();
        this.workerProcessingReady = false;
        this.workerCurrentProcessing = [];
        this.workerProcessingWorking = false;
        this.workerCountProcessed = 0;
    }

    transactionsToProcess: RawDaemon_Transaction[] = [];
    intervalTransactionsProcess = 0;

    workerProcessing !: Worker;
    workerProcessingReady = false;
    workerProcessingWorking = false;
    workerCurrentProcessing: RawDaemon_Transaction[] = [];
    workerCountProcessed = 0;

    checkTransactions(rawTransactions: RawDaemon_Transaction[]) {
        for (let rawTransaction of rawTransactions) {
            let height = rawTransaction.height;
            if (typeof height !== 'undefined') {
                let transaction = TransactionsExplorer.parse(rawTransaction, this.wallet);
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
    }

    checkTransactionsInterval() {
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

        let transactionsToProcess: RawDaemon_Transaction[] = this.transactionsToProcess.splice(0, 30);
        if (transactionsToProcess.length > 0) {
            this.workerCurrentProcessing = transactionsToProcess;
            this.workerProcessing.postMessage({
                type: 'process',
                transactions: transactionsToProcess
            });
            this.workerCountProcessed += this.transactionsToProcess.length;
            this.workerProcessingWorking = true;
        } else {
            clearInterval(this.intervalTransactionsProcess);
            this.intervalTransactionsProcess = 0;
        }
    }

    processTransactions(transactions: RawDaemon_Transaction[]) {
        let transactionsToAdd = [];
        for (let tr of transactions) {
            if (typeof tr.height !== 'undefined')
                if (tr.height > this.wallet.lastHeight) {
                    transactionsToAdd.push(tr);
                }
        }

        this.transactionsToProcess.push.apply(this.transactionsToProcess, transactionsToAdd);
        if (this.intervalTransactionsProcess === 0) {
            let self = this;
            this.intervalTransactionsProcess = setInterval(function () {
                self.checkTransactionsInterval();
            }, this.wallet.options.readSpeed);
        }
    }


    lastBlockLoading = -1;
    lastMaximumHeight = 0;

    loadHistory() {
        if (this.stopped) return;

        let self = this;

        if (this.transactionsToProcess.length > 500) {
            //to ensure no pile explosion
            setTimeout(function () {
                self.loadHistory();
            }, 2 * 1000);
            return;
        }

        // console.log('checking');
        this.explorer.getHeight().then(function (height) {
            if (height > self.lastMaximumHeight) self.lastMaximumHeight = height;

            if (self.lastBlockLoading === -1) self.lastBlockLoading = self.wallet.lastHeight;

            if (self.lastBlockLoading !== height) {
                let previousStartBlock = self.lastBlockLoading;
                let endBlock = previousStartBlock + 49;

                if (previousStartBlock >= self.lastMaximumHeight) previousStartBlock = self.lastMaximumHeight;
                if (endBlock >= self.lastMaximumHeight) endBlock = self.lastMaximumHeight;

                self.explorer.getTransactionsForBlocks(previousStartBlock, endBlock, true).then(function (transactions: any) {
                    //to ensure no pile explosion
                    if (transactions === 'OK') {
                        self.lastBlockLoading += 1;
                        self.wallet.lastHeight += 1;
                        setTimeout(function () {
                            self.loadHistory();
                        }, 1);
                    } else if (transactions.length > 0) {
                        let lastTx = transactions[transactions.length - 1];
                        if (typeof lastTx.height !== 'undefined') {
                            self.lastBlockLoading = lastTx.height + 1;
                        }
                        self.processTransactions(transactions);
                        setTimeout(function () {
                            self.loadHistory();
                        }, 1);
                    } else  {
                        setTimeout(function () {
                            self.loadHistory();
                        }, 30 * 1000);
                    }
                }).catch(function () {
                    setTimeout(function () {
                        self.loadHistory();
                    }, 30 * 1000);//retry 30s later if an error occurred
                });
            } else {
                setTimeout(function () {
                    self.loadHistory();
                }, 30 * 1000);
            }
        }).catch(function () {
            setTimeout(function () {
                self.loadHistory();
            }, 30 * 1000);//retry 30s later if an error occurred
        });
    }


}
