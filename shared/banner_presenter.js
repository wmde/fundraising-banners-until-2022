import SizeIssueIndicator from './track_size_issues';
import { getSkinAdjuster } from './skin';
import {
	mediaWikiIsShowingContentPage,
	mediaWikiMainContentIsHiddenByLightbox,
	onMediaWiki
} from './mediawiki_checks';
import { createElement, render } from 'preact';
import InterruptibleTimeout from './interruptible_timeout';
import { VIEWPORT_TRACKING_IDENTIFIER, VIEWPORT_TRACKING_SUBMITTED_EVENT_IDENTIFIER } from './event_logging_tracker';

export default class BannerPresenter {
	constructor( trackingData, appearanceDelay, impressionCounts, mwCloseHandler ) {
		this.trackingData = trackingData;
		this.appearanceDelay = appearanceDelay;
		this.impressionCounts = impressionCounts;
		this.resizeHandlerOfBanner = null;
		this.mwCloseHandler = this.getmwCloseHandler( mwCloseHandler );
	}

	getmwCloseHandler( mwCloseHandler ) {
		if ( mwCloseHandler ) {
			return mwCloseHandler;
		}

		if ( !onMediaWiki() ) {
			return null;
		}

		return mw.centralNotice.hideBanner;
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

	present( Banner, bannerContainer, props, minimumHeight, minimumWidth = 0 ) {
		const skinAdjuster = getSkinAdjuster();

		if ( !minimumHeight ) {
			minimumHeight = skinAdjuster.getSizeIssueThreshold();
		}
		const sizeIssueIndicator = new SizeIssueIndicator( minimumHeight, minimumWidth );

		if ( onMediaWiki() &&
			( !mediaWikiIsShowingContentPage() || mediaWikiMainContentIsHiddenByLightbox() ) ) {
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
				getBannerDimensions: () => {
					return sizeIssueIndicator.getDimensions( bannerElement.offsetHeight );
				},
				onClose: () => {
					this.trackingData.tracker.trackViewPortDimensions(
						'banner-closed',
						sizeIssueIndicator.getDimensions( bannerElement.offsetHeight ),
						this.trackingData.bannerCloseTrackRatio,
					);
					skinAdjuster.removeSpace();
					window.removeEventListener( 'resize', resizeHandler );
					if ( onMediaWiki() ) {
						this.mwCloseHandler();
					}
				},
				onSubmit: () => {
					this.trackingData.tracker.trackViewPortDimensions(
						VIEWPORT_TRACKING_SUBMITTED_EVENT_IDENTIFIER,
						sizeIssueIndicator.getDimensions( bannerElement.offsetHeight ),
						1
					);
				},
				onMaybeLater: () => {
					skinAdjuster.removeSpace();
					window.removeEventListener( 'resize', resizeHandler );
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
			this.trackingData.viewportDimensionsTrackRatio
		);

		if ( sizeIssueIndicator.hasSizeIssues( bannerElement ) ) {
			if ( onMediaWiki() ) {
				mw.centralNotice.setBannerLoadedButHidden();
			}
			this.trackingData.tracker.trackSizeIssueEvent(
				sizeIssueIndicator.getDimensions( bannerElement.offsetHeight ),
				this.trackingData.sizeIssueTrackRatio
			);
			return;
		}
		const bannerDisplayTimeout = new InterruptibleTimeout();
		bannerDisplayTimeout.run(
			() => {
				if ( onMediaWiki() && mediaWikiMainContentIsHiddenByLightbox() ) {
					mw.centralNotice.setBannerLoadedButHidden();
					return;
				}
				this.impressionCounts.incrementImpressionCounts();
				displayBanner();
				this.trackingData.tracker.recordBannerImpression();
			},
			this.appearanceDelay
		);

		// cancel the banner when the search bar was entered
		skinAdjuster.addSearchObserver( function () {
			bannerDisplayTimeout.cancel();
			if ( onMediaWiki() ) {
				mw.centralNotice.setBannerLoadedButHidden();
			}
		}, function () {
			mw.centralNotice.hideBanner();
			skinAdjuster.removeSpace();
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
