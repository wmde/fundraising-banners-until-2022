import assert from 'assert';
import webdriverio from 'wdio';

describe( 'banner form test', () => {

	var browser = webdriverio.getBrowser( {
		desiredCapabilities: {
			browserName: 'firefox'
		}
	} );

	it( 'should show error messages when required input is missing', webdriverio.wrap( () => {
		browser.url( 'https://wikipedia.de/?banner=B19WPDE_02-191129_ctrl' );

		assert.equal(
			$( '.select-group__errormessage' ).getCSSProperty( 'display' ),
			'none'
		);
		// assert.false( $('.select-group__errormessage').isDisplayed() );

		// clicke auf submit button
		const submitButton = $( '.submit-section button' );
		submitButton.click();
		webdriverio.pause( 1000 );
		// errormeldungen sollten erscheinen

		assert.equal(
			$( '.select-group__errormessage' ).getCSSProperty( 'display' ),
			'block'
		);
		// assert.true( $('.select-group__errormessage').isDisplayed() );
	} )
	);

	it( 'should lead to donation page on valid form submit', webdriverio.wrap( () => {
		browser.url( 'https://wikipedia.de/?banner=B19WPDE_02-191129_ctrl' );

		// mache valide notwendige Eingaben
		const selectedInterval = $( 'input[name="periode"]' ).selectByAttribute( 'value', '1' );
		selectedInterval.click();

		const selectedAmount = $( 'input[name="betrag_auswahl"]' ).selectByAttribute( 'value', '5' );
		selectedAmount.click();

		const selectedPaymentType = $( 'input[name="zahlweise"]' ).selectByAttribute( 'value', 'MCP' );
		selectedPaymentType.click();

		// clicke auf submit button
		const submitButton = $( '.submit-section button' );
		submitButton.click();
		webdriverio.pause( 1000 );

		// es sollte auf spendenseite weitergeleitet worden sein
		assert.true(
			browser.getUrl().indexOf( 'spenden.wikimedia.de' ) !== -1
		);
	} )
	);

	it( 'should close the banner and hide it', webdriverio.wrap( () => {
		browser.url( 'https://wikipedia.de/?banner=B19WPDE_02-191129_ctrl' );
		webdriverio.pause( 10000 );

		assert.equal(
			$( '.wmde-banner' ).getCSSProperty( 'visibility' ),
			'visible'
		);
		// assert.true( browser.isVisible( $('.wmde-banner') );

		// clicke auf close button
		const closeButton = $( '.close-link' );
		closeButton.click();
		webdriverio.pause( 1000 );
		// errormeldungen sollten erscheinen

		assert.equal(
			$( '.wmde-banner' ).getCSSProperty( 'visibility' ),
			'hidden'
		);
		// assert.false( browser.isVisible( $('.wmde-banner') );

		// TODO: fix cookie name ( beim Rumprobieren war er undefined)
		const closeCookie = browser.getCookies( [ 'notshowfor7days TODO' ] );
		// assert.true ( closeCookie is in the keys of the cookie array );

		// outputs:
		// [
		//    { name: 'test', value: '123' },
		// ]

	} )
	);

} );
