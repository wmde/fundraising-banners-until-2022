<template>
    <BannerPresenter ref="presenter" v-on:banner-visible="$refs.transition.startTransition()">
        <BannerTransition ref="transition">
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
				<Footer/>
            </div>
        </BannerTransition>
    </BannerPresenter>
</template>

<script>

import BannerPresenter from "../../shared/vue_components/BannerPresenter";
import BannerTransition from "../../shared/vue_components/BannerTransition";
import { getDimensions } from "../../shared/track_size_issues";
import Footer from '../../shared/vue_components/Footer';
import Slider from '../../shared/vue_components/Slider';
import Slides from './Slides';

export default {
	name: "Banner",
	components: {
		Slides,
		Slider,
		Footer,
		BannerPresenter,
		BannerTransition,
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
