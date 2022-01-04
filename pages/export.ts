import {VueVar} from "../lib/numbersLab/VueAnnotate";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Wallet} from "../model/Wallet";
import {DestructableView} from "../lib/numbersLab/DestructableView";
import {Constants} from "../model/Constants";
import {WalletRepository} from "../model/WalletRepository";
import {Mnemonic} from "../model/Mnemonic";

let wallet: Wallet = DependencyInjectorInstance().getInstance(Wallet.name, 'default', false);
let blockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);


class ExportView extends DestructableView {
	@VueVar('') publicAddress: string;
	@VueVar(false) nativePlatform !: boolean;

	constructor(container: string) {
		super(container);
		let self = this;

		this.publicAddress = wallet.getPublicAddress();
		this.nativePlatform = window.native;
	}

	destruct(): Promise<void> {
		return super.destruct();
	}

	askUserPassword(): Promise<{ wallet: Wallet, password: string } | null> {
		return swal({
			input: 'password',
			showCancelButton: true,
			title: i18n.t('global.openWalletModal.title'),
			confirmButtonText: i18n.t('exportPage.mnemonicLangSelectionModal.confirmText'),
			cancelButtonText: i18n.t('exportPage.mnemonicKeyModal.confirmText'),
		}).then((result: any) => {
			if (result.value) {
				let savePassword : string = result.value;
				// let password = prompt();
				// let wallet = WalletRepository.getMain();
				return WalletRepository.getLocalWalletWithPassword(savePassword).then((wallet : Wallet|null) : { wallet: Wallet, password: string }|null => {
					if (wallet !== null) {
						return {wallet: wallet, password: savePassword};
					} else {
						swal({
							type: 'error',
							title: i18n.t('global.invalidPasswordModal.title'),
							text: i18n.t('global.invalidPasswordModal.content'),
							confirmButtonText: i18n.t('global.invalidPasswordModal.confirmText'),
						});
					}
					return null;
				});
			}
			return null;
		});
	}

	getPrivateKeys() {
		this.askUserPassword().then(function (params: { wallet: Wallet, password: string } | null) {
			if (params !== null && params.wallet !== null) {
				swal({
					title: i18n.t('exportPage.walletKeysModal.title'),
					confirmButtonText: i18n.t('exportPage.walletKeysModal.confirmText'),
					html: i18n.t('exportPage.walletKeysModal.content', {
						privViewKey: params.wallet.keys.priv.view,
						privSpendKey: params.wallet.keys.priv.spend
					}),
				});
			}
		});
	}

	getMnemonicPhrase() {
		this.askUserPassword().then(function (params: { wallet: Wallet, password: string } | null) {
			if (params !== null && params.wallet !== null) {
				swal({
					title: i18n.t('exportPage.mnemonicLangSelectionModal.title'),
					input: 'select',
					showCancelButton: true,
					confirmButtonText: i18n.t('exportPage.mnemonicLangSelectionModal.confirmText'),
					inputOptions: {
						'english': 'English',
						'chinese': 'Chinese (simplified)',
						'dutch': 'Dutch',
						'electrum': 'Electrum',
						'esperanto': 'Esperanto',
						'french': 'French',
						'italian': 'Italian',
						'japanese': 'Japanese',
						'lojban': 'Lojban',
						'portuguese': 'Portuguese',
						'russian': 'Russian',
						'spanish': 'Spanish',
					}
				}).then((mnemonicLangResult: {value?:string}) => {
					if(mnemonicLangResult.value) {
						let mnemonic = Mnemonic.mn_encode(params.wallet.keys.priv.spend, mnemonicLangResult.value);
						swal({
							title: i18n.t('exportPage.mnemonicKeyModal.title'),
							confirmButtonText: i18n.t('exportPage.mnemonicKeyModal.confirmText'),
							html: i18n.t('exportPage.mnemonicKeyModal.content', {
								mnemonic: mnemonic,
							}),
						});
					}
				});
			}
		});
	}

	fileExport() {
		this.askUserPassword().then(function (params: { wallet: Wallet, password: string } | null) {
			if (params !== null && params.wallet !== null) {
				let blob = new Blob([JSON.stringify(WalletRepository.getEncrypted(params.wallet, params.password))], {type: "application/json"});
				saveAs(blob, "wallet.json");
			}
		});
	}

	exportEncryptedPdf() {
		this.askUserPassword().then(function (params: { wallet: Wallet, password: string } | null) {
			if (params !== null && params.wallet !== null) {
				WalletRepository.downloadEncryptedPdf(params.wallet);
			}
		});
	}

}

if (wallet !== null && blockchainExplorer !== null)
	new ExportView('#app');
else
	window.location.href = '#index';