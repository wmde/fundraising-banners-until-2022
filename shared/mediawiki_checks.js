export function onMediaWiki() {
	return typeof window.mw === 'object' && typeof window.mw.centralNotice !== 'undefined';
}

export function mediaWikiIsShowingContentPage() {
	return onMediaWiki() && window.mw.config.get( 'wgAction' ) === 'view';
}
