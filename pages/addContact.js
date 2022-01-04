var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../lib/numbersLab/DestructableView", "../lib/numbersLab/VueAnnotate", "../lib/numbersLab/DependencyInjector", "../model/Wallet", "../model/Constants", "./../model/Storage"], function (require, exports, DestructableView_1, VueAnnotate_1, DependencyInjector_1, Wallet_1, Constants_1, Storage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wallet = DependencyInjector_1.DependencyInjectorInstance().getInstance(Wallet_1.Wallet.name, 'default', false);
    var blockchainExplorer = DependencyInjector_1.DependencyInjectorInstance().getInstance(Constants_1.Constants.BLOCKCHAIN_EXPLORER);
    var AddContactView = /** @class */ (function (_super) {
        __extends(AddContactView, _super);
        function AddContactView(container) {
            return _super.call(this, container) || this;
        }
        AddContactView.hasOneStored = function () {
            return Storage_1.Storage.getItem('qwcContacts', null).then(function (contacts) {
                return contacts !== null;
            });
        };
        AddContactView.prototype.addContact = function () {
            var contact = { Name: this.contactName, Address: this.contactAddress };
            if (AddContactView.hasOneStored()) {
                swal({
                    type: 'success',
                    title: "We have Contacts",
                    confirmButtonText: i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
                });
                return Storage_1.Storage.getItem('qwcContacts', null).then(function (existingContacts) {
                    if (existingContacts !== null) {
                        var tempContacts = JSON.parse(existingContacts);
                        tempContacts.push(contact);
                        return Storage_1.Storage.setItem('qwcContacts', JSON.stringify(tempContacts)).then(function (contacties) {
                            swal({
                                type: 'success',
                                title: "We have saved Contacts: " + JSON.parse(contacties).length,
                                confirmButtonText: i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
                            });
                            return window.location.href = '#contactPage';
                        });
                    }
                    else {
                        swal({
                            type: 'error',
                            title: "Oh heavy shitload happened",
                            confirmButtonText: i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
                        });
                        var newContacts = [];
                        newContacts.push(contact);
                        return Storage_1.Storage.setItem('qwcContacts', JSON.stringify(newContacts)).then(function () {
                            return window.location.href = '#contactPage';
                        });
                    }
                });
            }
            else {
                var newContacts = [];
                swal({
                    type: 'success',
                    title: "We have no Contacts",
                    confirmButtonText: i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
                });
                newContacts.push(contact);
                return Storage_1.Storage.setItem('qwcContacts', JSON.stringify(newContacts)).then(function () {
                    return window.location.href = '#contactPage';
                });
            }
        };
        __decorate([
            VueAnnotate_1.VueVar('')
        ], AddContactView.prototype, "contactName", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], AddContactView.prototype, "contactAddress", void 0);
        return AddContactView;
    }(DestructableView_1.DestructableView));
    if (wallet !== null && blockchainExplorer !== null)
        new AddContactView('#app');
    else
        window.location.href = '#index';
});
