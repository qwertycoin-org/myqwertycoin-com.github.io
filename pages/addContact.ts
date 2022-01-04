import {DestructableView} from "../lib/numbersLab/DestructableView";
import { VueVar } from "../lib/numbersLab/VueAnnotate";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Wallet} from "../model/Wallet";
import {Constants} from "../model/Constants";
import { Storage } from './../model/Storage';

let wallet : Wallet = DependencyInjectorInstance().getInstance(Wallet.name,'default', false);
let blockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);

class AddContactView extends DestructableView {
    @VueVar('') contactName !: string;
    @VueVar('') contactAddress !: string;

    constructor(container : string) {
        super(container);
    }

    static hasOneStored(): Promise<boolean> {
        return Storage.getItem('qwcContacts', null).then(function(contacts: any[]) {
            return contacts !== null;
        });
    }

    addContact() {
        let contact = { Name: this.contactName, Address: this.contactAddress }
        if(AddContactView.hasOneStored()) {
            swal({
                type:'success',
                title: `We have Contacts`,
                confirmButtonText:i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
            });
            return Storage.getItem('qwcContacts', null).then((existingContacts) => {
                if (existingContacts !== null) {
                    let tempContacts: any[] = JSON.parse(existingContacts);
                    tempContacts.push(contact);
                    return Storage.setItem('qwcContacts', JSON.stringify(tempContacts)).then((contacties: any) => {
                        swal({
                            type:'success',
                            title: `We have saved Contacts: ${JSON.parse(contacties).length}`,
                            confirmButtonText:i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
                        });
                        return window.location.href = '#contactPage';
                    });
                } else {
                    swal({
                        type:'error',
                        title: `Oh heavy shitload happened`,
                        confirmButtonText:i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
                    });
                    let newContacts: any[] = [];
                    newContacts.push(contact);
                    return Storage.setItem('qwcContacts', JSON.stringify(newContacts)).then(() => {
                        return window.location.href = '#contactPage';
                    });
                }
            });
        } else {
            let newContacts: any[] = [];
            swal({
                type:'success',
                title: `We have no Contacts`,
                confirmButtonText:i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
            });
            newContacts.push(contact);
            return Storage.setItem('qwcContacts', JSON.stringify(newContacts)).then(() => {
                return window.location.href = '#contactPage';
            });
        }
    }

}

if(wallet !== null && blockchainExplorer !== null)
	new AddContactView('#app');
else
	window.location.href = '#index';