import {Constants} from "../model/Constants";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {BlockchainExplorer} from "../model/blockchain/BlockchainExplorer";
import {BlockchainExplorerRpcDaemon} from "../model/blockchain/BlockchainExplorerRPCDaemon";

export class BlockchainExplorerProvider{

	static getInstance() : BlockchainExplorer{
		let blockchainExplorer : BlockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);
		if(blockchainExplorer === null) {
			blockchainExplorer = new BlockchainExplorerRpcDaemon();
			DependencyInjectorInstance().register(Constants.BLOCKCHAIN_EXPLORER, blockchainExplorer);
		}
		return blockchainExplorer;
	}

}