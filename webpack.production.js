const Merge = require( 'webpack-merge' );
const CommonConfig = require( './webpack.common.js' );
const webpack = require( 'webpack' );

module.exports = Merge( CommonConfig, {
	plugins: [
		new webpack.LoaderOptionsPlugin( {
			minimize: true,
			debug: false
		} ),
		new webpack.DefinePlugin( {
			'process.env': {
				NODE_ENV: JSON.stringify( 'production' )
			}
		} ),
		new webpack.optimize.UglifyJsPlugin( {
			beautify: false,
			mangle: {
				screw_ie8: true,
				keep_fnames: true,
				except: [ '$', 'exports', 'require' ]
			},
			comments: false
		} )
	]
} );
