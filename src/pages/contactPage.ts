import {
    AppState
} from "../model/AppState";
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
    Storage
} from './../model/Storage';
import {
    VueVar
} from "../lib/numbersLab/VueAnnotate";

let wallet: Wallet = DependencyInjectorInstance().getInstance(Wallet.name, 'default', false);
let blockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);

class ContactPageView extends DestructableView {
    @VueVar([]) contacts!: any[];

    contactName!: string;
    contactAddress!: string;

    constructor(container: string) {
        super(container);
        AppState.enableLeftMenu();
        this.getContacts();
    }

    hasOneStored(): Promise < boolean > {
        return Storage.getItem('qwcContacts').then((contacts: any) => {
            return JSON.parse(contacts).length !== 0;
        });
    }

    getContacts() {
        if (this.hasOneStored()) {
            return Storage.getItem('qwcContacts').then((contacts: any) => {
                this.contacts = JSON.parse(contacts);
                /*
                swal({
                    type: 'success',
                    title: `loaded all ${this.contacts.length} contacts`,
                    confirmButtonText: i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
                });
                */
            });
        } else {
            this.contacts = [];
        }
    }

    contactDetails(contact: any) {
        swal({
            title: i18n.t('contactPage.contactDetailsBlock.title'),
            html: `
            <div class="tl">
                <div class="swal2-p">
                    ${i18n.t('contactPage.contactDetailsBlock.address')}: <a class="swal2-a" href="#send?address=${contact.Address}">${i18n.t('contactPage.contactDetailsBlock.sendTo')}${contact.Name}</a>
                </div>
            </div>
            `
        });
    }
}

if (wallet !== null && blockchainExplorer !== null)
    new ContactPageView('#app');
else
    window.location.href = '#index';