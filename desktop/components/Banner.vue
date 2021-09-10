<template>
	<BannerPresenter ref="presenter">
		<BannerTransition ref="transition">
			<div class="banner__wrapper">
				<div class="banner__content">
					<div class="banner__infobox">
						<div class="banner__slideshow">
							<Slider>
								<Slides/>
							</Slider>
						</div>
					</div>
					<div class="banner__form">
						<div class="form">
							<form method="post" name="donationForm" class="form__element" action="">
								<h1 style="font-family: serif; font-size: 60px">Gib money pwease!!</h1>
								<div className="submit-section button-group">
									<button class="button-group__button">
									<span class="button-group__label">YES I GIB MONEYS!</span>
									</button>
								</div>
							</form>
						</div>
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
import BannerEvents from "../events";

export default {
	name: "Banner",
	components: {
		Slides,
		Slider,
		Footer,
		BannerPresenter,
		BannerTransition,
	},
	inject: [ 'bannerLoaderPlatform', 'trackingService', 'eventBus' ],
	data() {
		return {
			slidesShown: 0,
			finalSlide: 1
		}
	},
	methods: {
		// TODO to avoid code duplication and unnecessary injection across banners
		onClose() {
			this.eventBus.$emit( BannerEvents.BANNER_CLOSED );
			// TODO move to its own tracking service
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
