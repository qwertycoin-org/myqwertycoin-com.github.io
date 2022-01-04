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
define(["require", "exports", "../lib/numbersLab/DestructableView", "../lib/numbersLab/VueAnnotate", "../model/TransactionsExplorer", "../lib/numbersLab/DependencyInjector", "../model/Constants", "../model/Wallet", "../utils/Url", "../model/AppState", "../providers/BlockchainExplorerProvider", "../model/WalletWatchdog"], function (require, exports, DestructableView_1, VueAnnotate_1, TransactionsExplorer_1, DependencyInjector_1, Constants_1, Wallet_1, Url_1, AppState_1, BlockchainExplorerProvider_1, WalletWatchdog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wallet = DependencyInjector_1.DependencyInjectorInstance().getInstance(Wallet_1.Wallet.name, 'default', false);
    var blockchainExplorer = BlockchainExplorerProvider_1.BlockchainExplorerProvider.getInstance();
    AppState_1.AppState.enableLeftMenu();
    var ElectionDetailsView = /** @class */ (function (_super) {
        __extends(ElectionDetailsView, _super);
        function ElectionDetailsView(container) {
            var _this = _super.call(this, container) || this;
            _this.intervalRefreshElections = 0;
            _this.questionID = Url_1.Url.getHashSearchParameter('questionID').replace(/%20/g, " ");
            var self = _this;
            self.intervalRefreshElections = setInterval(function () {
                _this.getElections();
            }, 30 * 1000);
            _this.getElections();
            return _this;
        }
        ElectionDetailsView.prototype.destruct = function () {
            clearInterval(this.intervalRefreshElections);
            return _super.prototype.destruct.call(this);
        };
        ElectionDetailsView.prototype.getElections = function () {
            var self = this;
            var Url = config.electionApiUrl;
            $.ajax({
                url: Url
            }).done(function (data) {
                self.totalDonations = data.totalDonations;
                self.elections = data.elections;
                self.electionCategories = data.categories;
                var temp = self.elections.find(function (election) {
                    return election.questionID == self.questionID;
                });
                self.question = temp.question;
                self.answers = temp.answers;
                self.description = temp.description.replace(/<br\/>/g, " ");
                self.qwcPerVote = temp.qwcPerVote;
                self.neededBTC = temp.neededBTC;
                self.minimumVotes = temp.minimumVotes;
            });
        };
        ElectionDetailsView.prototype.send = function (address) {
            var self = this;
            blockchainExplorer.getHeight().then(function (blockchainHeight) {
                var amount = parseFloat(self.qwcPerVote);
                if (address !== null) {
                    //todo use BigInteger
                    if (amount * Math.pow(10, config.coinUnitPlaces) > wallet.unlockedAmount(blockchainHeight)) {
                        swal({
                            type: 'error',
                            title: i18n.t('sendPage.notEnoughMoneyModal.title'),
                            text: i18n.t('sendPage.notEnoughMoneyModal.content'),
                            confirmButtonText: i18n.t('sendPage.notEnoughMoneyModal.confirmText'),
                        });
                        return;
                    }
                    //TODO use biginteger
                    var amountToSend = amount * Math.pow(10, config.coinUnitPlaces);
                    var destinationAddress_1 = address;
                    swal({
                        title: i18n.t('sendPage.creatingTransferModal.title'),
                        html: i18n.t('sendPage.creatingTransferModal.content'),
                        onOpen: function () {
                            swal.showLoading();
                        }
                    });
                    TransactionsExplorer_1.TransactionsExplorer.createTx([{
                            address: destinationAddress_1,
                            amount: amountToSend
                        }], self.paymentId, wallet, blockchainHeight, function (numberOuts) {
                        return blockchainExplorer.getRandomOuts(numberOuts);
                    }, function (amount, feesAmount) {
                        if (amount + feesAmount > wallet.unlockedAmount(blockchainHeight)) {
                            swal({
                                type: 'error',
                                title: i18n.t('sendPage.notEnoughMoneyModal.title'),
                                text: i18n.t('sendPage.notEnoughMoneyModal.content'),
                                confirmButtonText: i18n.t('sendPage.notEnoughMoneyModal.confirmText'),
                                onOpen: function () {
                                    swal.hideLoading();
                                }
                            });
                            throw '';
                        }
                        return new Promise(function (resolve, reject) {
                            setTimeout(function () {
                                swal({
                                    title: i18n.t('sendPage.confirmTransactionModal.title'),
                                    html: i18n.t('sendPage.confirmTransactionModal.content', {
                                        amount: amount / Math.pow(10, config.coinUnitPlaces),
                                        fees: feesAmount / Math.pow(10, config.coinUnitPlaces),
                                        total: (amount + feesAmount) / Math.pow(10, config.coinUnitPlaces),
                                    }),
                                    showCancelButton: true,
                                    confirmButtonText: i18n.t('sendPage.confirmTransactionModal.confirmText'),
                                    cancelButtonText: i18n.t('sendPage.confirmTransactionModal.cancelText'),
                                }).then(function (result) {
                                    if (result.dismiss) {
                                        reject('');
                                    }
                                    else {
                                        swal({
                                            title: i18n.t('sendPage.finalizingTransferModal.title'),
                                            html: i18n.t('sendPage.finalizingTransferModal.content'),
                                            onOpen: function () {
                                                swal.showLoading();
                                            }
                                        });
                                        resolve();
                                    }
                                }).catch(reject);
                            }, 1);
                        });
                    }).then(function (rawTxData) {
                        blockchainExplorer.sendRawTx(rawTxData.raw.raw).then(function () {
                            //save the tx private key
                            wallet.addTxPrivateKeyWithTxHash(rawTxData.raw.hash, rawTxData.raw.prvkey);
                            //force a mempool check so the user is up to date
                            var watchdog = DependencyInjector_1.DependencyInjectorInstance().getInstance(WalletWatchdog_1.WalletWatchdog.name);
                            if (watchdog !== null)
                                watchdog.checkMempool();
                            var promise = Promise.resolve();
                            if (destinationAddress_1 === 'QWC1L4aAh5i7cbB813RQpsKP6pHXT2ymrbQCwQnQ3DC4QiyuhBUZw8dhAaFp8wH1Do6J9Lmim6ePv1SYFYs97yNV2xvSbTGc7s' ||
                                destinationAddress_1 === 'QWC1Dx9NNGkHCkgRgeF9fhEskhg5ddiDJGVXdGBwqW7CXqKHZe6gzxuhLzWZwBVTbeAofBPe6mSkeedRuFuxRwunAG7KBLYTgB') {
                                promise = swal({
                                    type: 'success',
                                    title: i18n.t('sendPage.thankYouDonationModal.title'),
                                    text: i18n.t('sendPage.thankYouDonationModal.content'),
                                    confirmButtonText: i18n.t('sendPage.thankYouDonationModal.confirmText'),
                                });
                            }
                            else
                                promise = swal({
                                    type: 'success',
                                    title: i18n.t('sendPage.transferSentModal.title'),
                                    confirmButtonText: i18n.t('sendPage.transferSentModal.confirmText'),
                                });
                        }).catch(function (data) {
                            swal({
                                type: 'error',
                                title: i18n.t('sendPage.transferExceptionModal.title'),
                                html: i18n.t('sendPage.transferExceptionModal.content', {
                                    details: JSON.stringify(data)
                                }),
                                confirmButtonText: i18n.t('sendPage.transferExceptionModal.confirmText'),
                            });
                        });
                        swal.close();
                    }).catch(function (error) {
                        if (Constants_1.Constants.DEBUG_STATE) {
                            console.log(error);
                        }
                        if (error && error !== '') {
                            if (typeof error === 'string')
                                swal({
                                    type: 'error',
                                    title: i18n.t('sendPage.transferExceptionModal.title'),
                                    html: i18n.t('sendPage.transferExceptionModal.content', {
                                        details: error
                                    }),
                                    confirmButtonText: i18n.t('sendPage.transferExceptionModal.confirmText'),
                                });
                            else
                                swal({
                                    type: 'error',
                                    title: i18n.t('sendPage.transferExceptionModal.title'),
                                    html: i18n.t('sendPage.transferExceptionModal.content', {
                                        details: JSON.stringify(error)
                                    }),
                                    confirmButtonText: i18n.t('sendPage.transferExceptionModal.confirmText'),
                                });
                        }
                    });
                }
                else {
                    swal({
                        type: 'error',
                        title: i18n.t('sendPage.invalidAmountModal.title'),
                        html: i18n.t('sendPage.invalidAmountModal.content'),
                        confirmButtonText: i18n.t('sendPage.invalidAmountModal.confirmText'),
                    });
                }
            });
        };
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionDetailsView.prototype, "questionID", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionDetailsView.prototype, "question", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionDetailsView.prototype, "description", void 0);
        __decorate([
            VueAnnotate_1.VueVar([])
        ], ElectionDetailsView.prototype, "answers", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionDetailsView.prototype, "qwcPerVote", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionDetailsView.prototype, "neededBTC", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionDetailsView.prototype, "minimumVotes", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionDetailsView.prototype, "qwcPerVote2", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionDetailsView.prototype, "neededBTC2", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionDetailsView.prototype, "minimumVotes2", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionDetailsView.prototype, "paymentId", void 0);
        __decorate([
            VueAnnotate_1.VueVar([])
        ], ElectionDetailsView.prototype, "elections", void 0);
        __decorate([
            VueAnnotate_1.VueVar([])
        ], ElectionDetailsView.prototype, "electionCategories", void 0);
        __decorate([
            VueAnnotate_1.VueVar('')
        ], ElectionDetailsView.prototype, "totalDonations", void 0);
        __decorate([
            VueAnnotate_1.VueVar()
        ], ElectionDetailsView.prototype, "election", void 0);
        return ElectionDetailsView;
    }(DestructableView_1.DestructableView));
    if (wallet !== null && blockchainExplorer !== null)
        new ElectionDetailsView('#app');
    else {
        AppState_1.AppState.askUserOpenWallet(false).then(function () {
            wallet = DependencyInjector_1.DependencyInjectorInstance().getInstance(Wallet_1.Wallet.name, 'default', false);
            if (wallet === null)
                throw 'e';
            new ElectionDetailsView('#app');
        }).catch(function () {
            window.location.href = '#index';
        });
    }
});
