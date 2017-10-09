"use strict";

const Skin = require("./Skin");

module.exports = class Minerva extends Skin {
	addSpace( bannerHeight ) {
		$( '#mw-mf-viewport' ).animate( { 'top': bannerHeight }, 1000 );
	};

	addSpaceInstantly( bannerHeight ) {
		$( '#mw-mf-viewport' ).css( { top: bannerHeight } );
	};

	removeSpace() {
		$( '#mw-mf-viewport' ).css( { top: 0, marginTop: 0 } );
		$( '#mw-mf-page-center, #mw-mf-page-left' ).css( 'top', 0 );
	};
};
