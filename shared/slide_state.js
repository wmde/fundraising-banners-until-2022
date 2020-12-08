/**
 * Data structure for keeping track of shown slides in a banner.
 *
 * The data is used in event tracking
 */
export default class SlideState {
	constructor() {
		this.currentSlide = 0;
		this.slidesShown = 1;
	}

	onSlideChange( newSlideIndex ) {
		this.slidesShown++;
		this.currentSlide = newSlideIndex;
	}
}
