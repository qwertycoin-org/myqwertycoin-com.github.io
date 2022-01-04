import {VueVar, VueWatched} from "../lib/numbersLab/VueAnnotate";
import {DestructableView} from "../lib/numbersLab/DestructableView";
import {KeysRepository} from "../model/KeysRepository";
import {Wallet} from "../model/Wallet";
import {Password} from "../model/Password";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {Mnemonic} from "../model/Mnemonic";
import {AppState} from "../model/AppState";
import {WalletRepository} from "../model/WalletRepository";
import {Translations} from "../model/Translations";
import {MnemonicLang} from "../model/MnemonicLang";
import {BlockchainExplorer} from "../model/blockchain/BlockchainExplorer";
import {Cn, CnNativeBride, CnRandom} from "../model/Cn";

let blockchainExplorer : BlockchainExplorer = BlockchainExplorerProvider.getInstance();

class CreateViewWallet extends DestructableView{
	@VueVar(0) step !: number;

	@VueVar('') walletPassword !: string;
	@VueVar('') walletPassword2 !: string;
	@VueVar(false) insecurePassword !: boolean;
	@VueVar(false) forceInsecurePassword !: boolean;

	@VueVar(false) walletBackupMade !: boolean;

	@VueVar(null) newWallet !: Wallet|null;
	@VueVar('') mnemonicPhrase !: string;
	@VueVar('') debugMessage !: string;

	constructor(container : string){
		super(container);
		this.generateWallet();
		AppState.enableLeftMenu();
	}

	destruct(): Promise<void> {
		return super.destruct();
	}

	generateWallet(){
		let self = this;
		setTimeout(function(){
			blockchainExplorer.getHeight().then(function(currentHeight){
				self.debugMessage = 'entered getHeight function';
				let seed = CnNativeBride.sc_reduce32(CnRandom.rand_32());
				let keys = Cn.create_address(seed);

				let newWallet = new Wallet();
				newWallet.keys = KeysRepository.fromPriv(keys.spend.sec, keys.view.sec);
				let height = currentHeight - 10;
				if(height < 0)height = 0;
				newWallet.lastHeight = height;
				newWallet.creationHeight = height;

				self.newWallet = newWallet;

				Translations.getLang().then(function(userLang : string){
					let langToExport = 'english';
					for(let lang of MnemonicLang.getLangs()){
						if(lang.shortLang === userLang){
							langToExport = lang.name;
							break;
						}
					}
					let phrase = Mnemonic.mn_encode(newWallet.keys.priv.spend, langToExport);
					if(phrase !== null)
						self.mnemonicPhrase = phrase;

				});

				setTimeout(function(){
					self.step = 1;
				}, 2000);
			});
		},0);
	}

	@VueWatched()
	walletPasswordWatch(){
		if(!Password.checkPasswordConstraints(this.walletPassword, false)){
			this.insecurePassword = true;
		}else
			this.insecurePassword = false;
	}

	@VueWatched()
	stepWatch(){
		$("html, body").animate({ scrollTop: 0 }, "fast");
	}

	forceInsecurePasswordCheck(){
		let self = this;
		/*swal({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			reverseButtons:true,
			confirmButtonText: 'Yes'
		}).then((result:{value:boolean}) => {
			if (result.value) {*/
		self.forceInsecurePassword = true;
		// }
		// });
	}

	exportStep(){
		if(this.walletPassword !== '' && (!this.insecurePassword || this.forceInsecurePassword)) {
			this.step = 2;
		}
	}

	downloadBackup(){
		if(this.newWallet !== null)
			WalletRepository.downloadEncryptedPdf(this.newWallet);
		this.walletBackupMade = true;
	}

	finish(){
		if(this.newWallet !== null) {
			AppState.openWallet(this.newWallet, this.walletPassword);
			window.location.href = '#account';
		}
	}

}

new CreateViewWallet('#app');