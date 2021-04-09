import {DestructableView} from "../lib/numbersLab/DestructableView";
import {VueVar, VueWatched} from "../lib/numbersLab/VueAnnotate";
import {AppState} from "../model/AppState";
import {Password} from "../model/Password";
import {Wallet} from "../model/Wallet";
import {KeysRepository} from "../model/KeysRepository";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {Mnemonic} from "../model/Mnemonic";
import {BlockchainExplorer} from "../model/blockchain/BlockchainExplorer";
import {Cn} from "../model/Cn";

AppState.enableLeftMenu();

let blockchainExplorer: BlockchainExplorer = BlockchainExplorerProvider.getInstance();

class ImportView extends DestructableView {
	@VueVar('') password !: string;
	@VueVar('') password2 !: string;
	@VueVar(false) insecurePassword !: boolean;
	@VueVar(false) forceInsecurePassword !: boolean;
	@VueVar(0) importHeight !: number;

	@VueVar('') mnemonicPhrase !: string;
	@VueVar('') validMnemonicPhrase !: boolean;
	@VueVar('') language !: string;
	@VueVar([]) languages !: { key: string, name: string }[];

	constructor(container: string) {
		super(container);

		this.languages.push({key: 'auto', name: 'Detect automatically'});
		this.languages.push({key: 'english', name: 'English'});
		this.languages.push({key: 'chinese', name: 'Chinese (simplified)'});
		this.languages.push({key: 'dutch', name: 'Dutch'});
		this.languages.push({key: 'electrum', name: 'Electrum'});
		this.languages.push({key: 'esperanto', name: 'Esperanto'});
		this.languages.push({key: 'french', name: 'French'});
		this.languages.push({key: 'italian', name: 'Italian'});
		this.languages.push({key: 'japanese', name: 'Japanese'});
		this.languages.push({key: 'lojban', name: 'Lojban'});
		this.languages.push({key: 'portuguese', name: 'Portuguese'});
		this.languages.push({key: 'russian', name: 'Russian'});
		this.languages.push({key: 'spanish', name: 'Spanish'});
		this.language = 'auto';
	}

	formValid() {
		if (this.password != this.password2)
			return false;

		if (!(this.password !== '' && (!this.insecurePassword || this.forceInsecurePassword)))
			return false;

		if (!this.validMnemonicPhrase)
			return false;

		return true;
	}

	importWallet() {
		let self = this;
		blockchainExplorer.getHeight().then(function (currentHeight) {
			let newWallet = new Wallet();

			let mnemonic = self.mnemonicPhrase.trim();
			// let current_lang = 'english';
			let current_lang = 'english';

			if (self.language === 'auto') {
				let detectedLang = Mnemonic.detectLang(self.mnemonicPhrase.trim());
				if (detectedLang !== null)
					current_lang = detectedLang;
			} else
				current_lang = self.language;

			let mnemonic_decoded = Mnemonic.mn_decode(mnemonic, current_lang);
			if (mnemonic_decoded !== null) {
				let keys = Cn.create_address(mnemonic_decoded);

				let newWallet = new Wallet();
				newWallet.keys = KeysRepository.fromPriv(keys.spend.sec, keys.view.sec);

				let height = self.importHeight - 10;
				if (height < 0) height = 0;
				if (height > currentHeight) height = currentHeight;

				newWallet.lastHeight = height;
				newWallet.creationHeight = newWallet.lastHeight;
				AppState.openWallet(newWallet, self.password);
				window.location.href = '#account';
			} else {
				swal({
					type: 'error',
					title: i18n.t('global.invalidMnemonicModal.title'),
					text: i18n.t('global.invalidMnemonicModal.content'),
					confirmButtonText: i18n.t('global.invalidMnemonicModal.confirmText'),
				});
			}

		});
	}

	@VueWatched()
	passwordWatch() {
		if (!Password.checkPasswordConstraints(this.password, false)) {
			this.insecurePassword = true;
		} else
			this.insecurePassword = false;
	}

	@VueWatched()
	importHeightWatch() {
		if ((<any>this.importHeight) === '') this.importHeight = 0;
		if (this.importHeight < 0) {
			this.importHeight = 0;
		}
		this.importHeight = parseInt('' + this.importHeight);
	}

	@VueWatched()
	mnemonicPhraseWatch() {
		this.checkMnemonicValidity();
	}

	@VueWatched()
	languageWatch() {
		this.checkMnemonicValidity();
	}

	checkMnemonicValidity() {
		let splitted = this.mnemonicPhrase.trim().split(' ');
		if (splitted.length != 25) {
			this.validMnemonicPhrase = false;
		} else {
			let detected = Mnemonic.detectLang(this.mnemonicPhrase.trim());
			if (this.language === 'auto')
				this.validMnemonicPhrase = detected !== null;
			else
				this.validMnemonicPhrase = detected === this.language;
		}
	}

	forceInsecurePasswordCheck() {
		let self = this;
		self.forceInsecurePassword = true;
	}

}

new ImportView('#app');
