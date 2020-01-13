import Skin from './Skin';
import $ from 'jquery';

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

	addSearchObserver( onSearchFocus ) {
		if ( this.searchField.is( ':focus' ) ) {
			onSearchFocus();
		} else {
			this.searchField.one( 'focus', onSearchFocus );
		}
	}

	addEditorObserver( onEdit ) {
		$( '#ca-ve-edit, .mw-editsection-visualeditor' ).click( onEdit );
	}

	moveBannerContainerToTopOfDom() {
		$( 'body' ).prepend( $( '#centralNotice' ) );
	}

	getSizeIssueThreshold() {
		return 180;
	}
}
