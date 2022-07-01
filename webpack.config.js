const fs = require( 'fs' );
const path = require( 'path' );
const toml = require( 'toml' );
const { merge } = require( 'webpack-merge' );
const CommonConfig = require( './webpack.common.js' );
const webpack = require( 'webpack' );

module.exports = merge( CommonConfig, {
	devtool: 'source-map',
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
	devServer: {
		port: 8084,
		allowedHosts: 'all',
		static: {
			directory: path.resolve( __dirname, 'dist' )
		},
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		proxy: [
			{
				context: [ '/mobile' ],
				pathRewrite: { '^/mobile': '' },
				target: 'https://de.m.wikipedia.org',
				changeOrigin: true
			},
			{
				context: [ '/en-mobile' ],
				pathRewrite: { '^/en-mobile': '' },
				target: 'https://en.m.wikipedia.org',
				changeOrigin: true
			},
			{
				context: [ '/wiki/Main_Page' ],
				target: 'https://en.wikipedia.org',
				changeOrigin: true
			},
			{
				context: [ '/wikipedia.de', '/FundraisingBanners', '/img', '/js', '/style.css', '/suggest.js' ],
				pathRewrite: { '^/wikipedia.de': '' },
				target: 'https://www.wikipedia.de',
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
