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
define(["require", "exports", "../model/AppState", "../lib/numbersLab/DestructableView", "../lib/numbersLab/DependencyInjector", "../model/Wallet", "../model/Constants", "../lib/numbersLab/VueAnnotate"], function (require, exports, AppState_1, DestructableView_1, DependencyInjector_1, Wallet_1, Constants_1, VueAnnotate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wallet = DependencyInjector_1.DependencyInjectorInstance().getInstance(Wallet_1.Wallet.name, 'default', false);
    var blockchainExplorer = DependencyInjector_1.DependencyInjectorInstance().getInstance(Constants_1.Constants.BLOCKCHAIN_EXPLORER);
    var ElectionPageView = /** @class */ (function (_super) {
        __extends(ElectionPageView, _super);
        function ElectionPageView(container) {
            var _this = _super.call(this, container) || this;
            _this.intervalRefreshElections = 0;
            AppState_1.AppState.enableLeftMenu();
            var self = _this;
            self.intervalRefreshElections = setInterval(function () {
                _this.getElections();
            }, 30 * 1000);
            _this.getElections();
            return _this;
        }
        ElectionPageView.prototype.destruct = function () {
            clearInterval(this.intervalRefreshElections);
            return _super.prototype.destruct.call(this);
        };
        ElectionPageView.prototype.refreshElections = function () {
            this.getElections();
        };
        ElectionPageView.prototype.getElections = function () {
            var self = this;
            var Url = config.electionApiUrl;
            $.ajax({
                url: Url
            }).done(function (data) {
                self.totalDonations = data.totalDonations;
                self.elections = data.elections;
                self.electionCategories = data.categories;
            });
        };
        ElectionPageView.prototype.vote = function () {
            var self = this;
            blockchainExplorer.getHeight().then(function (blockchainHeight) {
                var amount;
            });
        };
        __decorate([
            VueAnnotate_1.VueVar([])
        ], ElectionPageView.prototype, "elections", void 0);
        __decorate([
            VueAnnotate_1.VueVar([])
        ], ElectionPageView.prototype, "electionCategories", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionPageView.prototype, "totalDonations", void 0);
        return ElectionPageView;
    }(DestructableView_1.DestructableView));
    if (!wallet !== null && blockchainExplorer !== null) {
        new ElectionPageView('#app');
    }
    else {
        window.location.href = '#index';
    }
});
