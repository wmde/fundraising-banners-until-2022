import Flickity from 'flickity';

export class Slider {

	/**
	 * @param {int} sliderAutoPlaySpeed - Waiting time before next slide is shown automatically
	 */
	constructor( sliderAutoPlaySpeed ) {
		this.sliderAutoPlaySpeed = sliderAutoPlaySpeed;
	}

	/**
	 * Creates slider object if it has not been instantiated previously
	 */
	initialize() {
		if ( Object.prototype.hasOwnProperty.call( this, 'slider' ) === false ) {
			this.slider = new Flickity( document.querySelector( '.mini-banner-carousel' ), {
				wrapAround: true,
				autoPlay: this.sliderAutoPlaySpeed,
				prevNextButtons: false
			} );
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
}
