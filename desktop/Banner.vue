<template>
    <BannerPresenter ref="presenter">
        <div class="banner-position banner-position--state-finished">
            <div class="banner__wrapper">
                <div class="banner__content">
                    <div class="banner__infobox">
                        <div class="banner__slideshow">
                            Slideshow
                        </div>
                    </div>
                    <div class="banner__form">
                        Form
                    </div>
                </div>
                <div class="close">
                    <a class="close__link" v-on:click.prevent="onClose">&#x2715;</a>
                </div>
            </div>
        </div>
    </BannerPresenter>
</template>

<script>

import BannerPresenter from "../shared/vue_components/BannerPresenter";
import {getDimensions} from "../shared/track_size_issues";

export default {
    name: "Banner",
	components: {
			BannerPresenter
	},
	inject: [ 'bannerLoaderPlatform', 'trackingService' ],
	data() {
			return {
				slidesShown: 0,
				finalSlide: 1
			}
	},
	methods: {
			// TODO to avoid code duplication and unnecessary injection across banners
			onClose() {
				this.$refs.presenter.hideBanner();
				this.trackingService.tracker.trackBannerEventWithViewport(
						'banner-closed',
						this.slidesShown,
						this.finalSlide,
						this.trackingService.bannerCloseTrackRatio,
						getDimensions( this.$el.clientHeight )
				);
				this.bannerLoaderPlatform.bannerWasClosed();
			},
		// TODO handle slide events to change slidesShown and finalSlide
	}
}
</script>
