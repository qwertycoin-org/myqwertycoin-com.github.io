define(["require", "exports", "../model/TransactionsExplorer", "../model/Wallet", "../model/Mnemonic", "../model/Constants"], function (require, exports, TransactionsExplorer_1, Wallet_1, Mnemonic_1, Constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //bridge for cnUtil with the new mnemonic class
    self.mn_random = Mnemonic_1.Mnemonic.mn_random;
    self.mn_decode = Mnemonic_1.Mnemonic.mn_decode;
    self.mn_encode = Mnemonic_1.Mnemonic.mn_encode;
    var currentWallet = null;
    onmessage = function (data) {
        // if(data.isTrusted){
        var event = data.data;
        if (event.type === 'initWallet') {
            currentWallet = Wallet_1.Wallet.loadFromRaw(event.wallet);
            postMessage('readyWallet');
        }
        else if (event.type === 'process') {
            if (typeof event.wallet !== 'undefined') {
                currentWallet = Wallet_1.Wallet.loadFromRaw(event.wallet);
            }
            if (currentWallet === null) {
                postMessage('missing_wallet');
                return;
            }
            var readMinersTx = typeof currentWallet.options.checkMinerTx !== 'undefined' && currentWallet.options.checkMinerTx;
            var rawTransactions = event.transactions;
            var transactions = [];
            for (var _i = 0, rawTransactions_1 = rawTransactions; _i < rawTransactions_1.length; _i++) {
                var rawTransaction = rawTransactions_1[_i];
                if (!readMinersTx && TransactionsExplorer_1.TransactionsExplorer.isMinerTx(rawTransaction)) {
                    continue;
                }
                var transaction = TransactionsExplorer_1.TransactionsExplorer.parse(rawTransaction, currentWallet);
                if (Constants_1.Constants.DEBUG_STATE) {
                    if (transaction !== null) {
                        console.log("parsed tx " + transaction['hash'] + " from rawTransaction");
                    }
                }
                if (transaction !== null) {
                    currentWallet.addNew(transaction);
                    if (Constants_1.Constants.DEBUG_STATE) {
                        console.log("Added tx " + transaction.hash + " to currentWallet");
                    }
                    transactions.push(transaction.export());
                    if (Constants_1.Constants.DEBUG_STATE) {
                        console.log("pushed tx " + transaction.hash + " to transactions[]");
                    }
                }
            }
            postMessage({
                type: 'processed',
                transactions: transactions
            });
        }
        // let transaction = TransactionsExplorer.parse(rawTransaction, height, this.wallet);
        // }else {
        // 	console.warn('Non trusted data', data.data, JSON.stringify(data.data));
        // }
        if (Constants_1.Constants.DEBUG_STATE) {
            // @ts-ignore
            var tempAll = currentWallet.getAll();
            if (tempAll.length > 0) {
                console.log(tempAll);
            }
        }
    };
    postMessage('ready');
});
