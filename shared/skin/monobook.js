"use strict";

const Skin = require("./Skin");

module.exports = class Monobook extends Skin {
	addSpace( bannerHeight ) {
		// @todo Total lack of this is apparently a 0-day bug, cp.
		// https://meta.wikimedia.org/?banner=B17WMDE_03_170804_var&uselang=en&force=1&useskin=monobook
	};

	addSpaceInstantly( bannerHeight ) {
		// @todo Total lack of this is apparently a bug
	};

	removeSpace() {
		$( '#globalWrapper' ).css( 'position', 'relative' );
		$( '#globalWrapper' ).css( 'top', 0 );
	};
};
