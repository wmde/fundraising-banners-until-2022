import Skin from './Skin';
import $ from 'jquery';

// usually desktop skin

export default class Vector extends Skin {
	constructor() {
		super();

		this.panel = $( '#mw-panel' );
		this.head = $( '#mw-head' );
		this.pageBase = $( '#mw-page-base' );
		this.searchField = $( '#searchInput' );
		this.hidePopup();
	}

	addSpace( bannerHeight, transition ) {
		this.panel.css( { top: bannerHeight, transition: transition.createTransitionValue( 'top' ) } );
		this.head.css( { top: bannerHeight, transition: transition.createTransitionValue( 'top' ) } );
		this.pageBase.css( { paddingTop: bannerHeight, transition: transition.createTransitionValue( 'padding-top' ) } );
	}

	addSpaceInstantly( bannerHeight ) {
		this.panel.css( { top: bannerHeight, transition: 'unset' } );
		this.head.css( { top: bannerHeight, transition: 'unset' } );
		this.pageBase.css( { paddingTop: bannerHeight, transition: 'unset' } );
	}

	addSpaceToSidebarInstantly( bannerHeight ) {
		this.panel.css( { top: bannerHeight, transition: 'unset' } );
	}

	removeSpace( transition ) {
		this.panel.css( { top: 0, transition: transition.createTransitionValue( 'top' ) } );
		this.head.css( { top: 0, transition: transition.createTransitionValue( 'top' ) } );
		this.pageBase.css( { paddingTop: 0, transition: transition.createTransitionValue( 'padding-top' ) } );
	}

	removeSpaceInstantly() {
		this.panel.css( { top: 0, transition: 'unset' } );
		this.head.css( { top: 0, transition: 'unset' } );
		this.pageBase.css( { paddingTop: 0, transition: 'unset' } );
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
