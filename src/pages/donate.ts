import {AppState} from "../model/AppState";
import {DestructableView} from "../lib/numbersLab/DestructableView";

AppState.enableLeftMenu();

class DonateView extends DestructableView{
	constructor(container : string){
		super(container);
		let self = this;
	}

}

new DonateView('#app');