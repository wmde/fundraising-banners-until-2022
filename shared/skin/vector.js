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

	addSpace( bannerHeight, transition ) {
		this.panel.css( { top: bannerHeight, transition: transition.getTransition( 'top' ) } );
		this.head.css( { top: bannerHeight, transition: transition.getTransition( 'top' ) } );
		this.pageBase.css( { paddingTop: bannerHeight, transition: transition.getTransition( 'padding-top' ) } );
	}

	addSpaceInstantly( bannerHeight ) {
		this.panel.css( { top: bannerHeight, transition: 'unset' } );
		this.head.css( { top: bannerHeight, transition: 'unset' } );
		this.pageBase.css( { paddingTop: bannerHeight, transition: 'unset' } );
	}

	removeSpace() {
		this.panel.css( { top: 0, transition: 'unset' } );
		this.head.css( { top: 0, transition: 'unset' } );
		this.pageBase.css( { paddingTop: 0, transition: 'unset' } );
	}

	addSearchObserver( onSearchFocus ) {
		this.searchField.one( 'focus', onSearchFocus );
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
}
