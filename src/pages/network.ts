import {DestructableView} from "../lib/numbersLab/DestructableView";
import {VueVar, VueRequireFilter} from "../lib/numbersLab/VueAnnotate";
import {Constants} from "../model/Constants";
import {Wallet} from "../model/Wallet";
import {AppState} from "../model/AppState";
import {BlockchainExplorer, NetworkInfo} from "../model/blockchain/BlockchainExplorer";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {VueFilterHashrate} from "../filters/Filters";

AppState.enableLeftMenu();
let blockchainExplorer: BlockchainExplorer = BlockchainExplorerProvider.getInstance();

@VueRequireFilter('hashrate', VueFilterHashrate)

class NetworkView extends DestructableView {
	@VueVar(0) networkHashrate !: number;
	@VueVar(0) blockchainHeight !: number;
	@VueVar(0) networkDifficulty !: number;
	@VueVar(0) lastReward !: number;
	@VueVar(0) lastBlockFound !: number;
	@VueVar(0) connectedNode !: string;

	private intervalRefreshStat = 0;

	constructor(container: string) {
		super(container);

		let self = this;
		this.intervalRefreshStat = setInterval(function () {
			self.refreshStats();
		}, 30 * 1000);
		this.refreshStats();
	}

	destruct(): Promise<void> {
		clearInterval(this.intervalRefreshStat);
		return super.destruct();
	}

	refreshStats() {
		blockchainExplorer.getNetworkInfo().then((info: NetworkInfo) => {
			console.log(info);
			this.connectedNode = info.node;
			this.networkDifficulty = info.difficulty;
			this.networkHashrate = info.difficulty / config.avgBlockTime;
			this.blockchainHeight = info.height;
			this.lastReward = info.reward / Math.pow(10, config.coinUnitPlaces);
			this.lastBlockFound = info.timestamp;
		});
	}
}

new NetworkView('#app');
