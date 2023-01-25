import { getSkinAdjuster } from './skin';
import { getBannerLoaderPlatform } from './platform';
import { createVueApp } from './create_vue_app';

const deprecatedEventBus = {
	deprecationWarning( methodName ) {
		console.warn(`Event bus is deprecated, called with ${methodName}. Banner won't work`)
	},
	$emit() {
		this.deprecationWarning('$emit');
	},
	$on() {
		this.deprecationWarning('$on');
	},
	$once() {
		this.deprecationWarning('$once');
	}
}

export class BannerLoader {
	constructor( trackingData, appearanceDelay ) {
		this.trackingData = trackingData;
		this.appearanceDelay = appearanceDelay;
	}

	load( Banner, bannerContainer, translations, props ) {
		const app = createVueApp( Banner, props);
		app.config.globalProperties.$translations = translations;
		app.provide('skinAdjuster', getSkinAdjuster())
			.provide('bannerLoaderPlatform', getBannerLoaderPlatform())
			.provide('trackingService', this.trackingData)
			.provide('eventBus', deprecatedEventBus)
			.mount(bannerContainer);
	} ;
}
