import SizeIssueIndicator from './track_size_issues';
import { getSkinAdjuster } from './skin';
import { mediaWikiIsShowingContentPage, onMediaWiki } from './mediawiki_checks';
import { createElement, render } from 'preact';
import InterruptibleTimeout from './interruptible_timeout';
import { VIEWPORT_TRACKING_IDENTIFIER, VIEWPORT_TRACKING_SUBMITTED_EVENT_IDENTIFIER } from './event_logging_tracker';

export default class BannerPresenter {
	constructor( trackingData, appearanceDelay, impressionCounts ) {
		this.trackingData = trackingData;
		this.appearanceDelay = appearanceDelay;
		this.impressionCounts = impressionCounts;
		this.resizeHandlerOfBanner = null;
	}

	createResizeHandler( bannerContainer, skinAdjuster ) {
		return function () {
			if ( this.resizeHandlerOfBanner ) {
				this.resizeHandlerOfBanner();
			} else {
				const banner = bannerContainer.getElementsByClassName( 'banner-position' ).item( 0 );
				skinAdjuster.addSpaceInstantly( banner.offsetHeight );
			}
		}.bind( this );
	}

	present( Banner, bannerContainer, props, sizeIssueThreshold ) {
		const skinAdjuster = getSkinAdjuster();

		if ( sizeIssueThreshold === undefined ) {
			sizeIssueThreshold = skinAdjuster.getSizeIssueThreshold();
		}
		const sizeIssueIndicator = new SizeIssueIndicator( sizeIssueThreshold );

		if ( onMediaWiki() && !mediaWikiIsShowingContentPage() ) {
			mw.centralNotice.setBannerLoadedButHidden();
			return;
		}

		skinAdjuster.moveBannerContainerToTopOfDom();

		const resizeHandler = this.createResizeHandler( bannerContainer, skinAdjuster ).bind( this );
		let displayBanner;
		let bannerElement;
		render(
			createElement( Banner, {
				...props,
				trackingData: this.trackingData,
				impressionCounts: this.impressionCounts,
				onClose: ( slidesShown = 0, finalSlide = 0 ) => {
					this.trackingData.tracker.trackBannerEventWithViewport(
						'banner-closed',
						slidesShown,
						finalSlide,
						this.trackingData.bannerCloseTrackRatio,
						sizeIssueIndicator.getDimensions( bannerElement.offsetHeight )
					);
					skinAdjuster.removeSpace();
					window.removeEventListener( 'resize', resizeHandler );
					if ( onMediaWiki() ) {
						mw.centralNotice.hideBanner();
					}
				},
				onSubmit: () => {
					this.trackingData.tracker.trackViewPortDimensions(
						VIEWPORT_TRACKING_SUBMITTED_EVENT_IDENTIFIER,
						sizeIssueIndicator.getDimensions( bannerElement.offsetHeight ),
						1
					);
				},
				onFinishedTransitioning() {
					window.addEventListener( 'resize', resizeHandler );
				},
				registerDisplayBanner: cb => {
					displayBanner = cb;
				},
				registerResizeBanner: cb => {
					this.resizeHandlerOfBanner = cb;
				},
				skinAdjuster
			} ),
			bannerContainer
		);

		bannerElement = bannerContainer.getElementsByClassName( 'banner-position' ).item( 0 );

		this.trackingData.tracker.trackViewPortDimensions(
			VIEWPORT_TRACKING_IDENTIFIER,
			sizeIssueIndicator.getDimensions( bannerElement.offsetHeight ),
			this.trackingData.sizeTrackRatio
		);

		if ( sizeIssueIndicator.hasSizeIssues( bannerElement ) ) {
			if ( onMediaWiki() ) {
				mw.centralNotice.setBannerLoadedButHidden();
			}
			this.trackingData.tracker.trackSizeIssueEvent(
				sizeIssueIndicator.getDimensions( bannerElement.offsetHeight ),
				this.trackingData.sizeTrackRatio
			);
			return;
		}
		const bannerDisplayTimeout = new InterruptibleTimeout();
		bannerDisplayTimeout.run(
			() => {
				this.impressionCounts.incrementImpressionCounts();
				displayBanner();
			},
			this.appearanceDelay
		);

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
