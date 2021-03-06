![image](https://cdn.qwertycoin.org/images/press/other/qwc-github-3.png)

# Qwertycoin Web Wallet 
This web wallet is doing everything client-side to give the best privacy to users.

# Security
**No keys, seeds, or sensitive data is sent to the server**  
Encryption is done with a certified library, [Tweetnacl.Js.](https://github.com/dchest/tweetnacl-js)

# Features (non-exhaustive)
- Complete wallet sync without server side processing for security
- Receive/send history
- Mempool support to check incoming transfers
- Send coins - including QR code scanning
- Receive page to generate a custom QR code
- Import from private keys, mnemonic seed, or json file (exported by the wallet)
- Export private keys, mnemonic phrase, or json file (which include all the history)
- View only wallet
- Basic network stats

# How to compile & Deploy
The project is using Typescript as main language everything else (dependencies) is already included.

## Compilation
The first step will be to compile the typescript code into javascript code so browsers will be able to understand it. 
You also need to build some files that are dynamically generated like the manifest ...
This task is doable with :
```
npm install
nodejs ./node_modules/typescript/bin/tsc --project tsconfig.json
nodejs build.js
```
The first task install dependencies (typescript) and the text one compile the typescript code.
We are using a custom tsconfig file which is optimized for production.

## Deploy
All the content of the src directory needs to be exposed with a web-server.

## Change configuration
You will have to edit the file src/config.ts in order to change the API endpoint. 

Done

### Donate

```
QWC: QWC1Dx9NNGkHCkgRgeF9fhEskhg5ddiDJGVXdGBwqW7CXqKHZe6gzxuhLzWZwBVTbeAofBPe6mSkeedRuFuxRwunAG7KBLYTgB
```
```
BTC: 1DkocMNiqFkbjhCmG4sg9zYQbi4YuguFWw
```
```
ETH: 0xA660Fb28C06542258bd740973c17F2632dff2517
```
```
BCH: qz975ndvcechzywtz59xpkt2hhdzkzt3vvt8762yk9
```
```
XMR: 47gmN4GMQ17Veur5YEpru7eCQc5A65DaWUThZa9z9bP6jNMYXPKAyjDcAW4RzNYbRChEwnKu1H3qt9FPW9CnpwZgNscKawX
```
```
ETN: etnkJXJFqiH9FCt6Gq2HWHPeY92YFsmvKX7qaysvnV11M796Xmovo2nSu6EUCMnniqRqAhKX9AQp31GbG3M2DiVM3qRDSQ5Vwq
```

### Contributors and thanks

#### Developers:
- gnock (main)
- cryptochangements
- davehlong (initial adaptation of PHP Api for Bytecoin based coins)
- aiwe (adapted for Bytecoin/CryptoNote from Monero codebase)
- nnian, ExploShot (adapted for Qwertycoin codebase)

#### Translations:
- Chinese: mainframer, [Alex Nnian - Qwertycoin](https://github.com/qwertycoin-org)
- French: gnock
- German: F0sching, [Alex Nnian - Qwertycoin](https://github.com/qwertycoin-org)
- Greek: GeraltOfTrivia
- Hungarian: Gelesztaa
- Japanese: [Alex Nnian - Qwertycoin](https://github.com/qwertycoin-org)
- Korean: [Xecute0101 - Qwertycoin](https://github.com/qwertycoin-org)
- Persian: M4hdi1995
- Russian: [Aiwe](https://github.com/aivve)
- Serbian cyrillic: girugameshh
- Spanish: [Guerreru](https://github.com/Guerreru)
- Ukrainian: [Aiwe](https://github.com/aivve)

#### Incomplete Translations:
- [Arabic](https://github.com/qwertycoin-org/myqwertycoin-com.github.io/blob/master/src/translations/ar.json)
- [Hebrew](https://github.com/qwertycoin-org/myqwertycoin-com.github.io/blob/master/src/translations/he.json)
- [Hindi](https://github.com/qwertycoin-org/myqwertycoin-com.github.io/blob/master/src/translations/hi.json)
- [Polish](https://github.com/qwertycoin-org/myqwertycoin-com.github.io/blob/master/src/translations/pl.json)
- [Portuguese](https://github.com/qwertycoin-org/myqwertycoin-com.github.io/blob/master/src/translations/pk.json)
- [Romanian](https://github.com/qwertycoin-org/myqwertycoin-com.github.io/blob/master/src/translations/ro.json)
- [Turkish](https://github.com/qwertycoin-org/myqwertycoin-com.github.io/blob/master/src/translations/tr.json)
- [Urdu](https://github.com/qwertycoin-org/myqwertycoin-com.github.io/blob/master/src/translations/pk.json)
- [Vietnamese ](https://github.com/qwertycoin-org/myqwertycoin-com.github.io/blob/master/src/translations/vn.json)
