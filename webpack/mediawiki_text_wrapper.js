/**
 * Wrap javascript assets in MediaWiki wikitext and script tags for inlining them in wiki pages
 */

const Minimatch = require( 'minimatch' ).Minimatch;
const Handlebars = require( 'handlebars' );

function MediaWikiTextWrapper( options ) {
	this.templates = {};
	this.filePattern = options.filePattern || '*.js';
	this.context = options.context || {};
	this.campaignConfig = options.campaignConfig || {};

	Object.keys( options.templates ).forEach( function ( pageName ) {
		this.templates[ pageName ] = Handlebars.compile( options.templates[ pageName ] );
	}.bind( this ) );
}

MediaWikiTextWrapper.prototype.apply = function ( compiler ) {
	const self = this;
	compiler.plugin( 'emit', function ( compilation, callback ) {
		const mm = new Minimatch( self.filePattern, { matchBase: true } );
		const wrappedFiles = {};

		for ( let filename in compilation.assets ) {
			if ( !mm.match( filename ) ) {
				continue;
			}

			let pagename = filename.replace( /\.js$/, '' );
			let template = self.templates[ pagename ];
			wrappedFiles[ filename + '.wikitext' ] = template( Object.assign( {
				banner: compilation.assets[ filename ].source(),
				campaignConfig: self.campaignConfig[ pagename ] || {}
			}, self.context ) );
		}

		for ( let filename in wrappedFiles ) {
			compilation.assets[ filename ] = {
				source: function () {
					return wrappedFiles[ filename ];
				},
				size: function () {
					return wrappedFiles[ filename ].length;
				}
			};
		}

		callback();
	} );
};

module.exports = MediaWikiTextWrapper;
