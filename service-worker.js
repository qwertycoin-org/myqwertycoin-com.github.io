"use strict";
/*
* Copyright (c) 2018, Gnock
* Copyright (c) 2018, The Masari Project
* Copyright (c) 2019-2021, The Qwertycoin Project
*
* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
*
* 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
*
* 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');
workbox.precaching.precacheAndRoute([
  {
    "url": "api.js",
    "revision": "9d76ce35b4a493232c5d76f2f86e1942"
  },
  {
    "url": "assets/css/bootstrap-grid.css",
    "revision": "29a16726680195da6a8c78f234880607"
  },
  {
    "url": "assets/css/bootstrap-reboot.css",
    "revision": "7dc6d49bddb587f471ed62358e743727"
  },
  {
    "url": "assets/css/bootstrap.css",
    "revision": "d59729439a203fc474f5677b8d18d8bb"
  },
  {
    "url": "assets/css/font-awesome.css",
    "revision": "c495654869785bc3df60216616814ad1"
  },
  {
    "url": "assets/css/font-awesome.min.css",
    "revision": "269550530cc127b6aa5a35925a7de6ce"
  },
  {
    "url": "assets/css/main.css",
    "revision": "1faef07c43e8c6cbe43b0d67f96830cf"
  },
  {
    "url": "assets/img/coin_white.png",
    "revision": "ee2ee75be9137215cefa9d265eaaf983"
  },
  {
    "url": "assets/img/favicon.ico",
    "revision": "ee2ee75be9137215cefa9d265eaaf983"
  },
  {
    "url": "assets/img/icons/icon-128x128.png",
    "revision": "775fae9eb8fa9e2642f506e1c06ac9a1"
  },
  {
    "url": "assets/img/icons/icon-144x144.png",
    "revision": "c87d8ead8be0290eff3d67974474c44c"
  },
  {
    "url": "assets/img/icons/icon-152x152.png",
    "revision": "16dce98e44f0ba7598b2361e34d9b93a"
  },
  {
    "url": "assets/img/icons/icon-192x192.png",
    "revision": "2e49ce063a66291df13ea3c336faf742"
  },
  {
    "url": "assets/img/icons/icon-256x256.png",
    "revision": "30022a6d80d5c6d161d5400082da6c57"
  },
  {
    "url": "assets/img/icons/icon-402x402.png",
    "revision": "3efe35ecb12a9d7760a8ac07a7e031a2"
  },
  {
    "url": "assets/img/landing/qclassic.jpg",
    "revision": "f311278074f7c031db14548c8fed1927"
  },
  {
    "url": "assets/img/landing/qwc_morepurple.png",
    "revision": "f0b382efceb9faab4d23675d586ab25e"
  },
  {
    "url": "assets/img/logo_vertical.png",
    "revision": "3f510c5b310b7b8ffc06f46a73ff9b96"
  },
  {
    "url": "assets/img/logo.png",
    "revision": "7dd6ac68ad4ba334ac5d8c0d7d062e20"
  },
  {
    "url": "assets/img/logoQrCode.jpg",
    "revision": "04fc5af7e5b46ca607a53bb88c557da1"
  },
  {
    "url": "assets/img/logoQrCode.png",
    "revision": "cf57fad2c333b9c3d1695e3bda256934"
  },
  {
    "url": "assets/img/qclassic.jpg",
    "revision": "3d59c023893b954800a7a1da22a192ba"
  },
  {
    "url": "config.js",
    "revision": "52995776f4946b6e937669dd05300f5f"
  },
  {
    "url": "d/vue-i118n.js",
    "revision": "5e60d2e13017ae982538f352d04a961c"
  },
  {
    "url": "filters/Filters.js",
    "revision": "506a7501d46fdbd0b604134d26052884"
  },
  {
    "url": "index.html",
    "revision": "1cd589f815da3b0652c16858aa3a678d"
  },
  {
    "url": "index.js",
    "revision": "f92043e40b04b232d671662ecb4c5da8"
  },
  {
    "url": "lib/axios.js",
    "revision": "b6c4445ed786f638d8183e1d70ca0c72"
  },
  {
    "url": "lib/base58.js",
    "revision": "3d523c0162d6911fd675c9ed1b7389a8"
  },
  {
    "url": "lib/biginteger.js",
    "revision": "f5a873c5716a9d3481501cad3f3e5ca7"
  },
  {
    "url": "lib/cn_utils_native.js",
    "revision": "94d65c88ed19007552b6593fa6fc68d1"
  },
  {
    "url": "lib/crypto.js",
    "revision": "d51c76b2e08308f8cca1f68c5c298a6f"
  },
  {
    "url": "lib/decoder.min.js",
    "revision": "67a582366edae346b7aa0fb14be03348"
  },
  {
    "url": "lib/FileSaver.min.js",
    "revision": "e8fdc5ad52084fa417f1fec6b6de3b29"
  },
  {
    "url": "lib/jquery-3.2.1.min.js",
    "revision": "c9f5aeeca3ad37bf2aa006139b935f0a"
  },
  {
    "url": "lib/jspdf.min.js",
    "revision": "27385efc6fa2eccc9dde7da0081b1a98"
  },
  {
    "url": "lib/kjua-0.1.1.min.js",
    "revision": "ca69d4f40f8c17ff592123dc35c1ea18"
  },
  {
    "url": "lib/kjua.min.js",
    "revision": "1383224c1213771c21c1128a93f0726c"
  },
  {
    "url": "lib/mnemonic.js",
    "revision": "f30940176ec1e71b5a5f0c9b784a98b9"
  },
  {
    "url": "lib/nacl-fast-cn.js",
    "revision": "1fe1387eb865d9e843697a9d315d95b1"
  },
  {
    "url": "lib/nacl-fast.js",
    "revision": "a9c5b4bca7d2aa621a86d5085ce65d03"
  },
  {
    "url": "lib/nacl-fast.min.js",
    "revision": "72444801c9affc1654ef12860c67e976"
  },
  {
    "url": "lib/nacl-util.min.js",
    "revision": "c7b843b9e9b5aad102c855c600c7edc8"
  },
  {
    "url": "lib/nacl.js",
    "revision": "bf72b0a25fc3edf0c1a638aa43642714"
  },
  {
    "url": "lib/nacl.min.js",
    "revision": "d8eaf281c8890a60ebe82840456edc33"
  },
  {
    "url": "lib/numbersLab/Context.js",
    "revision": "40c29d848d2e19cdff2399a1f4a0ec08"
  },
  {
    "url": "lib/numbersLab/DependencyInjector.js",
    "revision": "988fa00de30ff98ddb9ea836eadc59ee"
  },
  {
    "url": "lib/numbersLab/DestructableView.js",
    "revision": "c34f21327cd00c4b69dd88f33a60b7fc"
  },
  {
    "url": "lib/numbersLab/Logger.js",
    "revision": "449f6dcd42c740559b9eb20b1f7f2efa"
  },
  {
    "url": "lib/numbersLab/Observable.js",
    "revision": "84e5ac65bf05cee513a1fb77801de7b8"
  },
  {
    "url": "lib/numbersLab/Router.js",
    "revision": "9a2745b90d817dda89032acfed555887"
  },
  {
    "url": "lib/numbersLab/VueAnnotate.js",
    "revision": "a5145e1208900f2990f9a103b8987ad6"
  },
  {
    "url": "lib/polyfills/core.min.js",
    "revision": "6ff449122255e7a91fb884ea7016c601"
  },
  {
    "url": "lib/polyfills/crypto.js",
    "revision": "13647291f45a582eee64e000b09d9567"
  },
  {
    "url": "lib/polyfills/textEncoding/encoding-indexes.js",
    "revision": "50f27403be5972eae4831f5b69db1f80"
  },
  {
    "url": "lib/polyfills/textEncoding/encoding.js",
    "revision": "cfc731bd62baec239b2c4daf33b5e810"
  },
  {
    "url": "lib/require.js",
    "revision": "bebd45d1f406bbe61424136b03e50895"
  },
  {
    "url": "lib/sha3.js",
    "revision": "9f298ac7e4ee707645a8d711f3ed916b"
  },
  {
    "url": "lib/sweetalert2.js",
    "revision": "4b69bbd418e85d6efdac5630ed40d76e"
  },
  {
    "url": "lib/vue-i18n.js",
    "revision": "58527051a1e3829171f96b6cc27d088f"
  },
  {
    "url": "lib/vue.min.js",
    "revision": "44487223aebf303c2b81ac5ac8b8b279"
  },
  {
    "url": "manifest.json",
    "revision": "14a4fa5b7c7dd42e4ca48b8d69a35ea4"
  },
  {
    "url": "model/AppState.js",
    "revision": "15d9872756a79f94ea075e52ce58761c"
  },
  {
    "url": "model/blockchain/BlockchainExplorer.js",
    "revision": "0c64fb3f48c63bd420c80f4666c462d7"
  },
  {
    "url": "model/blockchain/BlockchainExplorerRPCDaemon.js",
    "revision": "5a635869debeffe7ae4ccfff86084a0f"
  },
  {
    "url": "model/Cn.js",
    "revision": "6fdcc142c7d75500bf14e0a8c8825d58"
  },
  {
    "url": "model/CoinUri.js",
    "revision": "bbccf60f6691b015832ee5e3383d7f77"
  },
  {
    "url": "model/Constants.js",
    "revision": "b8f983b05a9d082f398c7a28961353cc"
  },
  {
    "url": "model/Currency.js",
    "revision": "a9fe4240749ee4220a8dfdd8594b6de8"
  },
  {
    "url": "model/Elections.js",
    "revision": "31a9dd2fd094af7ce95ce568067a41ef"
  },
  {
    "url": "model/KeysRepository.js",
    "revision": "82d98c063349e756e81346dba33254d8"
  },
  {
    "url": "model/MathUtil.js",
    "revision": "0a2629797d2cd97ed5d009f32d5be682"
  },
  {
    "url": "model/MessageLib.js",
    "revision": "c6bcdd11459f887075a08c2db86a1cf2"
  },
  {
    "url": "model/Mnemonic.js",
    "revision": "b97357c89b027e04ee74ce80acca1393"
  },
  {
    "url": "model/MnemonicLang.js",
    "revision": "df6fe6ac77e21df5bb538731485f299c"
  },
  {
    "url": "model/Nfc.js",
    "revision": "def4342e46197fd738b2c8a8abb727e0"
  },
  {
    "url": "model/Notifications.js",
    "revision": "24bdf25a286d3dfcbdaaeb2c221cadf2"
  },
  {
    "url": "model/Password.js",
    "revision": "33d87a5443730a661725c750eea5266b"
  },
  {
    "url": "model/QRReader.js",
    "revision": "61a072996b45bc59495957731d30cfbc"
  },
  {
    "url": "model/Storage.js",
    "revision": "d040b3e9416f18cc639868e2eb358145"
  },
  {
    "url": "model/Transaction.js",
    "revision": "a5b754ec77b73b286408d9628bce4177"
  },
  {
    "url": "model/TransactionsExplorer.js",
    "revision": "d305effc551db27c61cc805f777ab5de"
  },
  {
    "url": "model/Translations.js",
    "revision": "761e7386c4da020d91266819f36cd862"
  },
  {
    "url": "model/Wallet.js",
    "revision": "78f0c1611d0573dc09078990531d0f36"
  },
  {
    "url": "model/WalletRepository.js",
    "revision": "b1ea84911840696b14cd4d6e5f9d9048"
  },
  {
    "url": "model/WalletWatchdog.js",
    "revision": "d4972651c77fad2fa2fc0c01a942c72d"
  },
  {
    "url": "pages/account.html",
    "revision": "ec018a417321e4a8a87a7c13814fc971"
  },
  {
    "url": "pages/account.js",
    "revision": "2dc89f083dcda11b8b1acbe67c42b6ef"
  },
  {
    "url": "pages/addContact.html",
    "revision": "a326cb290ed33034d1ae6928c5c13b36"
  },
  {
    "url": "pages/addContact.js",
    "revision": "d6f3e887c7ce0d35c712b072e0adee3a"
  },
  {
    "url": "pages/changeWalletPassword.html",
    "revision": "cf44f48e8c60b3c2e19e22e825a89724"
  },
  {
    "url": "pages/changeWalletPassword.js",
    "revision": "0206ce616950cd2b9a27f17530c8a7c4"
  },
  {
    "url": "pages/contactPage.html",
    "revision": "001ac9f8e244eec82f41fc6035bc8d24"
  },
  {
    "url": "pages/contactPage.js",
    "revision": "d5a5877d3d1654307e78b41a41e5c7b3"
  },
  {
    "url": "pages/createWallet.html",
    "revision": "413543ffbf94919ce6b5be51d309bc55"
  },
  {
    "url": "pages/createWallet.js",
    "revision": "4a0ba7c8838701f869dffb81703ec690"
  },
  {
    "url": "pages/disconnect.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "pages/disconnect.js",
    "revision": "d522ce5375651f73614509f2e3e69b7c"
  },
  {
    "url": "pages/donate.html",
    "revision": "138a0e9f709ff99da7f2c61a2a48e7d0"
  },
  {
    "url": "pages/donate.js",
    "revision": "7567ce5036cda4b94ed4361da1954e94"
  },
  {
    "url": "pages/electionDetails.html",
    "revision": "9f5002cd1a0bb3f05f2096790cb601c7"
  },
  {
    "url": "pages/electionDetails.js",
    "revision": "c5922b872395ecdff759f7e179218f37"
  },
  {
    "url": "pages/elections.html",
    "revision": "6355ae556949a7706d77c45750d472db"
  },
  {
    "url": "pages/elections.js",
    "revision": "c6d2345fa45c64ae885ae3c4f178d9fc"
  },
  {
    "url": "pages/export.html",
    "revision": "0829e8dcf1a904dbbe1be305abf85900"
  },
  {
    "url": "pages/export.js",
    "revision": "7a2538d7d15721c8baf8bf2086078d69"
  },
  {
    "url": "pages/import.html",
    "revision": "45f5c149574bd7cf2bc91794c4adee55"
  },
  {
    "url": "pages/import.js",
    "revision": "9456a92f716c81ebb0cc6235312a73ff"
  },
  {
    "url": "pages/importFromFile.html",
    "revision": "b824f9fc68ce358032faecd70b0e099b"
  },
  {
    "url": "pages/importFromFile.js",
    "revision": "8db892a301146e95659febf77d4483ab"
  },
  {
    "url": "pages/importFromKeys.html",
    "revision": "1388fc183805920f522c5cb26e3c2714"
  },
  {
    "url": "pages/importFromKeys.js",
    "revision": "8f5408b5c42a73bb009532c25a12117f"
  },
  {
    "url": "pages/importFromMnemonic.html",
    "revision": "367f09264b3c3008ee0eda752d4a0ea7"
  },
  {
    "url": "pages/importFromMnemonic.js",
    "revision": "f44830a49dbfdb3cc3390cfa889110eb"
  },
  {
    "url": "pages/importFromQr.html",
    "revision": "172fc490fa9a97ed146895e0f35aeedc"
  },
  {
    "url": "pages/importFromQr.js",
    "revision": "9cc0757d7b3f529c5e01af1683380797"
  },
  {
    "url": "pages/index.html",
    "revision": "4c090dd936147d35330036c8eda218fd"
  },
  {
    "url": "pages/index.js",
    "revision": "adcb8f7bf1aeb24a1818323079870127"
  },
  {
    "url": "pages/messages.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "pages/messages.js",
    "revision": "75058b1363e1ca28f39524e7a9235fb8"
  },
  {
    "url": "pages/network.html",
    "revision": "8c407b6769d931eeff96bf05985b1867"
  },
  {
    "url": "pages/network.js",
    "revision": "a46a5aa42a9743076343367f66261b32"
  },
  {
    "url": "pages/privacyPolicy.html",
    "revision": "efbde8ff28566d42419cd6a64036f085"
  },
  {
    "url": "pages/privacyPolicy.js",
    "revision": "a06e415fe7eaf88807bf25d83989dc1c"
  },
  {
    "url": "pages/receive.html",
    "revision": "03a8854fc21dcd40a88a8d55a6eca392"
  },
  {
    "url": "pages/receive.js",
    "revision": "f0952f4309e0a87d6691919e579f8c6d"
  },
  {
    "url": "pages/selfxss.html",
    "revision": "f7ca9d7aa4cec3fe58bfa61360f00e51"
  },
  {
    "url": "pages/selfxss.js",
    "revision": "7f8a61857c917e0f3979d290a15dbe74"
  },
  {
    "url": "pages/send.html",
    "revision": "ab9a31ac1d83de31c5b1bcd521fbecf1"
  },
  {
    "url": "pages/send.js",
    "revision": "9922b3f71143b0984aae7ce10f4f31fb"
  },
  {
    "url": "pages/settings.html",
    "revision": "83eb141dbdf5f464db6a246512a74535"
  },
  {
    "url": "pages/settings.js",
    "revision": "f160df248d43848546a18bb1c9ac5bf4"
  },
  {
    "url": "pages/support.html",
    "revision": "1b14d12415aa1bef868c782fecfc4311"
  },
  {
    "url": "pages/support.js",
    "revision": "b9dc72108aa6602ee5e3eb8614c4913d"
  },
  {
    "url": "pages/termsOfUse.html",
    "revision": "a0b3643188615732d0f2d73d643d2e32"
  },
  {
    "url": "pages/termsOfUse.js",
    "revision": "1e0462ca4750db68f111cd17bbd9d740"
  },
  {
    "url": "providers/BlockchainExplorerProvider.js",
    "revision": "cc48257d940b3fbdde6435b75e285bda"
  },
  {
    "url": "service-worker-raw.js",
    "revision": "eec85e942c46de5660a74b2007dacc5e"
  },
  {
    "url": "translations/ar.json",
    "revision": "f1abef6d04ee1d82d7a105bb89641945"
  },
  {
    "url": "translations/br.json",
    "revision": "42fb319675da98d2ec145f55c092b62f"
  },
  {
    "url": "translations/de.json",
    "revision": "ccfcc11128f2b78af8c29e8a6eb3221a"
  },
  {
    "url": "translations/en.json",
    "revision": "7738e675a774c4fa9e97f851998575e8"
  },
  {
    "url": "translations/es.json",
    "revision": "840a79931566b43d531c4571525f6c04"
  },
  {
    "url": "translations/fa.json",
    "revision": "3d7e9f237c0632fa60b92984bdfeff61"
  },
  {
    "url": "translations/fr.json",
    "revision": "77f34ecce4d06cb6e600df79e46e8db9"
  },
  {
    "url": "translations/gr.json",
    "revision": "7bb2abe1d02cd93a7dddd587c1c4e2f6"
  },
  {
    "url": "translations/he.json",
    "revision": "b7ebd5700c1c45e97119debe8b716af5"
  },
  {
    "url": "translations/hi.json",
    "revision": "828af97e8d0be1741d33fd365f071cd9"
  },
  {
    "url": "translations/hu.json",
    "revision": "8fa602ca9b5793053c63d9bd0ed7769b"
  },
  {
    "url": "translations/it.json",
    "revision": "3fd759761faad41bdc2c8277f37ad7fe"
  },
  {
    "url": "translations/ja.json",
    "revision": "542b321b9191979accc38bdb7c10949c"
  },
  {
    "url": "translations/ko.json",
    "revision": "9e341dbe45dfe507956aaec71ffa04b1"
  },
  {
    "url": "translations/pk.json",
    "revision": "8147933de8b704a2e318edb0c86ceae2"
  },
  {
    "url": "translations/pl.json",
    "revision": "3186400e37655e03713a59f5bc1b4e3d"
  },
  {
    "url": "translations/pt.json",
    "revision": "82b217b06f06832117686990c6af6a5f"
  },
  {
    "url": "translations/ro.json",
    "revision": "37c171659130a0a41d06e904c484f0e8"
  },
  {
    "url": "translations/ru.json",
    "revision": "701c6a79e467fd2d94027af0994db475"
  },
  {
    "url": "translations/sr.json",
    "revision": "b75778f1ff72b4db0a7dd7da9112fcf9"
  },
  {
    "url": "translations/tr.json",
    "revision": "132e453921ccd924f734594691525d60"
  },
  {
    "url": "translations/uk.json",
    "revision": "5fc6ee7f66d0ab090916543d878a403f"
  },
  {
    "url": "translations/vn.json",
    "revision": "310d477e53d0d2c0217683c5cae1ce4e"
  },
  {
    "url": "translations/zh.json",
    "revision": "05d137d8c257b7387617762d63c038cd"
  },
  {
    "url": "utils/Url.js",
    "revision": "c13582b57f16eecdb80b50bb2428e3c5"
  },
  {
    "url": "workers/TransferProcessing.js",
    "revision": "39d87ceb7163eff6f3d140a18e149048"
  },
  {
    "url": "workers/TransferProcessingEntrypoint.js",
    "revision": "d595f8111c1a75bb08600182fe8c5fa3"
  }
]);
self.addEventListener('message', function (event) {
    if (!event.data) {
        return;
    }
    switch (event.data) {
        case 'force-activate':
            self.skipWaiting();
            self.clients.claim();
            self.clients.matchAll().then(function (clients) {
                clients.forEach(function (client) { return client.postMessage('reload-window-update'); });
            });
            break;
        default:
            // NOOP
            break;
    }
});
