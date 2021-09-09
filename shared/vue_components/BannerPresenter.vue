<template>
	<div class="wmde-banner" v-bind:class="visibilityClass">
		<slot></slot>
	</div>
</template>

<script>

// TODO (might be implemented elsewhere)
// Tracking submit
// Register resize event
// tracking close event

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
	inject: [ 'skinAdjuster', 'bannerLoaderPlatform' ],
	methods: {
		displayBanner() {
			if ( !this.skinAdjuster.canDisplayBanner() ) {
				this.visibilityState = BannerVisibilityState.HIDDEN;
				this.bannerLoaderPlatform.bannerCouldNotBeDisplayed();
				return;
			}

			this.visibilityState = BannerVisibilityState.VISIBLE;

			// TODO
			// this.impressionCounts.incrementImpressionCounts();
			// this.trackingData.tracker.recordBannerImpression();
		},
		hideBanner() {
			this.visibilityState = BannerVisibilityState.HIDDEN;
			this.skinAdjuster.removeSpace();
			this.bannerLoaderPlatform.bannerWasClosed();
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
