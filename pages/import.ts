import {AppState} from "../model/AppState";
import {DestructableView} from "../lib/numbersLab/DestructableView";

class ImportView extends DestructableView{
	constructor(container : string){
		super(container);
		let self = this;
	}

}

new ImportView('#app');

AppState.enableLeftMenu();
