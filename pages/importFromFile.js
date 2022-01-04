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
define(["require", "exports", "../lib/numbersLab/DestructableView", "../lib/numbersLab/VueAnnotate", "../model/AppState", "../model/Password", "../providers/BlockchainExplorerProvider", "../model/WalletRepository"], function (require, exports, DestructableView_1, VueAnnotate_1, AppState_1, Password_1, BlockchainExplorerProvider_1, WalletRepository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    AppState_1.AppState.enableLeftMenu();
    var blockchainExplorer = BlockchainExplorerProvider_1.BlockchainExplorerProvider.getInstance();
    var ImportView = /** @class */ (function (_super) {
        __extends(ImportView, _super);
        function ImportView(container) {
            var _this = _super.call(this, container) || this;
            _this.rawFile = null;
            _this.invalidRawFile = false;
            return _this;
        }
        ImportView.prototype.formValid = function () {
            if (this.password != this.password2)
                return false;
            if (!(this.password !== '' && (!this.insecurePassword || this.forceInsecurePassword)))
                return false;
            if (this.rawFile === null)
                return false;
            return true;
        };
        ImportView.prototype.selectFile = function () {
            var self = this;
            var element = $('<input type="file">');
            self.invalidRawFile = true;
            element.on('change', function (event) {
                var files = event.target.files; // FileList object
                if (files.length > 0) {
                    var fileReader_1 = new FileReader();
                    fileReader_1.onload = function () {
                        try {
                            if (typeof fileReader_1.result === "string") {
                                self.rawFile = JSON.parse(fileReader_1.result);
                            }
                            self.invalidRawFile = false;
                        }
                        catch (e) {
                            self.invalidRawFile = true;
                        }
                    };
                    fileReader_1.readAsText(files[0]);
                }
            });
            element.click();
        };
        ImportView.prototype.importWallet = function () {
            var self = this;
            blockchainExplorer.getHeight().then(function (currentHeight) {
                setTimeout(function () {
                    var newWallet = WalletRepository_1.WalletRepository.decodeWithPassword(self.rawFile, self.password);
                    if (newWallet !== null) {
                        newWallet.recalculateIfNotViewOnly();
                        AppState_1.AppState.openWallet(newWallet, self.password);
                        window.location.href = '#account';
                    }
                    else {
                        swal({
                            type: 'error',
                            title: i18n.t('global.invalidPasswordModal.title'),
                            text: i18n.t('global.invalidPasswordModal.content'),
                            confirmButtonText: i18n.t('global.invalidPasswordModal.confirmText'),
                        });
                    }
                }, 1);
            });
        };
        ImportView.prototype.passwordWatch = function () {
            if (!Password_1.Password.checkPasswordConstraints(this.password, false)) {
                this.insecurePassword = true;
            }
            else
                this.insecurePassword = false;
        };
        ImportView.prototype.forceInsecurePasswordCheck = function () {
            var self = this;
            self.forceInsecurePassword = true;
        };
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ImportView.prototype, "password", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ImportView.prototype, "password2", void 0);
        __decorate([
            VueAnnotate_1.VueVar(false)
        ], ImportView.prototype, "insecurePassword", void 0);
        __decorate([
            VueAnnotate_1.VueVar(false)
        ], ImportView.prototype, "forceInsecurePassword", void 0);
        __decorate([
            VueAnnotate_1.VueWatched()
        ], ImportView.prototype, "passwordWatch", null);
        return ImportView;
    }(DestructableView_1.DestructableView));
    new ImportView('#app');
});
