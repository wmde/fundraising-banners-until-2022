const path = require( 'path' );
const fs = require( 'fs' );
const toml = require( 'toml' );
const webpack = require( 'webpack' );
//const MediaWikiTextWrapper = require( './webpack/mediawiki_text_wrapper' );
//const CampaignConfig = require( './webpack/campaign_config' );
// const WrapperPlugin = require( 'wrapper-webpack-plugin' );

// const campaigns = new CampaignConfig( toml.parse( fs.readFileSync( 'campaign_info.toml', 'utf8' ) ) );

function readWrapperTemplate( name ) {
	return fs.readFileSync( './webpack/wikitext_templates/' + name + '.hbs', 'utf8' );
}

module.exports = {
	devtool: "sourcemap",
	entry: {B18WMDE_en06_181221_ctrl: path.resolve(__dirname, 'wikipedia.de_prototype/banner_ctrl.jsx')}, // campaigns.getEntryPoints(),
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
		]
	},
	resolve: {
		extensions: [ '.mjs', '.js', '.jsx' ]
	},
	externals: {
		jquery: 'jQuery'
	},
	plugins: [
/*		new webpack.ProvidePlugin( {
			jQuery: 'jquery'
		} ),
		new MediaWikiTextWrapper( {
			templates: campaigns.getWrapperTemplates( readWrapperTemplate ),
			context: {
				bannerValuesJS: '{{MediaWiki:WMDE_FR2017/Resources/BannerValues.js}}',
				bannerValues: '{{MediaWiki:WMDE_Fundraising/Campaign_Parameters_2018}}'
			},
			filePattern: 'B*.js',
			campaignConfig: campaigns.getConfigForPages()
		} ),
		new WrapperPlugin( {
			test: /B\d{2}WPDE.*.js$/,
			header: function ( pageName ) {
				if ( pageName.indexOf( 'hot-update' ) !== -1 ) {
					return '';
				}
				const trackingData = campaigns.getCampaignTracking( pageName.replace( '.js', '' ) );
				return `var BannerName = '${trackingData.bannerTracking}'; var CampaignName = '${trackingData.campaignTracking}';`;
			}
		} )*/
	]
};
