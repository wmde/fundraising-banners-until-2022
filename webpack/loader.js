const qs = require( 'query-string' );
const query = qs.parse( window.location.search );

if ( !query.banner ) {
	let bannerlist = [];
	Object.keys( CAMPAIGNS ).forEach( function ( campaign ) {
		Object.keys( CAMPAIGNS[ campaign ].banners ).forEach( function ( banner ) {
			let target = window.location.href + "wiki/Wikipedia:Hauptseite?banner=B17WMDE_webpack_prototype&devbanner=" + CAMPAIGNS[ campaign ].banners[ banner ].pagename;
           bannerlist.push( '<li><a href="' + target + '">' + CAMPAIGNS[ campaign ].banners[ banner ].pagename + '</a></li>' );
		} );
	} );
    $( 'body' ).html(
        "<p>Select a Banner:</p><ul>" + bannerlist.join( '' ) + '</ul>'
    );
}

// TODO banner loading functions for non-proxied development (with `localbanner` param)
// TODO inject CAMPAIGNS as data attribute into banner prototype container, so MW-based loader can use the data
