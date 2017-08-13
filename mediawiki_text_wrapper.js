/**
 * Wrap javascript assets in MediaWiki wikitext and script tags for inlining them in wiki pages
 */

const Minimatch = require( 'minimatch' ).Minimatch;

function MediaWikiTextWrapper( options ) {
	this.prefixText = options.prefixText || '<nowiki><script>';
	this.suffixText = options.suffixText || '</script></nowiki>';
	this.filePattern = options.filePattern || '*.js';
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

			wrappedFiles[ filename + '.wikitext' ] = self.prefixText + compilation.assets[ filename ].source() + self.suffixText;
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