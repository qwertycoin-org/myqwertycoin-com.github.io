import {DestructableView} from "../lib/numbersLab/DestructableView";
import {VueVar, VueWatched} from "../lib/numbersLab/VueAnnotate";
import {AppState} from "../model/AppState";
import {Password} from "../model/Password";
import {Wallet} from "../model/Wallet";
import {KeysRepository} from "../model/KeysRepository";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {QRReader} from "../model/QRReader";
import {CoinUri} from "../model/CoinUri";
import {Mnemonic} from "../model/Mnemonic";
import {Constants} from "../model/Constants";
import {BlockchainExplorer} from "../model/blockchain/BlockchainExplorer";
import {Cn, CnUtils} from "../model/Cn";

AppState.enableLeftMenu();

let blockchainExplorer : BlockchainExplorer = BlockchainExplorerProvider.getInstance();

class ImportView extends DestructableView{
	@VueVar('') password !: string;
	@VueVar('') password2 !: string;
	@VueVar(false) insecurePassword !: boolean;
	@VueVar(false) forceInsecurePassword !: boolean;
	@VueVar(0) importHeight !: number;
	@VueVar(false) qrScanning !: boolean;

	private mnemonicSeed : string|null = null;
	private privateSpendKey : string|null = null;
	private privateViewKey : string|null = null;
	private publicAddress : string|null = null;

	constructor(container : string){
		super(container);
	}

	formValid(){
		if(this.password != this.password2)
			return false;

		if(!(this.password !== '' && (!this.insecurePassword || this.forceInsecurePassword)))
			return false;

		if(!(this.privateSpendKey !== null || this.mnemonicSeed !== null || (this.publicAddress !== null && this.privateViewKey !== null)))
			return false;

		return true;
	}

	importWallet(){
		let self = this;
		blockchainExplorer.getHeight().then(function(currentHeight){
			let newWallet = new Wallet();

			if(self.mnemonicSeed !== null) {
				let detectedMnemonicLang = Mnemonic.detectLang(self.mnemonicSeed);
				if(detectedMnemonicLang !== null){
					let mnemonic_decoded = Mnemonic.mn_decode(self.mnemonicSeed, detectedMnemonicLang);
					if(mnemonic_decoded !== null) {
						let keys = Cn.create_address(mnemonic_decoded);
						newWallet.keys = KeysRepository.fromPriv(keys.spend.sec, keys.view.sec);
					}else{
						swal({
							type: 'error',
							title: i18n.t('global.invalidMnemonicModal.title'),
							text: i18n.t('global.invalidMnemonicModal.content'),
							confirmButtonText: i18n.t('global.invalidMnemonicModal.confirmText'),
						});
						return;
					}
				}else{
					swal({
						type: 'error',
						title: i18n.t('global.invalidMnemonicModal.title'),
						text: i18n.t('global.invalidMnemonicModal.content'),
						confirmButtonText: i18n.t('global.invalidMnemonicModal.confirmText'),
					});
					return;
				}
			}else if(self.privateSpendKey !== null){
				let viewkey = self.privateViewKey !== null ? self.privateViewKey : '';
				if(viewkey === ''){
					viewkey = Cn.generate_keys(CnUtils.cn_fast_hash(self.privateSpendKey)).sec;
				}
				newWallet.keys = KeysRepository.fromPriv(self.privateSpendKey, viewkey);

			}else if(self.privateSpendKey === null && self.privateViewKey !== null && self.publicAddress !== null){
				let decodedPublic = Cn.decode_address(self.publicAddress);
				newWallet.keys = {
					priv:{
						spend:'',
						view:self.privateViewKey
					},
					pub:{
						spend:decodedPublic.spend,
						view:decodedPublic.view,
					}
				};
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


	qrReader : QRReader|null = null;

	initQr(){
		this.stopScan();
		this.qrReader = new QRReader();
		this.qrReader.init('/lib/');
	}

	startScan(){
		let self = this;
		if(typeof window.QRScanner !== 'undefined') {
			window.QRScanner.scan(function(err : any, result : any){
				if (err) {
					if(err.name === 'SCAN_CANCELED'){

					}else{
						alert(JSON.stringify(err));
					}
				} else {
					self.handleScanResult(result);
				}
			});

			window.QRScanner.show();
			$('body').addClass('transparent');
			$('#appContent').hide();
			$('#nativeCameraPreview').show();
		}else {
			this.initQr();
			if (this.qrReader) {
				this.qrScanning = true;
				this.qrReader.scan((result: string) => {
					this.handleScanResult(result);
				});
			}
		}
	}

	handleScanResult(result : string){
		this.qrScanning = false;
		this.stopScan();

		try {
			let txDetails = CoinUri.decodeWallet(result);
			if (
				txDetails !== null &&
				(typeof txDetails.spendKey !== 'undefined' || typeof txDetails.mnemonicSeed !== 'undefined')
			) {
				if (typeof txDetails.spendKey !== 'undefined') this.privateSpendKey = txDetails.spendKey;
				if (typeof txDetails.mnemonicSeed !== 'undefined') this.mnemonicSeed = txDetails.mnemonicSeed;
				if (typeof txDetails.viewKey !== 'undefined') this.privateViewKey = txDetails.viewKey;
				if (typeof txDetails.height !== 'undefined') this.importHeight = parseInt('' + txDetails.height);
				if (typeof txDetails.address !== 'undefined') this.publicAddress = txDetails.address;
				return true;
			}
		} catch (e) {
		}

		return false;
	}

	stopScan(){
		if(typeof window.QRScanner !== 'undefined') {
			window.QRScanner.cancelScan(function(status:any){
				if (Constants.DEBUG_STATE) {
					console.log(status);
				}
			});
			window.QRScanner.hide();
			$('body').removeClass('transparent');
			$('#appContent').show();
			$('#nativeCameraPreview').hide();
		}else {
			if (this.qrReader !== null) {
				this.qrReader.stop();
				this.qrReader = null;
				this.qrScanning = false;
			}
		}
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

	forceInsecurePasswordCheck(){
		this.forceInsecurePassword = true;
	}

}

new ImportView('#app');
