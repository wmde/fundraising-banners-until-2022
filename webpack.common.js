const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
  entry: {
    loader: './desktop/loader.js',
    ctrl: './desktop/banner_ctrl.js',
    var:  './desktop/banner_var.js',
  },
  output: {
    filename: 'banner_[name].js',
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
    })
  ]
};
