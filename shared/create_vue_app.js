import {createApp} from 'vue';

/**
 * This is a wrapper around createApp, which uses MediaWiki-provided Vue instance if available (i.e. in Production)
 */
export function createVueApp( rootComponent, rootProps ) {
	if ( typeof Vue !== "undefined" && Vue !== null && (typeof Vue === "object" || typeof Vue === "function" ) && Vue.hasOwnProperty( 'createMwApp' ) ) {
		return Vue.createMwApp( rootComponent, rootProps );
	}
	return createApp( rootComponent, rootProps );
}

