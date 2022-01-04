import {AppState} from "../model/AppState";
import {DestructableView} from "../lib/numbersLab/DestructableView";

class PrivacyPolicyView extends DestructableView{
	constructor(container : string){
		super(container);
	}

}

new PrivacyPolicyView('#app');

AppState.enableLeftMenu();