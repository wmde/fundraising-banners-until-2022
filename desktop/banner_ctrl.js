import Banner from "./Banner.vue";

mw.loader.using( [ 'vue' ] ).then(
	async ( require ) => {
		const Vue = require( 'vue' );
		new Vue( {
			el: '#centralNotice',
			render: h => h( Banner ),
			components: { Banner }
		} );
	} );
