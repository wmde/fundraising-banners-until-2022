import Skin from './Skin';
import $ from 'jquery';

// usually desktop skin

export default class Vector extends Skin {
	constructor() {
		super();

		this.panel = $( '#mw-panel' );
		this.head = $( '#mw-head' );
		this.searchField = $( '#searchInput' );
		this.hidePopup();
	}

	addSpaceInstantly( bannerHeight ) {
		this.panel.css( { top: bannerHeight, transition: 'unset' } );
		this.head.css( { top: bannerHeight, transition: 'unset' } );
	}

	addSpaceToSidebarInstantly( bannerHeight ) {
		this.panel.css( { top: bannerHeight, transition: 'unset' } );
	}

	removeSpace() {
		this.panel.css( { top: 0, transition: 'unset' } );
		this.head.css( { top: 0, transition: 'unset' } );
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
