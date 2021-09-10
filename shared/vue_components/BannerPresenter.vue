<template>
	<div class="wmde-banner" v-bind:class="visibilityClass">
		<slot></slot>
	</div>
</template>

<script>

import BannerEvents from "../../desktop/events";

export const BannerVisibilityState = Object.freeze( {
	PENDING: Symbol( 'PENDING' ),
	VISIBLE: Symbol( 'VISIBLE' ),
	HIDDEN: Symbol( 'HIDDEN' ),
} );

export default {
	name: "BannerPresenter",
	props: {
		appearanceDelay: Number,
	},
	data() {
		return {
			visibilityState: BannerVisibilityState.PENDING,
		};
	},
	inject: [ 'skinAdjuster', 'bannerLoaderPlatform', 'trackingService', 'eventBus' ],
	methods: {
		displayBanner() {
			if ( !this.skinAdjuster.canDisplayBanner() ) {
				this.visibilityState = BannerVisibilityState.HIDDEN;
				// TODO move to listener
				this.bannerLoaderPlatform.bannerCouldNotBeDisplayed();
				this.eventBus.$emit( BannerEvents.BANNER_NOT_SHOWN );
				return;
			}

			this.visibilityState = BannerVisibilityState.VISIBLE;

			// TODO move to listener
			this.trackingService.tracker.recordBannerImpression();
			// this.impressionCounts.incrementImpressionCounts();

			this.eventBus.$emit( BannerEvents.BANNER_READY )
		},
		hideBanner() {
			this.visibilityState = BannerVisibilityState.HIDDEN;
			this.skinAdjuster.removeSpace();
		}
	},
	created() {
		this.skinAdjuster.moveBannerContainerToTopOfDom();
		this.skinAdjuster.addUserInteractionObservers();
		this.skinAdjuster.addEditorObserver( this.hideBanner );
	},
	mounted() {
		// TODO check for size issues and don't start timer if there is a size issue (log instead)
		setTimeout( this.displayBanner.bind( this ), this.appearanceDelay );
		this.eventBus.$once( BannerEvents.BANNER_CLOSED, this.hideBanner );
	},
	computed: {
		visibilityClass() {
			return {
				'wmde-banner--visible': this.visibilityState === BannerVisibilityState.VISIBLE,
				'wmde-banner--hidden': this.visibilityState === BannerVisibilityState.HIDDEN
			}
		}
	}

}
</script>
