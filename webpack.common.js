const path = require( 'path' );
const fs = require( 'fs' );
const toml = require( 'toml' );
const webpack = require( 'webpack' );
// const WrapperPlugin = require( 'wrapper-webpack-plugin' );

const CampaignConfig = require( './webpack/campaign_config' );
const campaigns = new CampaignConfig( toml.parse( fs.readFileSync( 'campaign_info.toml', 'utf8' ) ) );

module.exports = {
	entry: campaigns.getEntryPoints(),
	output: {
		publicPath: '',
		filename: '[name].js',
		path: path.resolve( __dirname, 'dist' )
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.html$/,
				use: 'html-loader'
			},
			{
				test: /\.css$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader', options: { importLoaders: 1 } }
				]
			},
			{
				test: /\.pcss$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					{ loader: 'postcss-loader' }
				]
			},
			{
				test: /\.handlebars$|\.hbs$/,
				use: [
					{ loader: 'handlebars-loader' }
				]
			}
		]
	},
	resolve: {
		extensions: [ '.mjs', '.js', '.jsx' ],
		alias: {
			'react': 'preact/compat',
			'react-dom': 'preact/compat'
		}
	},
	externals: {
		jquery: 'jQuery'
	},
	plugins: [
		new webpack.ProvidePlugin( {
			jQuery: 'jquery'
		} )
		// TODO: the wrapper plugin is not compatible with webpack 5, see https://github.com/levp/wrapper-webpack-plugin/issues/15
		//       Options:
		//         * Write our own plugin that injects the code
		//         * Use fork of wrapper plugin
		//         * use different mechanism to determine tracking data in compiled banner on WPDE
		/*
		new WrapperPlugin( {
			test: /B\d{2}WPDE.*.js$/,
			header: function ( pageName ) {
				if ( pageName.indexOf( 'hot-update' ) !== -1 ) {
					return '';
				}
				const trackingData = campaigns.getCampaignTracking( pageName.replace( '.js', '' ) );
				return `var BannerName = '${trackingData.bannerTracking}';
					var CampaignName = '${trackingData.campaignTracking}';
					var BuildDate = '${new Date().toISOString().replace( 'T', ' ' ).replace( /\.\d+Z$/, '' )}';
				`;
			}
		} )
		*/
	]
};
