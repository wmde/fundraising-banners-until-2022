import Skin from './Skin';
import $ from 'jquery';

export default class Monobook extends Skin {
	constructor() {
		super();

		this.globalWrapper = $( '#globalWrapper' );
	}

	addSpace( bannerHeight ) {
		this.globalWrapper.animate( { top: bannerHeight }, 1000 );
	}

	addSpaceInstantly( bannerHeight ) {
		this.globalWrapper.css( 'top', bannerHeight );
	}

	removeSpace() {
		this.globalWrapper.css( 'top', 0 );
	}

	getName() {
		return 'monobook';
	}
}
