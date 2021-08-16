import Skin from './Skin';
import $ from 'jquery';

// usually mobile skin

export default class Minerva extends Skin {
	constructor() {
		super();

		this.viewport = $( '#mw-mf-viewport' );
		this.searchField = $( '#searchInput, input.search' );
	}

	addSpace( bannerHeight, transition ) {
		this.viewport.css( {
			top: bannerHeight,
			transition: transition.createTransitionValue( 'top' )
		} );
	}

	addSpaceInstantly( bannerHeight ) {
		this.viewport.css( {
			top: bannerHeight,
			transition: 'unset'
		} );
	}

	removeSpace() {
		this.viewport.css( { top: 0, marginTop: 0, transition: 'unset' } );
	}

	addSearchObserver( onSearchFocusWhenBannerIsLoading, onSearchFocusWhenBannerIsVisible ) {
		if ( this.searchField.is( ':focus' ) ) {
			onSearchFocusWhenBannerIsLoading();
			onSearchFocusWhenBannerIsVisible();
		} else {
			this.searchField.one( 'focus', () => {
				onSearchFocusWhenBannerIsLoading();
				onSearchFocusWhenBannerIsVisible();
			} );
		}
	}

	addEditorObserver( onEdit ) {
		$( '#ca-ve-edit, .mw-editsection-visualeditor' ).click( onEdit );
	}
}
