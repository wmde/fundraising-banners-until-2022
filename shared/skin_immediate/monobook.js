import Skin from './Skin';
import $ from 'jquery';

export default class Monobook extends Skin {
	constructor() {
		super();

		this.globalWrapper = $( '#globalWrapper' );
	}

	moveBannerContainerToTopOfDom() {
		$( 'body' ).prepend( $( '#centralNotice' ) );
	}

	// eslint-disable-next-line no-unused-vars
	addSpaceInstantly( bannerHeight ) {
		this.globalWrapper.css( 'margin-top', '10px' );
	}

	removeSpace() {
		this.globalWrapper.css( 'margin-top', 0 );
	}

	getName() {
		return 'monobook';
	}
}
