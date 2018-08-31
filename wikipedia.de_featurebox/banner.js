require( './css/styles.pcss' );

const bannerTemplate = require( './templates/banner.hbs' );
const $bannerContainer = $( '.feature' );

$bannerContainer.html( bannerTemplate() );

$( document ).ready( function () {
	const errorElement = $( '.call-to-action-error' );
	registerEvents();

	function registerEvents() {
		let button = $( '#call-to-action-button' );

		$( 'textarea' ).keyup( function ( e ) {
			if ( e.keyCode === 13 ) {
				button.trigger( 'click' );
			}
		} );
		button.on( 'click', function () {
			const email = $.trim( $( '#call-to-action-input' ).val() );
			if ( isEmail( email ) === false ) {
				errorElement.text( 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' );
				return;
			}
			$( '#call-to-action-email' ).text( email );
			$.ajax( {
				url: 'https://spenden.wikimedia.de/contact/subscribe',
				data: { email: email },
				dataType: 'jsonp',
				jsonpCallback: 'subscriptionCallback'
			} );
		} );
	}

	window.subscriptionCallback = function ( message ) {
		if ( message.status === 'OK' ) {
			$( '.call-to-action' ).hide();
			$( '.call-to-action-confirmation' ).show();
			return;
		}

		if ( message.errors.subscription_duplicate_subscription ) {
			errorElement.text( 'Die angegebene E-Mail-Adresse wurde bereits eingetragen.' );
			return;
		}

		errorElement.text( '' );
		if ( message.errors ) {
			$.each( message.errors, function ( key, value ) {
				errorElement.append( value + '</br>' );
			} );
			return;
		}

		errorElement.text( 'Beim Eintragen der Adresse ist ein Fehler aufgetreten.' );
	};

	function isEmail( email ) {
		return /^(([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+)?$/.test( email );
	}
} );
