let global: any = typeof window !== 'undefined' ? window : self;
global.config = {
	nodeList: [
		{ owner: "node-00", node: "https://node-00.qwertycoin.org/sslnode"},
		{ owner: "node-01", node: "https://node-01.qwertycoin.org/sslnode"},
		{ owner: "node-02", node: "https://node-02.qwertycoin.org/sslnode"},
		{ owner: "node-03", node: "https://node-03.qwertycoin.org/sslnode"},
		{ owner: "node-04", node: "https://node-04.qwertycoin.org/sslnode"},
		{ owner: "node-05", node: "https://node-05.qwertycoin.org/sslnode"},
		{ owner: "node-06", node: "https://node-06.qwertycoin.org/sslnode"},
		{ owner: "node-07", node: "https://node-07.qwertycoin.org/sslnode"}
	],
	nodeUrl: "https://node-00.qwertycoin.org/sslnode",
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
