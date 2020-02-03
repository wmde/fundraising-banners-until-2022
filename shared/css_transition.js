/**
 * Build a CSS transition string from default values and parameters
 */
export default class CssTransition {
	constructor( speed = 1000, easing = 'ease-in-out', delay = 0 ) {
		this.speed = speed;
		this.easing = easing;
		this.delay = delay;
	}

	/**
	 * Create CSS value for transition
	 *
	 * @param {string} prop The property to apply the transition value to (first part of CSS compound value 'transition')
	 * @return {string}
	 */
	createTransitionValue( prop = 'all' ) {
		return [ prop, this.speedWithUnit(), this.easing, this.optionalDelay() ].join( ' ' );
	}

	/**
	 * @private
	 * @return {string}
	 */
	speedWithUnit() {
		return `${this.speed}ms`;
	}

	/**
	 * @private
	 * @return {string}
	 */
	optionalDelay() {
		return this.delay > 0 ? `${this.delay}ms` : '';
	}
}
