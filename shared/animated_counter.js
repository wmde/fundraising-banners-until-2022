/**
 * Increase a number between two values for a specified time, calling the callback on each progress tick
 */
export default class AnimatedCounter {
	constructor( callback, countFrom, countTo, animationTime ) {
		this.callback = callback;
		this.startValue = countFrom;
		this.range = countTo - countFrom;
		this.animationTime = animationTime;
		this.startTime = null;
	}

	nextTick( timestamp ) {
		if ( !this.startTime ) {
			this.startTime = timestamp;
		}
		const progress = timestamp - this.startTime;
		const progressPercent = progress / this.animationTime;

		if ( progress > this.animationTime ) {
			this.callback( this.startValue + this.range );
			return;
		}

		const newValue = Math.floor( this.startValue + this.range * progressPercent );
		this.callback( newValue );
		window.requestAnimationFrame( this.nextTick.bind( this ) );
	}

	start() {
		window.requestAnimationFrame( this.nextTick.bind( this ) );
	}
}
