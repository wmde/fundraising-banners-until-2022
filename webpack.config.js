const fs = require( 'fs/promises' );
const path = require( 'path' );
const toml = require( 'toml' );
const { merge } = require( 'webpack-merge' );
const CommonConfig = require( './webpack.common.js' );
const webpack = require( 'webpack' );
const { exec } = require( 'child_process' );
const webpackBuildApiRoute = require( './webpack/build_api' );

const getBranch = () => new Promise( ( resolve ) => {
	return exec( 'git rev-parse --abbrev-ref HEAD', ( err, stdout ) => {
		if ( err ) {
			console.log( `getBranch Error: ${err}` );
			resolve( `UNKNOWN - ${err}` );
		} else if ( typeof stdout === 'string' ) {
			resolve( stdout.trim() );
		}
	} );
} );

const readCampaignFile = () => fs.readFile( 'campaign_info.toml', 'utf8' )
	.then( contents => toml.parse( contents ) );

module.exports = () => Promise.all( [
	getBranch(),
	readCampaignFile()
] ).then( ( [ currentBranch, campaignConfig ] ) => merge(
	CommonConfig,
	{
		mode: 'development',
		entry: {
			main: './dashboard/main.js',
			inject_tracking: './webpack/inject_tracking.js'
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin( {
				CAMPAIGNS: JSON.stringify( campaignConfig ),
				GIT_BRANCH: JSON.stringify( currentBranch )
			} )
		],
		devServer: {
			'port': 9084,
			'allowedHosts': 'all',
			'static': [
				{
					directory: path.resolve( __dirname, 'dist' ),
					publicPath: '/compiled-banners/'
				},
				{
					directory: path.resolve( __dirname, 'dashboard' ),
					publicPath: '/',
					serveIndex: false
				}
			],
			'headers': {
				'Access-Control-Allow-Origin': '*'
			},
			'proxy': [
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
			],
			'setupMiddlewares': ( middlewares, devServer ) => {
				if ( !devServer ) {
					throw new Error( 'webpack-dev-server is not defined' );
				}

				devServer.app.get( '/compile-banner/:bannerName', webpackBuildApiRoute );

				return middlewares;
			}
		}
	} ) );
