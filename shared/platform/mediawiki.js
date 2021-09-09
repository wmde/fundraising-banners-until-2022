import { AbstractPlatform } from './abstract';

export class MediawikiPlatform extends AbstractPlatform {

	bannerWasClosed() {
		mw.centralNotice.hideBanner();
	}

	bannerCouldNotBeDisplayed() {
		mw.centralNotice.setBannerLoadedButHidden();
	}
}
