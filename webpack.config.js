const fs = require( 'fs' );
const toml = require( 'toml' );
const Merge = require( 'webpack-merge' );
const CommonConfig = require( './webpack.common.js' );
const webpack = require( 'webpack' );
const path = require( 'path' );

module.exports = Merge( CommonConfig, {
	mode: 'development',
	entry: {
		loader: './webpack/loader.js'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin( {
			CAMPAIGNS: JSON.stringify( toml.parse( fs.readFileSync( 'campaign_info.toml', 'utf8' ) ) )
		} )
	],
	resolve: {
		alias: {
			svelte: path.resolve( 'node_modules', 'svelte' )
		},
		extensions: [ '.mjs', '.js', '.svelte' ],
		mainFields: [ 'svelte', 'browser', 'module', 'main' ]
	},
	module: {
		rules: [
			{
				test: /\.(html|svelte)$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						preprocess: require( 'svelte-preprocess' )( {
							postcss: {
								plugins: [
									require( 'postcss-import' ),
									require( 'autoprefixer' ),
									require( 'postcss-nested' ),
									require( 'postcss-simple-vars' ),
									require( 'postcss-custom-properties' )( {
										preserve: false
									} ),
									require( 'postcss-combine-duplicated-selectors' )
								]
							}
						} )
					}
				}
			}
		]
	},
	devServer: {
		port: 8084,
		hot: true,
		contentBase: './dist',
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		proxy: [
			{
				context: [ '/wikipedia.de', '/FundraisingBanners', '/img', '/js', '/style.css', '/suggest.js' ],
				pathRewrite: { '^/wikipedia.de': '' },
				target: 'https://wikipedia.de',
				changeOrigin: true
			},
			{
				context: [ '/wiki', '/w', '/static' ],
				target: 'https://de.wikipedia.org',
				changeOrigin: true
			}
		]
	}
} );
