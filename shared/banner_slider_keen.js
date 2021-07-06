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
					interval: 0,
					prevNextButtons: false,
					mode: 'snap',
					dragStart: () => {
						this.onSlideDrag();
					},
					slideChanged: ( instance ) => {
						this.updateNavigationDots( instance );
					},
					mounted: ( instance ) => {
						this.initializeDotsNavigation( instance );
						this.updateNavigationDots( instance );
					}
				}, this.extraOptions )
			);
		}
		this.interval = 0;
		this.disableAutoplay();
		this.viewedSlides = 1;
		this.slidesCount = document.querySelectorAll( '.mini-banner-carousel .carousel-cell' ).length;
	}

	initializeDotsNavigation( sliderInstance ) {
		const dotsWrapper = document.getElementById( 'dots-navigation' );
		const slideElements = document.querySelectorAll( '.keen-slider__slide' );

		slideElements.forEach( function ( t, slideId ) {
			const dot = document.createElement( 'button' );
			dot.classList.add( 'dot' );
			dotsWrapper.appendChild( dot );
			dot.addEventListener( 'click', function () {
				sliderInstance.moveToSlide( slideId );
			} );
		} );
	}

	updateNavigationDots( sliderInstance ) {
		const slide = sliderInstance.details().relativeSlide;
		const dots = document.querySelectorAll( '.dot' );
		dots.forEach( function ( dotElement, dotIndex ) {
			if ( dotIndex === slide ) {
				dotElement.classList.add( 'dot--active' );
			} else {
				dotElement.classList.remove( 'dot--active' );
			}
		} );
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

	disableAutoplay() {
		clearInterval( this.interval );
	}

	enableAutoplay() {
		clearInterval( this.interval );
		this.interval = setInterval( () => {
			if ( this.slider ) {
				this.slider.next();
			}
		}, this.sliderAutoPlaySpeed );
	}

	getViewedSlides() {
		return this.viewedSlides;
	}

	getCurrentSlide() {
		return this.slider.details().relativeSlide + 1;
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
