class InterruptibleTimeout {
	constructor() {
		this.timeout = null;
	}

	run( callback, delay ) {
		this.timeout = setTimeout( function () {
			callback();
			this.timeout = null;
		}.bind( this ), delay );
	}

	cancel() {
		clearTimeout( this.timeout );
		this.timeout = null;
	}

	isRunning() {
		return this.timeout !== null;
	}
}

export default InterruptibleTimeout;
