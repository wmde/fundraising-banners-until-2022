require( './css/styles.pcss' );

const bannerTemplate = require( './templates/banner.hbs' );
const SUBMIT_URL = 'https://spenden.wikimedia.de/contact/subscribe';

function showSuccess() {
	$( '.call-to-action' ).hide();
	$( '.call-to-action-confirmation' ).show();
}

function showFailure( errorMessage ) {
	$( '.call-to-action-error' ).text( errorMessage );
}

function isEmail( email ) {
	return email.indexOf( '@' ) > 0;
}

function createErrorMessageFromServerErrors( errors ) {
	if ( !errors ) {
		return 'Beim Eintragen der Adresse ist ein Fehler aufgetreten.';
	}

	if ( errors.subscription_duplicate_subscription ) {
		return 'Die angegebene E-Mail-Adresse wurde bereits eingetragen.';
	}

	return Object.keys( errors ).reduce( ( errmsg, key ) => {
		return errmsg + errors[ key ] + '<br />';
	}, '' );
}

function processServerMessage( message ) {
	if ( message.status === 'OK' ) {
		showSuccess();
		return;
	}
	showFailure( createErrorMessageFromServerErrors( message.errors ) );
}

function submitEmail( event ) {
	const email = $.trim( $( '#call-to-action-input' ).val() );
	if ( isEmail( email ) === false ) {
		showFailure( 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' );
		event.preventDefault();
		return;
	}

	$( '#call-to-action-email' ).text( email );

	$.ajax( {
		url: SUBMIT_URL,
		data: { email: email },
		dataType: 'jsonp',
		success: processServerMessage
	} );
}

$( document ).ready( function () {
	$( '.feature' ).html( bannerTemplate() );

	$( 'textarea' ).keyup( function ( e ) {
		if ( e.keyCode === 13 ) {
			submitEmail();
		}
	} );

	$( '#call-to-action-button' ).click( submitEmail );
} );
