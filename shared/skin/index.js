import Minerva from './minerva';
import Monobook from './monobook';
import Vector from './vector';
import Vector2022 from './vector-2022';
import Wpde from './wpde';
import { onMediaWiki } from '../mediawiki_checks';

export { Minerva, Monobook, Vector, Vector2022 };
export { default as Wpde } from './wpde';

export function getSkinAdjuster() {
	if ( !onMediaWiki() ) {
		return new Wpde();
	}

	const skinName = window.mw.config.get( 'skin' );
	switch ( skinName ) {
		case 'minerva':
			return new Minerva();
		case 'monobook':
			return new Monobook();
		case 'vector':
			return new Vector();
		case 'vector-2022':
			return new Vector2022();
		default:
			return new Vector();
	}
}
