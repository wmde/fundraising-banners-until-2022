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
		if ( this.hasOwnProperty( 'slider' ) === false ) {
			this.slider = new Flickity( document.querySelector( '.mini-banner-carousel' ), {
				wrapAround: true,
				autoPlay: this.sliderAutoPlaySpeed,
				prevNextButtons: false
			} );
			this.disableAutoplay();
			this.slidesCount = document.querySelectorAll( '.mini-banner-carousel .carousel-cell' ).length;
			this.autoplayCount = 0;
		}
	}

	/**
	 * Handler for "select" event which is triggered when a new slide is shown
	 * This custom handler implements a way to stop the autoplay functionality at the last slide
	 */
	onSelect() {
		if ( this.slider.player.state !== 'playing' ) {
			this.disableAutoplay();
			return;
		}
		this.autoplayCount++;
		if ( this.autoplayCount >= this.slidesCount - 1 ) {
			this.disableAutoplay();
		}
	}

	enableAutoplay() {
		this.slider.on( 'select', this.onSelect.bind( this ) );
		this.slider.playPlayer();
	}

	disableAutoplay() {
		this.slider.off( 'select', this.onSelect );
		this.slider.stopPlayer();
	}
}
