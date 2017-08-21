/**
 * Wrap javascript assets in MediaWiki wikitext and script tags for inlining them in wiki pages
 */

const Minimatch = require( 'minimatch' ).Minimatch;
const Handlebars = require( 'handlebars' );

function MediaWikiTextWrapper( options ) {
	this.template = Handlebars.compile( options.template ) || '{{{ banner }}}';
	this.filePattern = options.filePattern || '*.js';
	this.context = options.context || {};
	this.campaignConfig = options.campaignConfig || {};
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

			wrappedFiles[ filename + '.wikitext' ] = self.template( Object.assign( {
				banner: compilation.assets[ filename ].source(),
				campaignConfig: self.campaignConfig[ filename.replace( /\.js$/, '' ) ] || {},
			}, self.context ) );
		}

		for ( let filename in wrappedFiles ) {
			compilation.assets[ filename ] = {
				source: function() {
					return wrappedFiles[ filename ];
				},
				size: function() {
					return wrappedFiles[ filename ].length;
				}
			};
		}

		callback();
	});
};

module.exports = MediaWikiTextWrapper;