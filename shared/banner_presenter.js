import SizeIssueIndicator from './track_size_issues';
import { getSkinAdjuster } from './skin';
import { mediaWikiIsShowingContentPage, onMediaWiki } from './mediawiki_checks';
import { createElement, render } from 'preact';
import InterruptibleTimeout from './interruptible_timeout';

function createResizeHandler( bannerContainer, skinAdjuster ) {
	return function () {
		const banner = bannerContainer.getElementsByClassName( 'banner-position' ).item( 0 );
		skinAdjuster.addSpaceInstantly( banner.offsetHeight );
	};
}

export default class BannerPresenter {
	constructor( trackingEvents, sizeTrackRatio, appearanceDelay ) {
		this.trackingEvents = trackingEvents;
		this.sizeTrackRatio = sizeTrackRatio;
		this.appearanceDelay = appearanceDelay;
	}

	present( Banner, bannerContainer, props ) {
		const skinAdjuster = getSkinAdjuster();

		const sizeIssueIndicator = new SizeIssueIndicator( skinAdjuster.getSizeIssueThreshold() );

		skinAdjuster.moveBannerContainerToTopOfDom();

		if ( onMediaWiki() && !mediaWikiIsShowingContentPage() ) {
			return;
		}

		const resizeHandler = createResizeHandler( bannerContainer, skinAdjuster );
		let displayBanner;
		render(
			createElement( Banner, {
				...props,
				onClose: () => {
					skinAdjuster.removeSpace();
					window.removeEventListener( 'resize', resizeHandler );
					if ( onMediaWiki() ) {
						mw.centralNotice.hideBanner();
					}
				},
				registerDisplayBanner: ( cb ) => {
					displayBanner = cb;
				}
			} ),
			bannerContainer
		);

		const bannerElement = bannerContainer.getElementsByClassName( 'banner-position' ).item( 0 );

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
			return;
		}
		const bannerDisplayTimeout = new InterruptibleTimeout();
		bannerDisplayTimeout.run(
			() => {
				skinAdjuster.addSpace( bannerElement.offsetHeight );
				displayBanner();
			},
			this.appearanceDelay
		);

		window.addEventListener( 'resize', resizeHandler );

		// cancel the banner when the search bar was entered
		skinAdjuster.addSearchObserver( function () {
			bannerDisplayTimeout.cancel();
			if ( onMediaWiki() ) {
				mw.centralNotice.setBannerLoadedButHidden();
			}
		} );

		// hide banner when the visual editor is initialized
		skinAdjuster.addEditorObserver( function () {
			if ( onMediaWiki() ) {
				mw.centralNotice.hideBanner();
			}
			skinAdjuster.removeSpace();
		} );
	}

}
