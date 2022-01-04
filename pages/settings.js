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
define(["require", "exports", "../lib/numbersLab/DestructableView", "../lib/numbersLab/VueAnnotate", "../model/WalletRepository", "../lib/numbersLab/DependencyInjector", "../model/Wallet", "../model/AppState", "../model/Translations", "../providers/BlockchainExplorerProvider", "../model/Currency", "../model/WalletWatchdog"], function (require, exports, DestructableView_1, VueAnnotate_1, WalletRepository_1, DependencyInjector_1, Wallet_1, AppState_1, Translations_1, BlockchainExplorerProvider_1, Currency_1, WalletWatchdog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wallet = DependencyInjector_1.DependencyInjectorInstance().getInstance(Wallet_1.Wallet.name, 'default', false);
    var blockchainExplorer = BlockchainExplorerProvider_1.BlockchainExplorerProvider.getInstance();
    var walletWatchdog = DependencyInjector_1.DependencyInjectorInstance().getInstance(WalletWatchdog_1.WalletWatchdog.name, 'default', false);
    var SettingsView = /** @class */ (function (_super) {
        __extends(SettingsView, _super);
        function SettingsView(container) {
            var _this = _super.call(this, container) || this;
            var self = _this;
            _this.readSpeed = wallet.options.readSpeed;
            _this.checkMinerTx = wallet.options.checkMinerTx;
            _this.customNode = wallet.options.customNode;
            _this.nodeUrl = wallet.options.nodeUrl;
            _this.nodeList = config.nodeList;
            _this.creationHeight = wallet.creationHeight;
            _this.scanHeight = wallet.lastHeight;
            blockchainExplorer.getHeight().then(function (height) {
                self.maxHeight = height;
            });
            Translations_1.Translations.getLang().then(function (userLang) {
                _this.language = userLang;
            });
            Currency_1.Currency.getCurrency().then(function (currency) {
                _this.countrycurrency = currency;
            });
            if (typeof window.cordova !== 'undefined' && typeof window.cordova.getAppVersion !== 'undefined') {
                window.cordova.getAppVersion.getVersionNumber().then(function (version) {
                    _this.nativeVersionNumber = version;
                });
                window.cordova.getAppVersion.getVersionCode().then(function (version) {
                    _this.nativeVersionCode = version;
                });
            }
            return _this;
        }
        SettingsView.prototype.languageWatch = function () {
            Translations_1.Translations.setBrowserLang(this.language);
            Translations_1.Translations.loadLangTranslation(this.language);
        };
        SettingsView.prototype.deleteWallet = function () {
            swal({
                title: i18n.t('settingsPage.deleteWalletModal.title'),
                html: i18n.t('settingsPage.deleteWalletModal.content'),
                showCancelButton: true,
                confirmButtonText: i18n.t('settingsPage.deleteWalletModal.confirmText'),
                cancelButtonText: i18n.t('settingsPage.deleteWalletModal.cancelText'),
            }).then(function (result) {
                if (result.value) {
                    AppState_1.AppState.disconnect();
                    DependencyInjector_1.DependencyInjectorInstance().register(Wallet_1.Wallet.name, undefined, 'default');
                    WalletRepository_1.WalletRepository.deleteLocalCopy();
                    window.location.href = '#index';
                }
            });
        };
        SettingsView.prototype.readSpeedWatch = function () { this.updateWalletOptions(); };
        SettingsView.prototype.checkMinerTxWatch = function () { this.updateWalletOptions(); };
        SettingsView.prototype.creationHeightWatch = function () {
            if (this.creationHeight < 0)
                this.creationHeight = 0;
            if (this.creationHeight > this.maxHeight && this.maxHeight !== -1)
                this.creationHeight = this.maxHeight;
        };
        SettingsView.prototype.scanHeightWatch = function () {
            if (this.scanHeight < 0)
                this.scanHeight = 0;
            if (this.scanHeight > this.maxHeight && this.maxHeight !== -1)
                this.scanHeight = this.maxHeight;
        };
        SettingsView.prototype.updateConnectionSettings = function () {
            var options = wallet.options;
            options.customNode = this.customNode;
            options.nodeUrl = this.nodeUrl;
            wallet.options = options;
            walletWatchdog.signalWalletUpdate();
        };
        SettingsView.prototype.updateWalletOptions = function () {
            var options = wallet.options;
            options.readSpeed = this.readSpeed;
            options.checkMinerTx = this.checkMinerTx;
            options.customNode = this.customNode;
            options.nodeUrl = this.nodeUrl;
            wallet.options = options;
            walletWatchdog.signalWalletUpdate();
        };
        SettingsView.prototype.updateWalletSettings = function () {
            wallet.creationHeight = this.creationHeight;
            wallet.lastHeight = this.scanHeight;
            Currency_1.Currency.setCurrency(this.countrycurrency);
            //console.log("Currency choose");
            //console.log(this.countrycurrency);
            walletWatchdog.signalWalletUpdate();
        };
        __decorate([
            VueAnnotate_1.VueVar(10)
        ], SettingsView.prototype, "readSpeed", void 0);
        __decorate([
            VueAnnotate_1.VueVar(false)
        ], SettingsView.prototype, "checkMinerTx", void 0);
        __decorate([
            VueAnnotate_1.VueVar(false)
        ], SettingsView.prototype, "customNode", void 0);
        __decorate([
            VueAnnotate_1.VueVar('https://node-02.qwertycoin.org/sslnode/')
        ], SettingsView.prototype, "nodeUrl", void 0);
        __decorate([
            VueAnnotate_1.VueVar([])
        ], SettingsView.prototype, "nodeList", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], SettingsView.prototype, "creationHeight", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], SettingsView.prototype, "scanHeight", void 0);
        __decorate([
            VueAnnotate_1.VueVar(-1)
        ], SettingsView.prototype, "maxHeight", void 0);
        __decorate([
            VueAnnotate_1.VueVar('en')
        ], SettingsView.prototype, "language", void 0);
        __decorate([
            VueAnnotate_1.VueVar('btc')
        ], SettingsView.prototype, "countrycurrency", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], SettingsView.prototype, "nativeVersionCode", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], SettingsView.prototype, "nativeVersionNumber", void 0);
        __decorate([
            VueAnnotate_1.VueWatched()
        ], SettingsView.prototype, "languageWatch", null);
        __decorate([
            VueAnnotate_1.VueWatched()
        ], SettingsView.prototype, "readSpeedWatch", null);
        __decorate([
            VueAnnotate_1.VueWatched()
        ], SettingsView.prototype, "checkMinerTxWatch", null);
        __decorate([
            VueAnnotate_1.VueWatched()
        ], SettingsView.prototype, "creationHeightWatch", null);
        __decorate([
            VueAnnotate_1.VueWatched()
        ], SettingsView.prototype, "scanHeightWatch", null);
        return SettingsView;
    }(DestructableView_1.DestructableView));
    if (wallet !== null && blockchainExplorer !== null)
        new SettingsView('#app');
    else
        window.location.href = '#index';
});
