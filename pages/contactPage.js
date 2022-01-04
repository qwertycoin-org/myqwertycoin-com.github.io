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
define(["require", "exports", "../model/AppState", "../lib/numbersLab/DestructableView", "../lib/numbersLab/DependencyInjector", "../model/Wallet", "../model/Constants", "./../model/Storage", "../lib/numbersLab/VueAnnotate"], function (require, exports, AppState_1, DestructableView_1, DependencyInjector_1, Wallet_1, Constants_1, Storage_1, VueAnnotate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wallet = DependencyInjector_1.DependencyInjectorInstance().getInstance(Wallet_1.Wallet.name, 'default', false);
    var blockchainExplorer = DependencyInjector_1.DependencyInjectorInstance().getInstance(Constants_1.Constants.BLOCKCHAIN_EXPLORER);
    var ContactPageView = /** @class */ (function (_super) {
        __extends(ContactPageView, _super);
        function ContactPageView(container) {
            var _this = _super.call(this, container) || this;
            AppState_1.AppState.enableLeftMenu();
            _this.getContacts();
            return _this;
        }
        ContactPageView.prototype.hasOneStored = function () {
            return Storage_1.Storage.getItem('qwcContacts').then(function (contacts) {
                return JSON.parse(contacts).length !== 0;
            });
        };
        ContactPageView.prototype.getContacts = function () {
            var _this = this;
            if (this.hasOneStored()) {
                return Storage_1.Storage.getItem('qwcContacts').then(function (contacts) {
                    _this.contacts = JSON.parse(contacts);
                    /*
                    swal({
                        type: 'success',
                        title: `loaded all ${this.contacts.length} contacts`,
                        confirmButtonText: i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
                    });
                    */
                });
            }
            else {
                this.contacts = [];
            }
        };
        ContactPageView.prototype.contactDetails = function (contact) {
            swal({
                title: i18n.t('contactPage.contactDetailsBlock.title'),
                html: "\n            <div class=\"tl\">\n                <div class=\"swal2-p\">\n                    " + i18n.t('contactPage.contactDetailsBlock.address') + ": <a class=\"swal2-a\" href=\"#send?address=" + contact.Address + "\">" + i18n.t('contactPage.contactDetailsBlock.sendTo') + contact.Name + "</a>\n                </div>\n            </div>\n            "
            });
        };
        __decorate([
            VueAnnotate_1.VueVar([])
        ], ContactPageView.prototype, "contacts", void 0);
        return ContactPageView;
    }(DestructableView_1.DestructableView));
    if (wallet !== null && blockchainExplorer !== null)
        new ContactPageView('#app');
    else
        window.location.href = '#index';
});
