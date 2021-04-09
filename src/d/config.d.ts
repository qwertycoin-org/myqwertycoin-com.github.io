declare var config: {
	apiUrl: string[],
	nodeList: {
		owner: string,
		node: string
	}[],
	nodeUrl: string,
	electionApiUrl: string,
	mainnetExplorerUrl: string,
	mainnetExplorerUrlHash: string,
	mainnetExplorerUrlBlock: string,
	testnet: boolean,
	coinUnitPlaces: number,
	txMinConfirms: number, // corresponds to CRYPTONOTE_DEFAULT_TX_SPENDABLE_AGE in Monero
	txCoinbaseMinConfirms: number, // corresponds to CRYPTONOTE_MINED_MONEY_UNLOCK_WINDOW in Monero
	coinSymbol: string,
	openAliasPrefix: string,
	coinName: string,
	coinUriPrefix: string,
	addressPrefix: number,
	integratedAddressPrefix: number,
	subAddressPrefix: number,
	feePerKB: any,
	dustThreshold: any,
	defaultMixin: number, // default mixin
	txChargeAddress: string,
	idleTimeout: number,
	idleWarningDuration: number,
	maxBlockNumber: number,
	remoteNodeFee: number,
	devFee: number,
	devAddress: string,
	avgBlockTime: number,
};
