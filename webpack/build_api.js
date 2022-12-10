const webpack = require( 'webpack' );
const newProductionConfiguration = require( '../webpack.production' );

function webpackBuildApiRoute( request, response ) {
	const bannerName = request.params.bannerName;
	if ( !bannerName ) {
		response.send( 'No banner name given, this should never happen!' );
		return;
	}

	response.setHeader( 'Content-Type', 'application/json' );

	let config;
	try {
		config = newProductionConfiguration( { banner: bannerName } );
	} catch ( e ) {
		response.send( JSON.stringify( { err: e.message, stats: null } ) );
		return;
	}

	console.log( `Compiling ${bannerName}` );
	webpack( config, ( err, stats ) => {
		if ( err || stats.hasErrors() ) {
			response.send( JSON.stringify( { err, stats: null } ) );
			return;
		}

		const compilationTime = stats.compilation.endTime - stats.compilation.startTime;
		console.log( `Compiled ${bannerName} in ${compilationTime} milliseconds` );
		response.send( JSON.stringify( {
			err: null,
			stats: {
				// Maybe add more stats, see https://webpack.js.org/api/stats/
				compileTime: compilationTime
			}
		} ) );
	} );
}

module.exports = webpackBuildApiRoute;
