import {AppState} from "../model/AppState";
import {DestructableView} from "../lib/numbersLab/DestructableView";

class SelfXSSPage extends DestructableView{
	constructor(container : string){
		super(container);
	}

}

new SelfXSSPage('#app');

AppState.enableLeftMenu();