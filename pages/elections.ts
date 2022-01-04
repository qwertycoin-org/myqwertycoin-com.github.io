import {
    AppState
} from '../model/AppState';
import {
    DestructableView
} from "../lib/numbersLab/DestructableView";
import {
    DependencyInjectorInstance
} from "../lib/numbersLab/DependencyInjector";
import {
    Wallet
} from "../model/Wallet";
import {
    Constants
} from "../model/Constants";
import {
    VueClass, VueVar, VueWatched
} from "../lib/numbersLab/VueAnnotate";
import {
    Election
} from "../model/Elections";

let wallet: Wallet = DependencyInjectorInstance().getInstance(Wallet.name, 'default', false);
let blockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);

class ElectionPageView extends DestructableView {

    @VueVar([]) elections!: any[];
    @VueVar([]) electionCategories!: any[];
    @VueVar('') totalDonations!: string;

    rawElectionData !: any;

    private intervalRefreshElections = 0;

    constructor(container: string) {
        super(container);
        AppState.enableLeftMenu();

        let self = this;
        self.intervalRefreshElections = setInterval(() => {
            this.getElections();
        }, 30 * 1000);
        this.getElections();
    }

    destruct(): Promise<void> {
		clearInterval(this.intervalRefreshElections);
		return super.destruct();
	}


    refreshElections() {
        this.getElections();
    }

    getElections() {
        let self = this;
        let Url = config.electionApiUrl;
        
        $.ajax({
            url: Url
        }).done(function(data: any) {
            self.totalDonations = data.totalDonations;
            self.elections = data.elections;
            self.electionCategories = data.categories;
        });

         
    }

    vote() {
        let self = this;
        blockchainExplorer.getHeight().then((blockchainHeight: number) => {
            let amount;
        })
    }
}

if (!wallet !== null && blockchainExplorer !== null) {
    new ElectionPageView('#app');
} else {
    window.location.href = '#index';
}