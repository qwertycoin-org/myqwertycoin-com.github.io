define(["require", "exports", "../model/Constants", "../lib/numbersLab/DependencyInjector", "../model/blockchain/BlockchainExplorerRPCDaemon"], function (require, exports, Constants_1, DependencyInjector_1, BlockchainExplorerRPCDaemon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BlockchainExplorerProvider = /** @class */ (function () {
        function BlockchainExplorerProvider() {
        }
        BlockchainExplorerProvider.getInstance = function () {
            var blockchainExplorer = DependencyInjector_1.DependencyInjectorInstance().getInstance(Constants_1.Constants.BLOCKCHAIN_EXPLORER);
            if (blockchainExplorer === null) {
                blockchainExplorer = new BlockchainExplorerRPCDaemon_1.BlockchainExplorerRpcDaemon();
                DependencyInjector_1.DependencyInjectorInstance().register(Constants_1.Constants.BLOCKCHAIN_EXPLORER, blockchainExplorer);
            }
            return blockchainExplorer;
        };
        return BlockchainExplorerProvider;
    }());
    exports.BlockchainExplorerProvider = BlockchainExplorerProvider;
});
