<template>
	<div class="slider-container">
		<div class="navigation-wrapper">
			<div ref="slider" class="keen-slider">
				<slot/>
			</div>
			<a href="#" class="slider-navigation-previous" v-on:click="goToPreviousSlide">
				<svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					{/* eslint-disable-next-line max-len */}
					<path d="M0.242482 7.41446C-0.0808273 7.73785 -0.0808275 8.26215 0.242482 8.58554L7.41279 15.7575C7.74401 16.0888 8.28382 16.0794 8.60343 15.7369L8.77734 15.5506C9.08027 15.2259 9.07325 14.7201 8.76143 14.4039L2.63553 8.19386C2.5295 8.08638 2.5295 7.91362 2.63553 7.80614L8.76143 1.59605C9.07325 1.27995 9.08027 0.774089 8.77734 0.449448L8.60343 0.263065C8.28382 -0.0794487 7.74401 -0.0887552 7.41279 0.242538L0.242482 7.41446Z" fill="#202122"/>
				</svg>
			</a>
			<a href="#" class="slider-navigation-next" v-on:click="goToNextSlide">
				<svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					{/* eslint-disable-next-line max-len */}
					<path d="M8.75752 8.58554C9.08083 8.26215 9.08083 7.73785 8.75752 7.41446L1.58721 0.242538C1.25599 -0.088754 0.71618 -0.079448 0.396574 0.263065L0.222655 0.449448C-0.080274 0.77409 -0.0732549 1.27995 0.238566 1.59605L6.36447 7.80614C6.4705 7.91362 6.4705 8.08638 6.36447 8.19386L0.238567 14.4039C-0.0732528 14.7201 -0.0802727 15.2259 0.222656 15.5506L0.396575 15.7369C0.716182 16.0794 1.25599 16.0888 1.58721 15.7575L8.75752 8.58554Z" fill="#202122"/>
				</svg>
			</a>
		</div>
		<div class="pagination">
			<button
				v-for="(slide, idx) in dotHelper"
				@click="goToSlide(idx)"
				:class="{ 'pagination-dot': true, 'is-active': currentSlide === idx }"
				:key="idx"
			></button>
		</div>
	</div>
</template>

<script>
import KeenSlider from 'keen-slider';

const DEFAULT_INTERVAL = 5000;

export default {
	name: "Slider",
	data() {
		return {
			slider: null,
			currentSlide: 0,
			timer: 0,
			interval: null,
		}
	},
	mounted() {
		this.slider = new KeenSlider( this.$refs.slider, {
			initial: this.currentSlide,
			loop: true,
			slideChanged: (s) => {
				this.currentSlide = s.details().relativeSlide
			},
		} );
	},
	beforeDestroy() {
		if( this.slider ) {
			this.slider.destroy()
		}
	},
	computed: {
		dotHelper() {
			return this.slider ? [ ...Array( this.slider.details().size ).keys() ] : []
		},
	},
	methods: {
		startAutoplay() {
			if( this.timer !== 0 ) {
				return;
			}
			this.timer = setInterval( this.slider.next, this.interval || DEFAULT_INTERVAL );
		},
		stopAutoplay() {
			// We explicitly don't set `timer` to 0, so it can't be started again
			clearInterval( this.timer );
		},
		goToNextSlide( e ) {
			e.stopPropagation();
			this.stopAutoplay();
			this.slider.next();
		},
		goToPreviousSlide( e ) {
			e.stopPropagation();
			this.stopAutoplay();
			this.slider.prev();
		},
		goToSlide( index ) {
			this.stopAutoplay();
			this.slider.moveToSlideRelative( index );
		}
	}
}
</script>
