const path = require( 'path' );
const fs = require( 'fs' );
const toml = require( 'toml' );
const webpack = require( 'webpack' );
const MediaWikiTextWrapper = require( './webpack/mediawiki_text_wrapper' );
const CampaignConfig = require( './webpack/campaign_config' );

const campaigns = new CampaignConfig( toml.parse( fs.readFileSync( 'campaign_info.toml', 'utf8' ) ) );

function readWrapperTemplate( name ) {
	return fs.readFileSync( './webpack/wikitext_templates/' + name + '.hbs', 'utf8' );
}

module.exports = {
	entry: campaigns.getEntryPoints(),
	output: {
		filename: '[name].js',
		path: path.resolve( __dirname, 'dist' )
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
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
	externals: {
		jquery: 'jQuery'
	},
	plugins: [
		new webpack.ProvidePlugin( {
			jQuery: 'jquery'
		} ),
		new MediaWikiTextWrapper( {
			templates: campaigns.getWrapperTemplates( readWrapperTemplate ),
			context: {
				bannerValues: '{{MediaWiki:WMDE_FR2017/Resources/BannerValues.js}}'
			},
			filePattern: 'B*.js',
			campaignConfig: campaigns.getConfigForPages()
		} )
	]
};
