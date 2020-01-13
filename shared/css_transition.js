/**
 * This class builds a CSS transition string from default values and parameters
 */
export default class CssTransition {
	constructor( speed = 1000, easing = 'ease-in-out', delay = 0 ) {
		this.speed = speed;
		this.easing = easing;
		this.delay = delay;
	}

	getTransition( prop = 'all' ) {
		return [ prop, this.speedWithUnit(), this.easing, this.optionalDelay() ].join( ' ' );
	}

	speedWithUnit() {
		return `${this.speed}ms`;
	}

	optionalDelay() {
		return this.delay > 0 ? `${this.delay}ms` : '';
	}
}
