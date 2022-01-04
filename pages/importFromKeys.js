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
define(["require", "exports", "../lib/numbersLab/DestructableView", "../lib/numbersLab/VueAnnotate", "../model/AppState", "../model/Password", "../model/Wallet", "../model/KeysRepository", "../providers/BlockchainExplorerProvider", "../model/Constants", "../model/Cn"], function (require, exports, DestructableView_1, VueAnnotate_1, AppState_1, Password_1, Wallet_1, KeysRepository_1, BlockchainExplorerProvider_1, Constants_1, Cn_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    AppState_1.AppState.enableLeftMenu();
    var blockchainExplorer = BlockchainExplorerProvider_1.BlockchainExplorerProvider.getInstance();
    var ImportView = /** @class */ (function (_super) {
        __extends(ImportView, _super);
        function ImportView(container) {
            return _super.call(this, container) || this;
        }
        ImportView.prototype.formValid = function () {
            if (this.password != this.password2)
                return false;
            if (!(this.password !== '' && (!this.insecurePassword || this.forceInsecurePassword)))
                return false;
            if (!((!this.viewOnly && this.validPrivateSpendKey) ||
                (this.viewOnly && this.validPublicAddress && this.validPrivateViewKey)))
                return false;
            return true;
        };
        ImportView.prototype.importWallet = function () {
            var self = this;
            blockchainExplorer.getHeight().then(function (currentHeight) {
                var newWallet = new Wallet_1.Wallet();
                if (self.viewOnly) {
                    var decodedPublic = Cn_1.Cn.decode_address(self.publicAddress.trim());
                    newWallet.keys = {
                        priv: {
                            spend: '',
                            view: self.privateViewKey.trim()
                        },
                        pub: {
                            spend: decodedPublic.spend,
                            view: decodedPublic.view,
                        }
                    };
                }
                else {
                    if (Constants_1.Constants.DEBUG_STATE) {
                        console.log(1);
                    }
                    var viewkey = self.privateViewKey.trim();
                    if (viewkey === '') {
                        viewkey = Cn_1.Cn.generate_keys(Cn_1.CnUtils.cn_fast_hash(self.privateSpendKey.trim())).sec;
                    }
                    if (Constants_1.Constants.DEBUG_STATE) {
                        console.log(1, viewkey);
                    }
                    newWallet.keys = KeysRepository_1.KeysRepository.fromPriv(self.privateSpendKey.trim(), viewkey);
                    if (Constants_1.Constants.DEBUG_STATE) {
                        console.log(1);
                    }
                }
                var height = self.importHeight; //never trust a perfect value from the user
                if (height >= currentHeight) {
                    height = currentHeight - 1;
                }
                height = height - 10;
                if (height < 0)
                    height = 0;
                if (height > currentHeight)
                    height = currentHeight;
                newWallet.lastHeight = height;
                newWallet.creationHeight = newWallet.lastHeight;
                AppState_1.AppState.openWallet(newWallet, self.password);
                window.location.href = '#account';
            });
        };
        ImportView.prototype.passwordWatch = function () {
            if (!Password_1.Password.checkPasswordConstraints(this.password, false)) {
                this.insecurePassword = true;
            }
            else
                this.insecurePassword = false;
        };
        ImportView.prototype.importHeightWatch = function () {
            if (this.importHeight === '')
                this.importHeight = 0;
            if (this.importHeight < 0) {
                this.importHeight = 0;
            }
            this.importHeight = parseInt('' + this.importHeight);
        };
        ImportView.prototype.privateSpendKeyWatch = function () {
            this.validPrivateSpendKey = this.privateSpendKey.trim().length == 64;
        };
        ImportView.prototype.privateViewKeyWatch = function () {
            this.validPrivateViewKey = this.privateViewKey.trim().length == 64 || (!this.viewOnly && this.privateViewKey.trim().length == 0);
        };
        ImportView.prototype.publicAddressWatch = function () {
            try {
                Cn_1.Cn.decode_address(this.publicAddress.trim());
                this.validPublicAddress = true;
            }
            catch (e) {
                this.validPublicAddress = false;
            }
        };
        ImportView.prototype.forceInsecurePasswordCheck = function () {
            var self = this;
            self.forceInsecurePassword = true;
        };
        __decorate([
            VueAnnotate_1.VueVar(false)
        ], ImportView.prototype, "viewOnly", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ImportView.prototype, "privateSpendKey", void 0);
        __decorate([
            VueAnnotate_1.VueVar(false)
        ], ImportView.prototype, "validPrivateSpendKey", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ImportView.prototype, "privateViewKey", void 0);
        __decorate([
            VueAnnotate_1.VueVar(false)
        ], ImportView.prototype, "validPrivateViewKey", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ImportView.prototype, "publicAddress", void 0);
        __decorate([
            VueAnnotate_1.VueVar(false)
        ], ImportView.prototype, "validPublicAddress", void 0);
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
            VueAnnotate_1.VueVar(0)
        ], ImportView.prototype, "importHeight", void 0);
        __decorate([
            VueAnnotate_1.VueWatched()
        ], ImportView.prototype, "passwordWatch", null);
        __decorate([
            VueAnnotate_1.VueWatched()
        ], ImportView.prototype, "importHeightWatch", null);
        __decorate([
            VueAnnotate_1.VueWatched()
        ], ImportView.prototype, "privateSpendKeyWatch", null);
        __decorate([
            VueAnnotate_1.VueWatched()
        ], ImportView.prototype, "privateViewKeyWatch", null);
        __decorate([
            VueAnnotate_1.VueWatched()
        ], ImportView.prototype, "publicAddressWatch", null);
        return ImportView;
    }(DestructableView_1.DestructableView));
    new ImportView('#app');
});
