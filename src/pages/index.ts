import {WalletRepository} from "../model/WalletRepository";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {VueRequireFilter, VueVar} from "../lib/numbersLab/VueAnnotate";
import {DestructableView} from "../lib/numbersLab/DestructableView";
import {Wallet} from "../model/Wallet";
import {AppState} from "../model/AppState";

let wallet : Wallet = DependencyInjectorInstance().getInstance(Wallet.name,'default', false);
if(wallet !== null){
	window.location.href = '#account';
}

class IndexView extends DestructableView{
	@VueVar(false) hasLocalWallet !: boolean;
	@VueVar(false) isWalletLoaded !: boolean;

	constructor(container : string){
		super(container);
		this.isWalletLoaded = DependencyInjectorInstance().getInstance(Wallet.name,'default', false) !== null;
		WalletRepository.hasOneStored().then((status : boolean)=>{
			this.hasLocalWallet = status;
		});
		// this.importWallet();
		AppState.disableLeftMenu();
	}

	destruct(): Promise<void> {
		return super.destruct();
	}

	loadWallet(){
		AppState.askUserOpenWallet();
	}

}

let newIndexView = new IndexView('#app');


/*
function readFile(fileEnty:any){
	//console.log(fileEnty);
}

function writeFile(fileEntry, dataObj) {
	// Create a FileWriter object for our FileEntry (log.txt).
	fileEntry.createWriter(function (fileWriter) {

		fileWriter.onwriteend = function() {
			//console.log("Successful file write...");
			readFile(fileEntry);
		};

		fileWriter.onerror = function (e) {
			//console.log("Failed file write: " + e.toString());
		};

		// If data object is not passed in,
		// create a new Blob instead.
		if (!dataObj) {
			dataObj = new Blob(['some file data'], { type: 'text/plain' });
		}

		fileWriter.write(dataObj);
	});
}

function onErrorCreateFile(error){
	alert('onErrorCreateFile:'+JSON.stringify(error));
}
function onErrorLoadFs(error){
	alert('onErrorLoadFs:'+JSON.stringify(error));
}


window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs : any) {

	//console.log('file system open: ' + fs.name);
	fs.root.getFile(cordova.file.documentsDirectory+"newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry : any) {

		//console.log("fileEntry is file?" + fileEntry.isFile.toString());
		// fileEntry.name == 'someFile.txt'
		// fileEntry.fullPath == '/someFile.txt'
		writeFile(fileEntry, null);

	}, onErrorCreateFile);

}, onErrorLoadFs);

*/