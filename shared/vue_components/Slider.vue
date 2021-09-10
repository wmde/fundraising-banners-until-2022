<template>
	<div class="slider-container">
		<div class="navigation-wrapper">
			<div ref="slider" class="keen-slider">
				<slot/>
			</div>
		</div>
	</div>
</template>

<script>
import KeenSlider from 'keen-slider';

const DEFAULT_INTERVAL = 5000;

export default {
	name: "Slider",
	props: {
		play: Boolean
	},
	data() {
		return {
			slider: null,
			timer: 0,
			interval: null,
		}
	},
	mounted() {
		this.slider = new KeenSlider( this.$refs.slider );
	},
	watch: {
		play: function( value ) {
			if ( value ) {
				this.startAutoplay();
			} else {
				this.stopAutoplay();
			}
		}
	},
	beforeDestroy() {
		if( this.slider ) {
			this.slider.destroy()
		}
	},
	methods: {
		startAutoplay() {
			if ( this.timer !== 0 ) {
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
