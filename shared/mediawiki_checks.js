export function onMediaWiki() {
	return typeof window.mw === 'object' && typeof window.mw.centralNotice !== 'undefined';
}

export function mediaWikiIsShowingContentPage() {
	return onMediaWiki() && window.mw.config.get( 'wgAction' ) === 'view';
}

export function mediaWikiMainContentIsHiddenByLightbox() {
	const lightBoxElement = document.getElementsByClassName( ' mw-mmv-lightbox-open' );
	return ( lightBoxElement.length > 0 );
}
