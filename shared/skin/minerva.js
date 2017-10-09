'use strict';

const Skin = require( './Skin' );
const $ = require( 'jquery' );

module.exports = class Minerva extends Skin {
	constructor() {
		super();

		this.viewport = $( '#mw-mf-viewport' );
	};

	addSpace( bannerHeight ) {
		this.viewport.animate( { 'top': bannerHeight }, 1000 );
	};

	addSpaceInstantly( bannerHeight ) {
		this.viewport.css( { top: bannerHeight } );
	};

	removeSpace() {
		this.viewport.css( { top: 0, marginTop: 0 } );
		$( '#mw-mf-page-center, #mw-mf-page-left' ).css( 'top', 0 );
	};
};
