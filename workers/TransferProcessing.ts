import {TransactionsExplorer} from "../model/TransactionsExplorer";
import {Wallet, WalletOptions} from "../model/Wallet";
import {Mnemonic} from "../model/Mnemonic";
import {Transaction} from "../model/Transaction";
import {Constants} from "../model/Constants";
import {RawDaemon_Transaction} from "../model/blockchain/BlockchainExplorer";

//bridge for cnUtil with the new mnemonic class
(<any>self).mn_random = Mnemonic.mn_random;
(<any>self).mn_decode = Mnemonic.mn_decode;
(<any>self).mn_encode = Mnemonic.mn_encode;

let currentWallet: Wallet | null = null;

onmessage = function (data: MessageEvent) {
	// if(data.isTrusted){
	let event: any = data.data;
	if (event.type === 'initWallet') {
		currentWallet = Wallet.loadFromRaw(event.wallet);
		postMessage('readyWallet');
	} else if (event.type === 'process') {
		if (typeof event.wallet !== 'undefined') {
			currentWallet = Wallet.loadFromRaw(event.wallet);
		}

		if (currentWallet === null) {
			postMessage('missing_wallet');
			return;
		}

		let readMinersTx = typeof currentWallet.options.checkMinerTx !== 'undefined' && currentWallet.options.checkMinerTx;

		let rawTransactions: RawDaemon_Transaction[] = event.transactions;
		let transactions: any[] = [];

		for (let rawTransaction of rawTransactions) {
			if (!readMinersTx && TransactionsExplorer.isMinerTx(rawTransaction)) {
				continue;
			}

			let transaction = TransactionsExplorer.parse(rawTransaction, currentWallet);
			if (Constants.DEBUG_STATE) {
				if (transaction !== null) {
					console.log(`parsed tx ${transaction['hash']} from rawTransaction`);
				}
			}
			if (transaction !== null) {
				currentWallet.addNew(transaction);
				if (Constants.DEBUG_STATE) {
					console.log(`Added tx ${transaction.hash} to currentWallet`);
				}

				transactions.push(transaction.export());
				if (Constants.DEBUG_STATE) {
					console.log(`pushed tx ${transaction.hash} to transactions[]`);
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

	if (Constants.DEBUG_STATE) {
		// @ts-ignore
		let tempAll = currentWallet.getAll()
		if (tempAll.length > 0) {
			console.log(tempAll);
		}
	}
};

postMessage('ready');
