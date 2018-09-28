import Flickity from 'flickity';

export class Slider {

	/**
	 * Creates slider object if it has not been instantiated previously
	 */
	initialize() {
		if ( this.hasOwnProperty( 'slider' ) === false ) {
			this.slider = new Flickity( document.querySelector( '.mini-banner-carousel' ), {
				wrapAround: true,
				prevNextButtons: false
			} );
		}
	}
}
