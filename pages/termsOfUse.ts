import {AppState} from "../model/AppState";
import {DestructableView} from "../lib/numbersLab/DestructableView";

class TermsOfUseView extends DestructableView{
	constructor(container : string){
		super(container);
	}

}

new TermsOfUseView('#app');

AppState.enableLeftMenu();