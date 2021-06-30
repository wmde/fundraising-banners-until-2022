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
					// TODO
					// duration is the wrong property for this speed, interval probably too
					interval: this.sliderAutoPlaySpeed,
					prevNextButtons: false,
					mode: 'snap',
					dragStart: () => {
						this.onSlideDrag();
					}
				}, this.extraOptions )
			);
		}
		this.interval = 0;
		this.autoplay( false );
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
			this.autoplay( false );
			return;
		}
		if ( this.viewedSlides >= this.slidesCount ) {
			this.autoplay( false );
		}
	}

	/**
	 * @param {number} milliseconds - Time to wait before the slider starts
	 */
	enableAutoplayAfter( milliseconds = 0 ) {
		setTimeout( () => this.autoplay( true ), milliseconds );
	}

	autoplay( autoplayIsActivated ) {
		clearInterval( this.interval );
		this.interval = setInterval( () => {
			if ( autoplayIsActivated && this.slider ) {
				this.slider.next();
			}
		}, 2000 );
	}

	/*
	enableAutoplay() {
		this.slider.pause = false;
	}
	*/

	disableAutoplay() {
		this.autoplay( false );
	}


	getViewedSlides() {
		return this.viewedSlides;
	}

	getCurrentSlide() {
		//TODO check if this needs a +1 like in the former solution
		return this.slider.details().relativeSlide;
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
