export default function debounce( callback, delay ) {
	let timer = null;
	return () => {
		let context = this;
		let args = arguments;
		clearTimeout( timer );
		timer = setTimeout( () => {
			callback.apply( context, args );
		}, delay );
	};
}
