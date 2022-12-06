export default function getBannerDelay( delayValue ) {
	const parameters = window.location.search;
	if ( parameters.match( /&devMode/ ) ) {
		return 1;
	}
	return delayValue;
}
