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
	compiler.hooks.emit.tapAsync( 'MediaWikiTextWrapper', function ( compilation, callback ) {
		const mm = new Minimatch( self.filePattern, { matchBase: true } );
		const wrappedFiles = {};

		for ( let filename in compilation.assets ) {
			if ( !mm.match( filename ) || filename.indexOf( 'hot-update' ) > -1 ) {
				continue;
			}

			let pagename = filename.replace( /\.js$/, '' );

			if ( !self.campaignConfig[ pagename ] ) {
				throw new Error( 'Unconfigured JavaScript output: ' + filename );
			}

			if ( self.campaignConfig[ pagename ].wrap_in_wikitext === false ) {
				continue;
			}

			let template = self.templates[ pagename ];
			wrappedFiles[ filename ] = template( Object.assign( {
				banner: compilation.assets[ filename ].source(),
				campaignConfig: self.campaignConfig[ pagename ] || {}
			}, self.context ) );
		}

		for ( let filename in wrappedFiles ) {
			compilation.assets[ filename + '.wikitext' ] = {
				source: function () {
					return wrappedFiles[ filename ];
				},
				size: function () {
					return wrappedFiles[ filename ].length;
				}
			};
			delete compilation.assets[ filename ];
		}

		callback();
	} );
};

module.exports = MediaWikiTextWrapper;
