"use strict";

const Skin = require("./Skin");

module.exports = class Wpde extends Skin {
	addSpace( bannerHeight ) {
		$( 'body center' ).animate( { 'margin-top': bannerHeight }, 1000 );
	};

	addSpaceInstantly( bannerHeight ) {
		$( 'body center' ).css( 'margin-top', bannerHeight );
	};

	removeSpace() {
		$( 'body center' ).css( 'margin-top', 0 );
	};
};
