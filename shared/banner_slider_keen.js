import KeenSlider from 'keen-slider';

/**
 * A wrapper around the KeenSlider slider library that tracks viewed slides
 * and attaches to elements with the .mini-banner-carousel and .carousel-cell classes.
 */
export class Slider {

	/**
	 * @param {number} sliderAutoPlaySpeed - Waiting time before next slide is shown automatically
	 * @param {Object} extraOptions - any custom stuff needed for the slider
	 */
	constructor( sliderAutoPlaySpeed, extraOptions = {} ) {
		this.sliderAutoPlaySpeed = sliderAutoPlaySpeed;
		this.extraOptions = extraOptions;
	}

	/**
	 * Creates slider object if it has not been instantiated previously
	 */
	initialize() {
		if ( Object.prototype.hasOwnProperty.call( this, 'slider' ) === false ) {
			this.slider = new KeenSlider(
				'.mini-banner-carousel',
				Object.assign( {
					loop: true,
					pause: false,
					initial: 0,
					// duration is the wrong property for this speed
					interval: this.sliderAutoPlaySpeed,
					prevNextButtons: false,
					mode: 'snap',
					dragStart: () => {
						this.onSlideDrag();
					}
				}, this.extraOptions )
			);
		}
		this.disableAutoplay();
		this.viewedSlides = 1;
		this.slidesCount = document.querySelectorAll( '.mini-banner-carousel .carousel-cell' ).length;
	}

	/**
	 * Handler for "change" event which is triggered when a new slide is shown
	 * This custom handler implements a way to stop the autoplay functionality at the last slide
	 */
	onSlideDrag() {
		this.viewedSlides++;
		if ( !this.slider.pause ) {
			this.disableAutoplay();
			return;
		}
		if ( this.viewedSlides >= this.slidesCount ) {
			this.disableAutoplay();
		}
	}

	/**
	 * @param {number} milliseconds - Time to wait before the slider starts
	 */
	enableAutoplayAfter( milliseconds = 0 ) {
		setTimeout( () => this.enableAutoplay(), milliseconds );
	}

	enableAutoplay() {
		this.slider.pause = false;
	}

	disableAutoplay() {
		this.slider.pause = true;
	}

	getViewedSlides() {
		return this.viewedSlides;
	}

	getCurrentSlide() {
		//TODO find property for keen
		return this.slider.selectedIndex + 1;
	}

	resize() {
		this.slider.resize();
	}

	next() {
		this.slider.next();
	}

	previous() {
		this.slider.prev();
	}
}
