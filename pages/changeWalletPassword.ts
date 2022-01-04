import {DestructableView} from "../lib/numbersLab/DestructableView";
import {VueVar, VueWatched} from "../lib/numbersLab/VueAnnotate";
import {TransactionsExplorer} from "../model/TransactionsExplorer";
import {WalletRepository} from "../model/WalletRepository";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Constants} from "../model/Constants";
import {Wallet} from "../model/Wallet";
import {AppState, WalletWorker} from "../model/AppState";
import {Password} from "../model/Password";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {BlockchainExplorer} from "../model/blockchain/BlockchainExplorer";
import {WalletWatchdog} from "../model/WalletWatchdog";

let wallet : Wallet = DependencyInjectorInstance().getInstance(Wallet.name, 'default', false);
let blockchainExplorer : BlockchainExplorer = BlockchainExplorerProvider.getInstance();
let walletWatchdog : WalletWatchdog = DependencyInjectorInstance().getInstance(WalletWatchdog.name,'default', false);

class ChangeWalletPasswordView extends DestructableView{
	@VueVar('') oldPassword !: string;
	@VueVar(false) invalidOldPassword !: boolean;

	@VueVar('') walletPassword !: string;
	@VueVar('') walletPassword2 !: string;
	@VueVar(false) insecurePassword !: boolean;
	@VueVar(false) forceInsecurePassword !: boolean;

	constructor(container : string){
		super(container);
	}

	@VueWatched()
	oldPasswordWatch(){
		let wallet = WalletRepository.getLocalWalletWithPassword(this.oldPassword);
		if(wallet !== null) {
			this.invalidOldPassword = false;
		}else
			this.invalidOldPassword = true;
	}

	forceInsecurePasswordCheck(){
		let self = this;
		self.forceInsecurePassword = true;
	}

	@VueWatched()
	walletPasswordWatch(){
		if(!Password.checkPasswordConstraints(this.walletPassword, false)){
			this.insecurePassword = true;
		}else
			this.insecurePassword = false;
	}

	changePassword(){
		let walletWorker : WalletWorker = DependencyInjectorInstance().getInstance(WalletWorker.name,'default', false);
		if(walletWorker !== null){
			walletWorker.password = this.walletPassword;
			walletWorker.save();

			swal({
				type:'success',
				title:i18n.t('changeWalletPasswordPage.modalSuccess.title'),
				confirmButtonText:i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
			});
			this.oldPassword = '';
			this.walletPassword = '';
			this.walletPassword2 = '';
			this.insecurePassword = false;
			this.forceInsecurePassword = false;
			this.invalidOldPassword = false;
		}
	}


}


if(wallet !== null && blockchainExplorer !== null)
	new ChangeWalletPasswordView('#app');
else
	window.location.href = '#index';
