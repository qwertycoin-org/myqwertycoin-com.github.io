let global: any = typeof window !== 'undefined' ? window : self;
global.config = {
	nodeList: [
		{ owner: "Official #1", node: "https://pr01.myqwertycoin.com/sync/"},
		{ owner: "Official #2", node: "https://api.qwertycoin.org/sslnode/"},
		{ owner: "Official #3", node: "https://pr01.myqwertycoin.com/sync/"}
	],
	nodeUrl: "https://pr01.myqwertycoin.com/sync/",
	electionApiUrl: "https://voting.qwertycoin.org/api",
	mainnetExplorerUrl: "https://explorer.qwertycoin.org/",
	mainnetExplorerUrlHash: "https://explorer.qwertycoin.org/?hash={ID}#blockchain_transaction",
	mainnetExplorerUrlBlock: "https://explorer.qwertycoin.org/?hash={ID}#blockchain_block",
	testnet: false,
	coinUnitPlaces: 8,
	coinDisplayUnitPlaces: 2,
	txMinConfirms: 10,
	txCoinbaseMinConfirms: 10,
	addressPrefix: 0x14820c,
	integratedAddressPrefix: 0x148201,
	subAddressPrefix: 0x148202,
	coinFee: new JSBigInt('100000000'),
	feePerKB: new JSBigInt('100000000'),
	dustThreshold: new JSBigInt('100000'), //used for choosing outputs/change - we decompose all the way down if the receiver wants now regardless of threshold
	defaultMixin: 0, // default value mixin

	idleTimeout: 30,
	idleWarningDuration: 20,

	coinSymbol: 'QWC',
	openAliasPrefix: "qwc",
	coinName: 'Qwertycoin',
	coinUriPrefix: 'qwertycoin:',
	avgBlockTime: 120,
	maxBlockNumber: 500000000,
	remoteNodeFee: 0.25,
	devFee: 1,
	devAddress: "QWC1Dx9NNGkHCkgRgeF9fhEskhg5ddiDJGVXdGBwqW7CXqKHZe6gzxuhLzWZwBVTbeAofBPe6mSkeedRuFuxRwunAG7KBLYTgB"
};
