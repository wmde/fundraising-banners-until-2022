"use strict";

const Skin = require("./Skin");

module.exports = class Vector extends Skin {
	addSpace( bannerHeight ) {
		$( '#mw-panel' ).animate( { 'top': bannerHeight }, 1000 );
		$( '#mw-head' ).animate( { 'top': bannerHeight }, 1000 );
		$( '#mw-page-base' ).animate( { 'padding-top': bannerHeight }, 1000);
	};

	addSpaceInstantly( bannerHeight ) {
		$( '#mw-panel' ).css( { top: bannerHeight } );
		$( '#mw-head' ).css( { top: bannerHeight } );
		$( '#mw-page-base' ).css( { paddingTop: bannerHeight } );
	};

	removeSpace() {
		$( '#mw-panel' ).css( 'top', 0 );
		$( '#mw-head' ).css( 'top', 0 );
		$( '#mw-page-base' ).css( 'padding-top', 0 );
	};
};
