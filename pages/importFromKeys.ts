import {DestructableView} from "../lib/numbersLab/DestructableView";
import {VueVar, VueWatched} from "../lib/numbersLab/VueAnnotate";
import {AppState} from "../model/AppState";
import {Password} from "../model/Password";
import {Wallet} from "../model/Wallet";
import {KeysRepository} from "../model/KeysRepository";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {Constants} from "../model/Constants";
import {BlockchainExplorer} from "../model/blockchain/BlockchainExplorer";
import {Cn, CnUtils} from "../model/Cn";

AppState.enableLeftMenu();

let blockchainExplorer : BlockchainExplorer = BlockchainExplorerProvider.getInstance();

class ImportView extends DestructableView{
	@VueVar(false) viewOnly !: boolean;

	@VueVar('') privateSpendKey !: string;
	@VueVar(false) validPrivateSpendKey !: boolean;
	@VueVar('') privateViewKey !: string;
	@VueVar(false) validPrivateViewKey !: boolean;
	@VueVar('') publicAddress !: string;
	@VueVar(false) validPublicAddress !: boolean;

	@VueVar('') password !: string;
	@VueVar('') password2 !: string;
	@VueVar(false) insecurePassword !: boolean;
	@VueVar(false) forceInsecurePassword !: boolean;
	@VueVar(0) importHeight !: number;

	constructor(container : string){
		super(container);
	}

	formValid(){
		if(this.password != this.password2)
			return false;

		if(!(this.password !== '' && (!this.insecurePassword || this.forceInsecurePassword)))
			return false;

		if(!(
			(!this.viewOnly && this.validPrivateSpendKey) ||
			(this.viewOnly && this.validPublicAddress && this.validPrivateViewKey)
		))
			return false;
		return true;
	}

	importWallet(){
		let self = this;
		blockchainExplorer.getHeight().then(function(currentHeight){
			let newWallet = new Wallet();
			if(self.viewOnly){
				let decodedPublic = Cn.decode_address(self.publicAddress.trim());
				newWallet.keys = {
					priv:{
						spend:'',
						view:self.privateViewKey.trim()
					},
					pub:{
						spend:decodedPublic.spend,
						view:decodedPublic.view,
					}
				};
			}else {
				if (Constants.DEBUG_STATE) {
					console.log(1);
				}
				let viewkey = self.privateViewKey.trim();
				if(viewkey === ''){
					viewkey = Cn.generate_keys(CnUtils.cn_fast_hash(self.privateSpendKey.trim())).sec;
				}
				if (Constants.DEBUG_STATE) {
					console.log(1, viewkey);
				}
				newWallet.keys = KeysRepository.fromPriv(self.privateSpendKey.trim(), viewkey);
				if (Constants.DEBUG_STATE) {
					console.log(1);
				}
			}

			let height = self.importHeight;//never trust a perfect value from the user
			if(height >= currentHeight){
				height = currentHeight-1;
			}
			height = height - 10;

			if(height < 0)height = 0;
			if(height > currentHeight)height = currentHeight;
			newWallet.lastHeight = height;
			newWallet.creationHeight = newWallet.lastHeight;

			AppState.openWallet(newWallet, self.password);
			window.location.href = '#account';
		});
	}

	@VueWatched()
	passwordWatch(){
		if(!Password.checkPasswordConstraints(this.password, false)){
			this.insecurePassword = true;
		}else
			this.insecurePassword = false;
	}

	@VueWatched()
	importHeightWatch(){
		if((<any>this.importHeight) === '')this.importHeight = 0;
		if(this.importHeight < 0){
			this.importHeight = 0;
		}
		this.importHeight = parseInt(''+this.importHeight);
	}

	@VueWatched()
	privateSpendKeyWatch(){
		this.validPrivateSpendKey = this.privateSpendKey.trim().length == 64;
	}

	@VueWatched()
	privateViewKeyWatch(){
		this.validPrivateViewKey = this.privateViewKey.trim().length == 64 || (!this.viewOnly && this.privateViewKey.trim().length == 0);
	}

	@VueWatched()
	publicAddressWatch(){
		try{
			Cn.decode_address(this.publicAddress.trim());
			this.validPublicAddress = true;
		}catch(e){
			this.validPublicAddress = false;
		}
	}

	forceInsecurePasswordCheck(){
		let self = this;
		self.forceInsecurePassword = true;
	}

}

new ImportView('#app');
