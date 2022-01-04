import {DestructableView} from "../lib/numbersLab/DestructableView";
import {VueVar, VueWatched} from "../lib/numbersLab/VueAnnotate";
import {AppState} from "../model/AppState";
import {Password} from "../model/Password";
import {Wallet} from "../model/Wallet";
import {KeysRepository} from "../model/KeysRepository";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {Mnemonic} from "../model/Mnemonic";
import {MnemonicLang} from "../model/MnemonicLang";
import {WalletRepository} from "../model/WalletRepository";
import {BlockchainExplorer} from "../model/blockchain/BlockchainExplorer";

AppState.enableLeftMenu();

let blockchainExplorer : BlockchainExplorer = BlockchainExplorerProvider.getInstance();

class ImportView extends DestructableView{
	@VueVar('') password !: string;
	@VueVar('') password2 !: string;
	@VueVar(false) insecurePassword !: boolean;
	@VueVar(false) forceInsecurePassword !: boolean;

	rawFile : any = null;
	invalidRawFile : boolean = false;

	constructor(container : string){
		super(container);
	}

	formValid(){
		if(this.password != this.password2)
			return false;

		if(!(this.password !== '' && (!this.insecurePassword || this.forceInsecurePassword)))
			return false;

		if(this.rawFile === null)
			return false;

		return true;
	}


	selectFile(){
		let self = this;
		let element = $('<input type="file">');
		self.invalidRawFile = true;
		element.on('change', function(event : Event){
			let files :File[] = (<any>event.target).files; // FileList object
			if(files.length > 0) {
				let fileReader = new FileReader();
				fileReader.onload = function () {
					try {
						if (typeof fileReader.result === "string") {
							self.rawFile = JSON.parse(fileReader.result);
						}
						self.invalidRawFile = false;
					}catch (e) {
						self.invalidRawFile = true;
					}
				};

				fileReader.readAsText(files[0]);
			}
		});
		element.click();
	}

	importWallet(){
		let self = this;
		blockchainExplorer.getHeight().then(function(currentHeight){
			setTimeout(function(){
				let newWallet = WalletRepository.decodeWithPassword(self.rawFile,self.password);
				if(newWallet !== null) {
					newWallet.recalculateIfNotViewOnly();
					AppState.openWallet(newWallet, self.password);
					window.location.href = '#account';
				}else{
					swal({
						type: 'error',
						title: i18n.t('global.invalidPasswordModal.title'),
						text: i18n.t('global.invalidPasswordModal.content'),
						confirmButtonText: i18n.t('global.invalidPasswordModal.confirmText'),
					});
				}
			},1);

		});
	}

	@VueWatched()
	passwordWatch(){
		if(!Password.checkPasswordConstraints(this.password, false)){
			this.insecurePassword = true;
		}else
			this.insecurePassword = false;
	}

	forceInsecurePasswordCheck(){
		let self = this;
		self.forceInsecurePassword = true;
	}

}

new ImportView('#app');
