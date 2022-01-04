import {DestructableView} from "../lib/numbersLab/DestructableView";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Wallet} from "../model/Wallet";
import {Constants} from "../model/Constants";

let wallet : Wallet = DependencyInjectorInstance().getInstance(Wallet.name,'default', false);
let blockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);

class MessagesView extends DestructableView {
    
    constructor(container: string) {
        super(container);
    }
}

if (wallet !== null && blockchainExplorer !== null) {
    new MessagesView('#app');
} else {
    window.location.href = '#index';
}