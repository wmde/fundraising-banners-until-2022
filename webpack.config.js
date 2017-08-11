const Merge = require( 'webpack-merge' );
const CommonConfig = require( './webpack.common.js' );
const webpack = require( 'webpack' );

module.exports = Merge( CommonConfig, {
  plugins: [
      new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
      hot: true,
      contentBase: './dist'
  }
} );
