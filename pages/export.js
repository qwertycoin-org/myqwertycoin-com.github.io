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
define(["require", "exports", "../lib/numbersLab/VueAnnotate", "../lib/numbersLab/DependencyInjector", "../model/Wallet", "../lib/numbersLab/DestructableView", "../model/Constants", "../model/WalletRepository", "../model/Mnemonic"], function (require, exports, VueAnnotate_1, DependencyInjector_1, Wallet_1, DestructableView_1, Constants_1, WalletRepository_1, Mnemonic_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wallet = DependencyInjector_1.DependencyInjectorInstance().getInstance(Wallet_1.Wallet.name, 'default', false);
    var blockchainExplorer = DependencyInjector_1.DependencyInjectorInstance().getInstance(Constants_1.Constants.BLOCKCHAIN_EXPLORER);
    var ExportView = /** @class */ (function (_super) {
        __extends(ExportView, _super);
        function ExportView(container) {
            var _this = _super.call(this, container) || this;
            var self = _this;
            _this.publicAddress = wallet.getPublicAddress();
            _this.nativePlatform = window.native;
            return _this;
        }
        ExportView.prototype.destruct = function () {
            return _super.prototype.destruct.call(this);
        };
        ExportView.prototype.askUserPassword = function () {
            return swal({
                input: 'password',
                showCancelButton: true,
                title: i18n.t('global.openWalletModal.title'),
                confirmButtonText: i18n.t('exportPage.mnemonicLangSelectionModal.confirmText'),
                cancelButtonText: i18n.t('exportPage.mnemonicKeyModal.confirmText'),
            }).then(function (result) {
                if (result.value) {
                    var savePassword_1 = result.value;
                    // let password = prompt();
                    // let wallet = WalletRepository.getMain();
                    return WalletRepository_1.WalletRepository.getLocalWalletWithPassword(savePassword_1).then(function (wallet) {
                        if (wallet !== null) {
                            return { wallet: wallet, password: savePassword_1 };
                        }
                        else {
                            swal({
                                type: 'error',
                                title: i18n.t('global.invalidPasswordModal.title'),
                                text: i18n.t('global.invalidPasswordModal.content'),
                                confirmButtonText: i18n.t('global.invalidPasswordModal.confirmText'),
                            });
                        }
                        return null;
                    });
                }
                return null;
            });
        };
        ExportView.prototype.getPrivateKeys = function () {
            this.askUserPassword().then(function (params) {
                if (params !== null && params.wallet !== null) {
                    swal({
                        title: i18n.t('exportPage.walletKeysModal.title'),
                        confirmButtonText: i18n.t('exportPage.walletKeysModal.confirmText'),
                        html: i18n.t('exportPage.walletKeysModal.content', {
                            privViewKey: params.wallet.keys.priv.view,
                            privSpendKey: params.wallet.keys.priv.spend
                        }),
                    });
                }
            });
        };
        ExportView.prototype.getMnemonicPhrase = function () {
            this.askUserPassword().then(function (params) {
                if (params !== null && params.wallet !== null) {
                    swal({
                        title: i18n.t('exportPage.mnemonicLangSelectionModal.title'),
                        input: 'select',
                        showCancelButton: true,
                        confirmButtonText: i18n.t('exportPage.mnemonicLangSelectionModal.confirmText'),
                        inputOptions: {
                            'english': 'English',
                            'chinese': 'Chinese (simplified)',
                            'dutch': 'Dutch',
                            'electrum': 'Electrum',
                            'esperanto': 'Esperanto',
                            'french': 'French',
                            'italian': 'Italian',
                            'japanese': 'Japanese',
                            'lojban': 'Lojban',
                            'portuguese': 'Portuguese',
                            'russian': 'Russian',
                            'spanish': 'Spanish',
                        }
                    }).then(function (mnemonicLangResult) {
                        if (mnemonicLangResult.value) {
                            var mnemonic = Mnemonic_1.Mnemonic.mn_encode(params.wallet.keys.priv.spend, mnemonicLangResult.value);
                            swal({
                                title: i18n.t('exportPage.mnemonicKeyModal.title'),
                                confirmButtonText: i18n.t('exportPage.mnemonicKeyModal.confirmText'),
                                html: i18n.t('exportPage.mnemonicKeyModal.content', {
                                    mnemonic: mnemonic,
                                }),
                            });
                        }
                    });
                }
            });
        };
        ExportView.prototype.fileExport = function () {
            this.askUserPassword().then(function (params) {
                if (params !== null && params.wallet !== null) {
                    var blob = new Blob([JSON.stringify(WalletRepository_1.WalletRepository.getEncrypted(params.wallet, params.password))], { type: "application/json" });
                    saveAs(blob, "wallet.json");
                }
            });
        };
        ExportView.prototype.exportEncryptedPdf = function () {
            this.askUserPassword().then(function (params) {
                if (params !== null && params.wallet !== null) {
                    WalletRepository_1.WalletRepository.downloadEncryptedPdf(params.wallet);
                }
            });
        };
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ExportView.prototype, "publicAddress", void 0);
        __decorate([
            VueAnnotate_1.VueVar(false)
        ], ExportView.prototype, "nativePlatform", void 0);
        return ExportView;
    }(DestructableView_1.DestructableView));
    if (wallet !== null && blockchainExplorer !== null)
        new ExportView('#app');
    else
        window.location.href = '#index';
});
