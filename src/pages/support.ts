import {DestructableView} from "../lib/numbersLab/DestructableView";
import {AppState} from "../model/AppState";

class SupportView extends DestructableView{
	constructor(container : string){
		super(container);
		let self = this;
		AppState.enableLeftMenu();
	}

}

new SupportView('#app');