import Skin from './Skin';
import $ from 'jquery';

export default class Vector extends Skin {
	constructor() {
		super();

		this.panel = $( '#mw-panel' );
		this.head = $( '#mw-head' );
		this.pageBase = $( '#mw-page-base' );
		this.searchField = $( '#searchInput' );
	}

	addSpace( bannerHeight ) {
		this.panel.animate( { top: bannerHeight }, 1000 );
		this.head.animate( { top: bannerHeight }, 1000 );
		this.pageBase.animate( { 'padding-top': bannerHeight }, 1000 );
	}

	addSpaceInstantly( bannerHeight ) {
		this.panel.css( { top: bannerHeight } );
		this.head.css( { top: bannerHeight } );
		this.pageBase.css( { paddingTop: bannerHeight } );
	}

	removeSpace() {
		this.panel.css( 'top', 0 );
		this.head.css( 'top', 0 );
		this.pageBase.css( 'padding-top', 0 );
	}

	addSearchObserver( onSearchFocus ) {
		this.searchField.one( 'focus', onSearchFocus );
	}
}
