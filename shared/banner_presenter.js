//soll entweder banner anzeigen
// oder sagen nein zu klein, issue (+tracking)

//dependencies:
// sizeIssueIndicator
//trackingevents soll injected werden

//sizeIssueThreshold sollte global irgendwo festgelegt und importiert werden

import SizeIssueIndicator from './track_size_issues';
import { getSkinAdjuster } from './skin';
import { mediaWikiIsShowingContentPage, onMediaWiki } from './mediawiki_checks';
import { createElement, render } from 'preact';

function createResizeHandler( bannerContainer, skinAdjuster ) {
	return function () {
		const banner = bannerContainer.getElementsByClassName( 'wmde-banner' ).item( 0 );
		skinAdjuster.addSpaceInstantly( banner.offsetHeight );
	};
}

export default class BannerPresenter {
	constructor( trackingEvents, sizeTrackRatio ) {
		this.trackingEvents = trackingEvents;
		this.sizeTrackRatio = sizeTrackRatio;
	}

	present( Banner, bannerContainer, props ) {
		const skinAdjuster = getSkinAdjuster();

		const sizeIssueIndicator = new SizeIssueIndicator( skinAdjuster.getSizeIssueThreshold() );

		skinAdjuster.moveBannerContainerToTopOfDom();

		if ( onMediaWiki() && !mediaWikiIsShowingContentPage() ) {
			return;
		}

		const resizeHandler = createResizeHandler( bannerContainer, skinAdjuster );

		render(
			createElement( Banner, {
				...props,
				onClose: () => {
					skinAdjuster.removeSpace();
					window.removeEventListener( 'resize', resizeHandler );
				}
			} ),
			bannerContainer
		);

		const bannerElement = bannerContainer.getElementsByClassName( 'wmde-banner' ).item( 0 );

		this.trackingEvents.trackViewPortDimensions(
			sizeIssueIndicator.getDimensions( bannerElement.offsetHeight ),
			this.sizeTrackRatio
		);

		if ( sizeIssueIndicator.hasSizeIssues( bannerElement ) ) {
			if ( onMediaWiki() ) {
				mw.centralNotice.setBannerLoadedButHidden();
			}
			this.trackingEvents.trackSizeIssueEvent(
				sizeIssueIndicator.getDimensions( bannerElement.offsetHeight ),
				this.sizeTrackRatio
			);
		}

		window.addEventListener( 'resize', resizeHandler );
		resizeHandler(); // call resize handler to trigger adding space

		// TODO cancel display callback
		/*
		skinAdjuster.addSearchObserver( function () {
			bannerDisplayTimeout.cancel();
		} );
		*/

		// TODO muss in eventhandler von close component
		/*
		// BEGIN Banner close functions
		// NOTE: These functions need to stay at the end for the correct order of click events

		$( '#WMDE_Banner .close__link' ).click( function() {
			$( '#WMDE_Banner' ).hide();
			if ( onMediaWiki() ) {
				mw.centralNotice.hideBanner();
			}
			skinAdjuster.removeSpace();

			return false;
		} );
		*/

		// TODO cancel display callback
		/*
		// hide banner when the visual editor is initialized
		$( '#ca-ve-edit, .mw-editsection-visualeditor' ).click( function() {
			$( '#WMDE_Banner' ).hide();
			skinAdjuster.removeSpace();
		} );
		*/
	}

}