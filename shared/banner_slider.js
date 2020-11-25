import Flickity from 'flickity';

/**
 * A wrapper around the Flickity slider library that tracks viewed slides
 * and attaches to elements with the .mini-banner-carousel and .carousel-cell classes.
 */
export class Slider {

	/**
	 * @param {int} sliderAutoPlaySpeed - Waiting time before next slide is shown automatically
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
			this.slider = new Flickity(
				document.querySelector( '.mini-banner-carousel' ),
				Object.assign( {
					wrapAround: true,
					autoPlay: this.sliderAutoPlaySpeed,
					prevNextButtons: false
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
	onChange() {
		this.viewedSlides++;
		if ( this.slider.player.state !== 'playing' ) {
			this.disableAutoplay();
			return;
		}
		if ( this.viewedSlides >= this.slidesCount ) {
			this.disableAutoplay();
		}
	}

	/**
	 * @param {int} milliseconds - Time to wait before the slider starts
	 */
	enableAutoplayAfter( milliseconds = 0 ) {
		setTimeout( () => this.enableAutoplay(), milliseconds );
	}

	enableAutoplay() {
		this.slider.on( 'change', this.onChange.bind( this ) );
		this.slider.playPlayer();
	}

	disableAutoplay() {
		this.slider.off( 'change', this.onChange );
		this.slider.stopPlayer();
	}

	getViewedSlides() {
		return this.viewedSlides;
	}

	getCurrentSlide() {
		return this.slider.selectedIndex + 1;
	}

	resize() {
		this.slider.resize();
	}

	next() {
		this.slider.next( true );
	}

	previous() {
		this.slider.previous( true );
	}
}
