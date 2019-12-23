import Minerva from './minerva';
import Monobook from './monobook';
import Vector from './vector';
import Skin from './Skin';
import { onMediaWiki } from '../mediawiki_checks';

export { Minerva, Monobook, Vector };
export { default as Wpde } from './wpde';

export function getSkin() {
	if ( !onMediaWiki() ) {
		return new Skin();
	}

	const skinName = window.mw.config.get( 'skin' );
	switch ( skinName ) {
		case 'minerva':
			return new Minerva();
		case 'monobook':
			return new Monobook();
		case 'vector':
			return new Vector();
		default:
			return new Vector();
	}
}
