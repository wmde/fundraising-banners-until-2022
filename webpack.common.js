const path = require( 'path' );
const fs = require( 'fs' );
const toml = require( 'toml' );
const webpack = require( 'webpack' );
const MediaWikiTextWrapper = require( './webpack/mediawiki_text_wrapper' );
const CampaignConfig = require( './webpack/campaign_config' );
const WrapperPlugin = require( 'wrapper-webpack-plugin' );

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
	resolve: {
		alias: {
			svelte: path.resolve( 'node_modules', 'svelte' )
		},
		extensions: [ '.mjs', '.js', '.svelte' ],
		mainFields: [ 'svelte', 'browser', 'module', 'main' ]
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
		} )
	]
};
