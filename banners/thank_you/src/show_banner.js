import { mediaWikiIsShowingContentPage, onMediaWiki } from '../../../shared/mediawiki_checks';
import { getSkinAdjuster } from '../../../shared/skin';
import { createElement, render } from 'preact';

function createResizeHandler( bannerContainer, skinFunctions ) {
	return function () {
		const banner = bannerContainer.getElementsByClassName( 'wmde-banner' ).item( 0 );
		skinFunctions.addSpaceInstantly( banner.offsetHeight );
	};
}

export function showBanner( Banner, bannerContainer, props ) {
	if ( onMediaWiki() && !mediaWikiIsShowingContentPage() ) {
		return;
	}

	const skinFunctions = getSkinAdjuster();
	const resizeHandler = createResizeHandler( bannerContainer, skinFunctions );
	skinFunctions.moveBannerContainerToTopOfDom();

	render(
		createElement( Banner, {
			...props,
			onClose: () => {
				skinFunctions.removeSpace();
				window.removeEventListener( 'resize', resizeHandler );
			}
		} ),
		bannerContainer
	);

	props.trackingData.eventTracker.recordBannerImpression();

	window.addEventListener( 'resize', resizeHandler );
	resizeHandler(); // call resize handler to trigger adding space
}
