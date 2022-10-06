import Skin from './Skin';
import $ from 'jquery';

// usually desktop skin

export default class Vector2022 extends Skin {
	constructor() {
		super();

		this.container = $( '.mw-page-container' );
		this.searchField = $( '#searchInput' );
		this.hidePopup();
	}

	addSpace( bannerHeight, transition ) {
		this.container.css( { paddingTop: bannerHeight, transition: transition.createTransitionValue( 'padding-top' ) } );
	}

	addSpaceInstantly( bannerHeight ) {
		this.container.css( { paddingTop: bannerHeight, transition: 'unset' } );
	}

	removeSpace() {
		this.container.css( { paddingTop: 0, transition: 'unset' } );
	}

	addSearchObserver( onSearchFocusWhenBannerIsLoading ) {
		this.searchField.one( 'focus', onSearchFocusWhenBannerIsLoading );
	}

	addEditorObserver( onEdit ) {
		$( '#ca-ve-edit, .mw-editsection-visualeditor' ).click( onEdit );
	}

	moveBannerContainerToTopOfDom() {
		$( 'body' ).prepend( $( '#centralNotice' ) );
	}

	getSizeIssueThreshold() {
		return 160;
	}

	hidePopup() {
		$( 'head' ).prepend( '<style>.mw-notification-area-overlay { display: none; }</style>' );
	}

	getName() {
		return 'vector';
	}
}
