import { onMediaWiki } from '../mediawiki_checks';
import { MediawikiPlatform } from './mediawiki';
import { AbstractPlatform } from './abstract';

export function getBannerLoaderPlatform() {
	if ( onMediaWiki() ) {
		return new MediawikiPlatform();
	}
	return new AbstractPlatform();
}
