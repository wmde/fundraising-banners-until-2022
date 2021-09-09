const path = require( 'path' );
const fs = require( 'fs' );
const toml = require( 'toml' );
const webpack = require( 'webpack' );
const WrapperPlugin = require( 'wrapper-webpack-plugin' );
const { VueLoaderPlugin } = require('vue-loader')

const CampaignConfig = require( './webpack/campaign_config' );
const campaigns = new CampaignConfig( toml.parse( fs.readFileSync( 'campaign_info.toml', 'utf8' ) ) );

module.exports = {
	entry: campaigns.getEntryPoints(),
	output: {
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
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
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
		new VueLoaderPlugin(),
		new webpack.ProvidePlugin( {
			jQuery: 'jquery'
		} ),
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
	]
};
