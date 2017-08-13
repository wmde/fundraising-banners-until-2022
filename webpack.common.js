const path = require( 'path' );
const webpack = require( 'webpack' );
const MediaWikiTextWrapper = require( './mediawiki_text_wrapper' );

module.exports = {
  entry: {
    loader: './desktop/loader.js',
    banner_ctrl: './desktop/banner_ctrl.js',
    banner_var:  './desktop/banner_var.js',
  },
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
    new webpack.ProvidePlugin({
      jQuery: 'jquery'
    }),
      new MediaWikiTextWrapper( {
          prefixText: "<!-- WMDE compiled banner, see https://github.com/wmde/fundraising-banners -->\n<nowiki>\n" +
            "<div id=\"WMDE-Banner-Container\"></div>" +
		    "<script>{{MediaWiki:WMDE_FR2017/Resources/BannerValues.js}}</script><script>\n",
          suffixTex: "\n</script></nowiki>\n",
          filePattern: 'banner_*.js'
      } )
  ]
};
