import Skin from './Skin';
import $ from 'jquery';

// usually mobile skin

export default class Minerva extends Skin {
	constructor() {
		super();

		this.viewport = $( '#mw-mf-viewport' );
		this.navigation = $( '#mw-mf-page-left' );
		this.searchField = $( '#searchInput, input.search' );
		this.searchButton = $( '#searchIcon' );
	}

	addSpace( bannerHeight, transition ) {
		this.viewport.css( { top: bannerHeight, transition: transition.createTransitionValue( 'top' ) } );
		this.navigation.css( { top: bannerHeight, transition: transition.createTransitionValue( 'top' ) } );
	}

	addSpaceInstantly( bannerHeight ) {
		this.viewport.css( { top: bannerHeight, transition: 'unset' } );
		this.navigation.css( { top: bannerHeight, transition: 'unset' } );
	}

	removeSpace() {
		this.viewport.css( { top: 0, marginTop: 0, transition: 'unset' } );
		this.navigation.css( { top: 0, marginTop: 0, transition: 'unset' } );
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
		this.searchButton.on( 'click', () => {
			onSearchFocusWhenBannerIsLoading();
			onSearchFocusWhenBannerIsVisible();
		} );
	}

	addEditorObserver( onEdit ) {
		$( '#ca-ve-edit, .mw-editsection-visualeditor' ).click( onEdit );
	}

	getName() {
		return 'minerva';
	}
}
