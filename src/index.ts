import {Router} from "./lib/numbersLab/Router";
import {Mnemonic} from "./model/Mnemonic";
import {DestructableView} from "./lib/numbersLab/DestructableView";
import {VueClass, VueVar, VueWatched} from "./lib/numbersLab/VueAnnotate";
import {Storage} from "./model/Storage";
import {Translations} from "./model/Translations";
import {Transaction} from "./model/Transaction";

//========================================================
//bridge for cnUtil with the new mnemonic class
//========================================================
(<any>window).mn_random = Mnemonic.mn_random;
(<any>window).mn_encode = Mnemonic.mn_encode;
(<any>window).mn_decode = Mnemonic.mn_decode;

//========================================================
//====================Translation code====================
//========================================================
const i18n = new VueI18n({
	locale: 'en',
	fallbackLocale: 'en',
});
(<any>window).i18n = i18n;

let browserUserLang = ''+(navigator.language || (<any>navigator).userLanguage);
browserUserLang = browserUserLang.toLowerCase().split('-')[0];

Storage.getItem('user-lang', browserUserLang).then(function(userLang : string){
	Translations.loadLangTranslation(userLang).catch(function () {
		Translations.loadLangTranslation('en');
	});
});


//========================================================
//====================Generic design======================
//========================================================

@VueClass()
class MenuView extends Vue{
	isMenuHidden : boolean = false;

	constructor(containerName:any,vueData:any=null){
		super(vueData);
		this.isMenuHidden = $('body').hasClass('menuHidden');
		if($('body').hasClass('menuDisabled'))
			this.isMenuHidden = true;
		this.update();
	}

	toggle(){
		if($('body').hasClass('menuDisabled'))
			this.isMenuHidden = true;
		else
			this.isMenuHidden = !this.isMenuHidden;

		this.update();
	}
	update(){
		if(this.isMenuHidden)
			$('body').addClass('menuHidden');
		else
			$('body').removeClass('menuHidden');
	}
}
let menuView = new MenuView('#menu');

$('#menu a').on('click',function(event:Event){
	menuView.toggle();
});
$('#menu').on('click',function(event:Event){
	event.stopPropagation();
});

$('#topBar .toggleMenu').on('click',function(event:Event){
	menuView.toggle();
	event.stopPropagation();
	return false;
});

$(window).click(function() {
	menuView.isMenuHidden = true;
	$('body').addClass('menuHidden');
});

//mobile swipe
let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1,Math.floor(0.01 * (pageWidth)));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const limit = Math.tan(45 * 1.5 / 180 * Math.PI);
const gestureZone : HTMLElement= $('body')[0];

gestureZone.addEventListener('touchstart', function(event : TouchEvent) {
	touchstartX = event.changedTouches[0].screenX;
	touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event : TouchEvent) {
	touchendX = event.changedTouches[0].screenX;
	touchendY = event.changedTouches[0].screenY;
	handleGesture(event);
}, false);

function handleGesture(e : Event) {
	let x = touchendX - touchstartX;
	let y = touchendY - touchstartY;
	let xy = Math.abs(x / y);
	let yx = Math.abs(y / x);
	if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
		if (yx <= limit) {
			if (x < 0) {
				//left
				if(!menuView.isMenuHidden)
					menuView.toggle();
			} else {
				//right
				if(menuView.isMenuHidden)
					menuView.toggle();
			}
		}
		if (xy <= limit) {
			if (y < 0) {
				//top
			} else {
				//bottom
			}
		}
	} else {
		//tap
	}
}



@VueClass()
class CopyrightView extends Vue{

	@VueVar('en') language !: string;

	constructor(containerName:any,vueData:any=null){
		super(vueData);

		Translations.getLang().then((userLang : string) => {
			this.language = userLang;
		});
	}

	@VueWatched()
	languageWatch(){
		Translations.setBrowserLang(this.language);
		Translations.loadLangTranslation(this.language);
	}
}
let copyrightView = new CopyrightView('#copyright');

//========================================================
//==================Loading the right page================
//========================================================

let isCordovaApp = document.URL.indexOf('http://') === -1
	&& document.URL.indexOf('https://') === -1;

let promiseLoadingReady : Promise<void>;

window.native = false;
if(isCordovaApp){
	window.native = true;
	$('body').addClass('native');

	let promiseLoadingReadyResolve : null|Function = null;
	let promiseLoadingReadyReject : null|Function = null;
	promiseLoadingReady = new Promise<void>(function(resolve, reject){
		promiseLoadingReadyResolve = resolve;
		promiseLoadingReadyReject = reject;
	});
	let cordovaJs = document.createElement('script');
	cordovaJs.type = 'text/javascript';
	cordovaJs.src = 'cordova.js';
	document.body.appendChild(cordovaJs);

	let timeoutCordovaLoad = setTimeout(function(){
		if(promiseLoadingReadyResolve)
			promiseLoadingReadyResolve();
	}, 10*1000);
	document.addEventListener('deviceready', function(){
		if(promiseLoadingReadyResolve)
			promiseLoadingReadyResolve();
		clearInterval(timeoutCordovaLoad);
	}, false);

}else
	promiseLoadingReady = Promise.resolve();

promiseLoadingReady.then(function(){
	let router = new Router('./','../../');
	window.onhashchange = function () {
		router.changePageFromHash();
	};
});

//========================================================
//==================Service worker for web================
//========================================================
//only install the service on web platforms and not native

console.log(`%c                                            
 .d8888b.  888                       888    
d88P  Y88b 888                       888    
Y88b.      888                       888    This is a browser feature intended for 
 "Y888b.   888888  .d88b.  88888b.   888    developers. If someone told you to copy-paste 
    "Y88b. 888    d88""88b 888 "88b  888    something here to enable a Qwertycoin feature 
      "888 888    888  888 888  888  Y8P    or "hack" someone\'s account, it is a 
Y88b  d88P Y88b.  Y88..88P 888 d88P         scam and will give them access to your 
 "Y8888P"   "Y888  "Y88P"  88888P"   888    Qwertycoin Wallet.
                           888              
                           888              
                           888              

See https://my.qwertycoin.org/index.html#!selfxss for more information.`, "font-family:monospace")

if (!isCordovaApp && 'serviceWorker' in navigator) {
	const showRefreshUI = function(registration : any){
		//console.log(registration);
		swal({
			type:'info',
			title:i18n.t('global.newVersionModal.title'),
			html:i18n.t('global.newVersionModal.content'),
			confirmButtonText:i18n.t('global.newVersionModal.confirmText'),
			showCancelButton: true,
			cancelButtonText:i18n.t('global.newVersionModal.cancelText'),
		}).then(function(value : any){
			if(!value.dismiss){
				registration.waiting.postMessage('force-activate');
			}
		});
	};

	const onNewServiceWorker = function(registration:any, callback : Function){
		if (registration.waiting) {
			// SW is waiting to activate. Can occur if multiple clients open and
			// one of the clients is refreshed.
			return callback();
		}

		const listenInstalledStateChange = () => {
			registration.installing.addEventListener('statechange', (event : Event) => {
				if ((<any>event.target).state === 'installed') {
					// A new service worker is available, inform the user
					callback();
				}
			});
		};

		if (registration.installing) {
			return listenInstalledStateChange();
		}

		// We are currently controlled so a new SW may be found...
		// Add a listener in case a new SW is found,
		registration.addEventListener('updatefound', listenInstalledStateChange);
	};

	navigator.serviceWorker.addEventListener('message', (event) => {
		if (!event.data) {
			return;
		}

		switch (event.data) {
			case 'reload-window-update':
				window.location.reload(true);
				break;
			default:
				// NOOP
				break;
		}
	});

	navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
		// Track updates to the Service Worker.
		if (!navigator.serviceWorker.controller) {
			// The window client isn't currently controlled so it's a new service
			// worker that will activate immediately
			return;
		}

		//console.log('on new service worker');
		onNewServiceWorker(registration, () => {
			showRefreshUI(registration);
		});
	});
}
