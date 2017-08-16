const assert = require('assert');
const CampaignConfig = require( '../webpack/campaign_config' );

describe('CampaignConfig', function() {
	describe('#getEntryPoints()', function() {
		it( 'should return pagename - filename pairs for one banner in one campaign', function () {
			const config = new CampaignConfig( {
				desktop: {
					banners: {
						ctrl: {
							filename: './foo/bar.js',
							pagename: 'B17WMDE_test'
						}
					}
				}
			} );
			assert.deepEqual( config.getEntryPoints(), { B17WMDE_test: './foo/bar.js' } );
		} );

		it( 'should return pagename - filename pairs for multiple banners in one campaign', function () {
			const config = new CampaignConfig( {
				desktop: {
					banners: {
						ctrl: {
							filename: './foo/bar.js',
							pagename: 'B17WMDE_test_ctrl'
						},
						ctrl_fulltop: {
							filename: './foo/fulltop.js',
							pagename: 'B17WMDE_test_ctrl_fulltop'
						},
						var: {
							filename: './foo/var.js',
							pagename: 'B17WMDE_test_var'
						}
					}
				}
			} );
			assert.deepEqual( config.getEntryPoints(), {
				B17WMDE_test_ctrl: './foo/bar.js',
				B17WMDE_test_ctrl_fulltop: './foo/fulltop.js',
				B17WMDE_test_var: './foo/var.js',
			} );
		} );

		it( 'should return pagename - filename pairs for multiple banners in multiple campaigns', function () {
			const config = new CampaignConfig( {
				desktop: {
					banners: {
						ctrl: {
							filename: './foo/bar.js',
							pagename: 'B17WMDE_test_ctrl'
						},
						var: {
							filename: './foo/var.js',
							pagename: 'B17WMDE_test_var'
						}
					}
				},
				mobile: {
					banners: {
						ctrl: {
							filename: './mobile/foo.js',
							pagename: 'B17WMDE_test_mob_ctrl'
						},
					}
				}
			} );
			assert.deepEqual( config.getEntryPoints(), {
				B17WMDE_test_ctrl: './foo/bar.js',
				B17WMDE_test_var: './foo/var.js',
				B17WMDE_test_mob_ctrl: './mobile/foo.js'
			} );
		} );

		it( 'should throw exceptions on duplicate page names', function () {
			const config = new CampaignConfig( {
				desktop: {
					banners: {
						ctrl: {
							filename: './foo/bar.js',
							pagename: 'B17WMDE_test_ctrl'
						},
						var: {
							filename: './foo/var.js',
							pagename: 'B17WMDE_test_ctrl'
						}
					}
				}
			} );
			assert.throws( function () {
				config.getEntryPoints();
			}, /duplicate.*desktop\.(var|ctrl)/i )
		} );
	});
});