require( './css/styles.pcss' );

const bannerTemplate = require( './templates/banner.hbs' );

function hidePoll() {
	$( '.poll' ).hide();
	$.cookie( 'hideSurvey', true, { expires: 30 } );
}

$( document ).ready( function () {
	if ( !$.cookie( 'hideSurvey' ) ) {
		$( '#wmde-banner-featurebox' ).html( bannerTemplate() );
		$( '.poll-close' ).click( hidePoll );
	}
} );
