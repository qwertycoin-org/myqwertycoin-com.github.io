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
define(["require", "exports", "../lib/numbersLab/VueAnnotate", "../lib/numbersLab/DependencyInjector", "../model/Wallet", "../lib/numbersLab/DestructableView", "../model/Constants", "../model/AppState", "../filters/Filters", "../model/Currency"], function (require, exports, VueAnnotate_1, DependencyInjector_1, Wallet_1, DestructableView_1, Constants_1, AppState_1, Filters_1, Currency_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wallet = DependencyInjector_1.DependencyInjectorInstance().getInstance(Wallet_1.Wallet.name, 'default', false);
    var blockchainExplorer = DependencyInjector_1.DependencyInjectorInstance().getInstance(Constants_1.Constants.BLOCKCHAIN_EXPLORER);
    var AccountView = /** @class */ (function (_super) {
        __extends(AccountView, _super);
        function AccountView(container) {
            var _this = _super.call(this, container) || this;
            _this.intervalRefresh = 0;
            _this.intervalPrice = 0;
            var self = _this;
            AppState_1.AppState.enableLeftMenu();
            _this.intervalRefresh = setInterval(function () {
                self.refresh();
            }, 1000);
            _this.intervalPrice = setInterval(function () {
                self.refreshPrice();
            }, 60 * 1000);
            _this.refresh();
            _this.refreshPrice();
            Currency_1.Currency.getCurrency().then(function (currency) {
                _this.currency = currency;
            });
            return _this;
        }
        AccountView.prototype.destruct = function () {
            clearInterval(this.intervalRefresh);
            clearInterval(this.intervalPrice);
            return _super.prototype.destruct.call(this);
        };
        AccountView.prototype.refresh = function () {
            var self = this;
            blockchainExplorer.getHeight().then(function (height) {
                self.blockchainHeight = height;
            });
            this.refreshWallet();
        };
        AccountView.prototype.moreInfoOnTx = function (transaction) {
            var explorerUrlHash = config.mainnetExplorerUrlHash;
            var explorerUrlBlock = config.mainnetExplorerUrlBlock;
            var transFee = 100000000; //TODO
            var feesHtml = '';
            if (transaction.getAmount() < 0)
                feesHtml = "<div>" + i18n.t('accountPage.txDetails.feesOnTx') + ": " + (transFee / Math.pow(10, config.coinUnitPlaces)) + "</a> " + config.coinSymbol + "</div>";
            var paymentId = '';
            if (transaction.paymentId !== '') {
                paymentId = "<div>" + i18n.t('accountPage.txDetails.paymentId') + ": " + transaction.paymentId + "</a></div>";
            }
            var unlockStatus = '';
            var unlckStatus = '';
            var transHeight = transaction.blockHeight + config.txMinConfirms;
            var actualHeight = this.currentScanBlock;
            if (transHeight >= actualHeight) {
                unlckStatus = (((transHeight - actualHeight) - 11) * -1).toString() + '/' + config.txMinConfirms + ' Confirmations';
            }
            else {
                unlckStatus = config.txMinConfirms + '/' + config.txMinConfirms + ' Confirmations';
            }
            unlockStatus = "<div>" + i18n.t('accountPage.txDetails.unlockStatus') + ": " + unlckStatus + "</a></div>";
            var txPrivKeyMessage = '';
            var txPrivKey = wallet.findTxPrivateKeyWithHash(transaction.hash);
            if (txPrivKey !== null) {
                txPrivKeyMessage = "<div>" + i18n.t('accountPage.txDetails.txPrivKey') + ": " + txPrivKey + "</a></div>";
            }
            swal({
                title: i18n.t('accountPage.txDetails.title'),
                html: "\n<div class=\"tl\" >\n\t<div>" + i18n.t('accountPage.txDetails.txHash') + ": <a href=\"" + explorerUrlHash.replace('{ID}', transaction.hash) + "\" target=\"_blank\">Check on Explorer</a></div>\n\t" + paymentId + "\n\t" + unlockStatus + "\n\t" + feesHtml + "\n\t" + txPrivKeyMessage + "\n\t<div>" + i18n.t('accountPage.txDetails.blockHeight') + ": <a href=\"" + explorerUrlBlock.replace('{ID}', '' + transaction.blockHeight) + "\" target=\"_blank\">" + transaction.blockHeight + "</a></div>\n</div>"
            });
        };
        AccountView.prototype.refreshWallet = function () {
            this.currentScanBlock = wallet.lastHeight;
            this.walletAmount = wallet.amount;
            this.unlockedWalletAmount = wallet.unlockedAmount(this.currentScanBlock);
            if (wallet.getAll().length + wallet.txsMem.length !== this.transactions.length) {
                this.transactions = wallet.txsMem.concat(wallet.getTransactionsCopy().reverse());
            }
        };
        AccountView.prototype.refreshPrice = function () {
            var _this = this;
            var self = this;
            Currency_1.Currency.getCurrency().then(function (currency) {
                _this.currency = currency;
            });
            self.getCoin('qwertycoin').then(function (json) {
                var temp = json;
                self.geckoCurrentPrice = temp;
            });
        };
        AccountView.prototype.getCoin = function (coin) {
            if (Constants_1.Constants.DEBUG_STATE) {
                console.log("Starting to fetch " + coin + " market_data.");
            }
            return fetch("https://api.coingecko.com/api/v3/coins/" + coin)
                .then(function (res) { return res.json(); });
        };
        __decorate([
            VueAnnotate_1.VueVar([])
        ], AccountView.prototype, "transactions", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], AccountView.prototype, "walletAmount", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], AccountView.prototype, "walletAmountCurrency", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], AccountView.prototype, "unlockedWalletAmount", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], AccountView.prototype, "currentScanBlock", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], AccountView.prototype, "blockchainHeight", void 0);
        __decorate([
            VueAnnotate_1.VueVar(Math.pow(10, config.coinUnitPlaces))
        ], AccountView.prototype, "currencyDivider", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], AccountView.prototype, "geckoCurrentPrice", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], AccountView.prototype, "currency", void 0);
        AccountView = __decorate([
            VueAnnotate_1.VueRequireFilter('satoshis', Filters_1.VueFilterSatoshis),
            VueAnnotate_1.VueRequireFilter('fiat', Filters_1.VueFilterFiat)
        ], AccountView);
        return AccountView;
    }(DestructableView_1.DestructableView));
    if (wallet !== null && blockchainExplorer !== null)
        new AccountView('#app');
    else
        window.location.href = '#index';
});
