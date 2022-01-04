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
define(["require", "exports", "../lib/numbersLab/DestructableView", "../lib/numbersLab/DependencyInjector", "../model/Wallet", "../model/Constants"], function (require, exports, DestructableView_1, DependencyInjector_1, Wallet_1, Constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wallet = DependencyInjector_1.DependencyInjectorInstance().getInstance(Wallet_1.Wallet.name, 'default', false);
    var blockchainExplorer = DependencyInjector_1.DependencyInjectorInstance().getInstance(Constants_1.Constants.BLOCKCHAIN_EXPLORER);
    var MessagesView = /** @class */ (function (_super) {
        __extends(MessagesView, _super);
        function MessagesView(container) {
            return _super.call(this, container) || this;
        }
        return MessagesView;
    }(DestructableView_1.DestructableView));
    if (wallet !== null && blockchainExplorer !== null) {
        new MessagesView('#app');
    }
    else {
        window.location.href = '#index';
    }
});
