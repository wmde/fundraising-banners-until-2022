export function parseCompileInfo( webpackIndexText ) {
	const parser = new DOMParser();
	const doc = parser.parseFromString( webpackIndexText, 'text/html' );
	const compileInfo = {};
	doc.querySelectorAll( '#files li a' ).forEach( node => {
		const fileName = node.querySelector( '.name' )?.textContent;
		const bannerName = fileName.replace( /\.js(\.wikitext)?$/, '' );
		if ( !fileName ) {
			console.log( 'Could not find name element in node', node );
			return;
		}
		const size = node.querySelector( '.size' )?.textContent;
		const date = new Date( node.querySelector( '.date' )?.textContent );
		compileInfo[ bannerName ] = { fileName, size, date };
	} );
	return compileInfo;
}
