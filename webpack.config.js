const Merge = require( 'webpack-merge' );
const CommonConfig = require( './webpack.common.js' );
const webpack = require( 'webpack' );

module.exports = Merge( CommonConfig, {
  plugins: [
      new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
      hot: true,
      contentBase: './dist',
      proxy: [{
          context: [ '/wiki', '/w', '/static' ],
          target: 'https://de.wikipedia.org',
          secure: false,
          headers: { host:'de.wikipedia.org' }
      }]
  }
} );
