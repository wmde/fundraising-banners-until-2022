import Skin from './Skin';
import $ from 'jquery';

export default class Minerva extends Skin {
	constructor() {
		super();

		this.viewport = $( '#mw-mf-viewport' );
		this.searchField = $( '#searchInput, input.search' );
	}

	addSpace( bannerHeight ) {
		this.viewport.animate( { top: bannerHeight }, 1000 );
	}

	addSpaceInstantly( bannerHeight ) {
		this.viewport.css( { top: bannerHeight } );
	}

	removeSpace() {
		this.viewport.css( { top: 0, marginTop: 0 } );
		$( '#mw-mf-page-center, #mw-mf-page-left' ).css( 'top', 0 );
	}

	addSearchObserver( onSearchFocus ) {
		if ( this.searchField.is( ':focus' ) ) {
			onSearchFocus();
		} else {
			this.searchField.one( 'focus', onSearchFocus );
		}
	}

	moveBannerContainerToTopOfDom() {
		$( 'body' ).prepend( $( '#centralNotice' ) );
	}
}
