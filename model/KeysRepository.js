define(["require", "exports", "./Cn"], function (require, exports, Cn_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var KeysRepository = /** @class */ (function () {
        function KeysRepository() {
        }
        KeysRepository.fromPriv = function (spend, view) {
            var pubView = Cn_1.CnUtils.sec_key_to_pub(view);
            var pubSpend = Cn_1.CnUtils.sec_key_to_pub(spend);
            return {
                pub: {
                    view: pubView,
                    spend: pubSpend
                },
                priv: {
                    view: view,
                    spend: spend,
                }
            };
        };
        return KeysRepository;
    }());
    exports.KeysRepository = KeysRepository;
});
