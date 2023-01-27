/**
 * This webpack plugin wraps the banner source code in a "Vue loader" that delays the execution fo the banner code
 * (that doesn't contain the Vue runtime) until a global Vue object has been loaded
 */

const { ConcatSource } = require( 'webpack-sources' );
const { Compilation } = require( 'webpack' );


const loaderPrefix = ( url ) => `
							/* Vue loader wrapper inserted by webpack load_vue_on_wpde */
		var externalVue = document.createElement('script');
		externalVue.setAttribute("src", "${url}");
		externalVue.setAttribute("type", "text/javascript");
		externalVue.addEventListener("load", function() { /* compiled banner starts here */`;
const loaderSuffix = () => `/* compiled banner ends here*/ });
		document.getElementsByTagName("head")[0].appendChild(externalVue);
		/* End inserted code */`;

class LoadVueOnWpdePlugin {
	/**
	 * @param {BannerPluginArgument} options options object
	 */
	constructor(options) {
		if ( !options.vueURL ) {
			throw new Error( 'You must pass a URL into the load_vue_on_wpde loader' );
		}

		this.options = options;

	}

	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		const options = this.options;

		compiler.hooks.compilation.tap("LoadVueOnWpdePlugin", compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: "LoadVueOnWpdePlugin",
					stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
				},
				() => {
					for (const chunk of compilation.chunks) {
						// Only look at entry points
						if (!chunk.canBeInitial()) {
							continue;
						}

						for (const file of chunk.files) {
							if (! /B.*WPDE_.*\.js/.test(file)) {
								continue;
							}

							compilation.updateAsset( file, old => {
								return new ConcatSource( loaderPrefix(options.vueURL), old, loaderSuffix())
							} );
						}
					}
				}
			);
		} );
	}
}

module.exports = LoadVueOnWpdePlugin;
