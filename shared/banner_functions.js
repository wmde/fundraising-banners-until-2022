/*jshint latedef: nofunc */
/*jshint unused: false */
/* globals mw, alert */

var $ = require( 'jquery' );

module.exports = function ( GlobalBannerSettings, Translations ) {

	var finalDateTime = new Date( 2017, 11, 31, 23, 59, 59 ),
		baseDate = GlobalBannerSettings[ 'donations-date-base' ] || '2017-11-01',
		collectedBase = parseInt( GlobalBannerSettings.collectedBase || 0, 10 ),
		donorsBase = parseInt( GlobalBannerSettings.donorsBase, 10 ),
		donationsPerMinApproximation = parseFloat( GlobalBannerSettings[ 'appr-donations-per-minute' ] || 0.1 ),
		donorsPerMinApproximation = parseFloat( GlobalBannerSettings[ 'appr-donators-per-minute' ] ),
		noIntervalSelectedMessage = Translations[ 'no-interval-message' ] || 'Bitte wählen Sie zuerst ein Zahlungsintervall.',
		amountEmptyMessage = Translations[ 'amount-empty-message' ] || 'Bitte wählen Sie zuerst einen Betrag.',
		amountTooLowMessage = Translations[ 'amount-too-low-message' ] || 'Bitte geben Sie einen Spendenbetrag von min. 1€ ein.',
		amountTooHighMessage = Translations[ 'amount-too-high-message' ] || 'Der Spendenbetrag ist zu hoch.',
		allBannersImpCookie = 'centralnotice_banner_impression_count',
		singleBannerImpCookie = 'centralnotice_single_banner_impression_count',
		showBanner = true,
		BannerEventHandlers = BannerEventHandlers || {},
		messages = {
			en: {
				day: 'day',
				days: 'days'
			},
			de: {
				day: 'Tag',
				days: 'Tage'
			}
		};

	let skin;

	BannerEventHandlers.handleAmountSelected = function () {
		$( '#amount_other' ).prop( 'checked', false );
		$( '#amount-other-input' ).val( '' );
		// function call for backwards compatibility, once all banners support validation events, trigger validation:amount:ok instead
		hideAmountError();
	};

	BannerEventHandlers.handleCustomAmount = function() {
		$( 'input:radio[name=betrag_auswahl]' ).prop( 'checked', false );
		$( '#amount_other' ).prop( 'checked', true );
		hideAmountError();
	};

	function bannerHasValidationEventHandling() {
		return typeof $( '#WMDE_Banner' ).data( 'validation-event-handling' ) !== 'undefined';
	}

	function initializeBannerEvents() {
		var banner = $( '#WMDE_Banner' );

		banner.on( 'amount:select', null, BannerEventHandlers.handleAmountSelected );
		banner.on( 'amount:custom', null, BannerEventHandlers.handleCustomAmount );

		if ( bannerHasValidationEventHandling() ) {
			banner.trigger( 'validation:init', banner.data( 'validation-event-handling' ) );
		}
	}

	function getDaysLeft() {
		var daysLeft = Math.floor( new Date( finalDateTime - new Date() ) / 1000 / 60 / 60 / 24 );
		return ( daysLeft < 0 ) ? 0 : daysLeft;
	}

	function getDaysRemaining( language ) {
		var daysRemaining = getDaysLeft(),
			lang = language || 'de';
		return daysRemaining + ' ' + ( daysRemaining > 1 ? messages[ lang ].days : messages[ lang ].day );
	}

	function getCurrentGermanDay() {
		switch ( new Date().getDay() ) {
			case 0:
				return 'Sonntag';
			case 1:
				return 'Montag';
			case 2:
				return 'Dienstag';
			case 3:
				return 'Mittwoch';
			case 4:
				return 'Donnerstag';
			case 5:
				return 'Freitag';
			case 6:
				return 'Samstag';
			default:
				return '';
		}
	}

	function getCurrentDayInEnglish() {
		switch ( new Date().getDay() ) {
			case 0:
				return 'Sunday';
			case 1:
				return 'Monday';
			case 2:
				return 'Tuesday';
			case 3:
				return 'Wednesday';
			case 4:
				return 'Thursday';
			case 5:
				return 'Friday';
			case 6:
				return 'Saturday';
			default:
				return '';
		}
	}

	function getDigitGroupingCharacter() {
		switch ( mw.config.get( 'wgContentLanguage' ) ) {
			case 'de':
				return '.';
			case 'en':
				return ',';
			default:
				return '.';
		}
	}

	function getImpCount() {
		return parseInt( $.cookie( allBannersImpCookie ), 10 ) || 0;
	}

	function getBannerImpCount( bannerId ) {
		var cookieValue, cookieData;

		if ( $.cookie( singleBannerImpCookie ) ) {
			cookieValue = $.cookie( singleBannerImpCookie );
			cookieData = cookieValue.split( '|' );
			if ( cookieData[ 0 ] === bannerId ) {
				return parseInt( cookieData[ 1 ], 10 );
			}
		}
		return 0;
	}

	function increaseImpCount() {
		var impCount = getImpCount();
		$.cookie( allBannersImpCookie, impCount + 1, { expires: getCookieExpiryDate(), path: '/' } );
		return impCount + 1;
	}

	function increaseBannerImpCount( bannerId ) {
		var impCount = getBannerImpCount( bannerId );

		$.cookie( singleBannerImpCookie, bannerId + '|' + ( impCount + 1 ), {
			expires: getCookieExpiryDate(),
			path: '/'
		} );
		return ( impCount + 1 );
	}

	function getCookieExpiryDate() {
		return new Date( ( new Date() ).getFullYear() + 1, 0, 1 );
	}

	function validateForm() {
		if ( !validateAndSetPeriod() ) {
			return false;
		}
		if ( !validateAmount( getAmount() ) ) {
			return false;
		}
	}

	function showAmountError( text ) {
		$( '#WMDE_Banner' ).trigger( 'validation:amount:error', text );
	}

	function hideAmountError() {
		$( '#WMDE_Banner' ).trigger( 'validation:amount:ok' );
	}

	function showFrequencyError( text ) {
		$( '#WMDE_Banner' ).trigger( 'validation:period:error', text );
	}

	function hideFrequencyError() {
		$( '#WMDE_Banner' ).trigger( 'validation:period:ok' );
	}

	function validateAmount( amount ) {
		// Check amount is at least the minimum
		if ( amount === false ) {
			showAmountError( amountEmptyMessage );
			return false;
		} else if ( amount < 1 ) {
			showAmountError( amountTooLowMessage );
			return false;
		} else if ( amount > 99999 ) {
			showAmountError( amountTooHighMessage );
			return false;
		}
		hideAmountError();
		return true;
	}

	/**
	 * Check the "interval" radio buttons and change the "period" and "intervalType" fields accordingly.
	 * If "periodically" is selected but no interval is selected, this function
	 * will display an error message via alert.
	 */
	function validateAndSetPeriod() {
		var form = document.donationForm;
		if ( $( '#interval_multiple' ).is( ':checked' ) ) {
			if ( $( 'input[name=interval]:checked', form ).length !== 1 ) {
				showFrequencyError( noIntervalSelectedMessage );
				return false;
			} else {
				$( '#intervalType' ).val( '1' );
				$( '#periode' ).val( $( 'input[name=interval]:checked', form ).val() );
			}
		} else if ( $( '#interval_onetime' ).is( ':checked' ) )  {
			$( '#periode' ).val( '0' );
			$( '#intervalType' ).val( '0' );
		} else {
			// check if we have interval tabs (non-fulltop-banner)
			if ( $( '.interval_tab' ).length > 0 ) {
				$( '#periode' ).val( '0' );
				$( '#intervalType' ).val( '0' );
					}
			else {
				showFrequencyError( noIntervalSelectedMessage );
				return false;
			}
		}
		hideFrequencyError();
		return true;
	}

	function getAmount() {
		var amount = null,
			otherAmount = $( '#amount-other-input' ).val(),
			form = document.donationForm;

		amount = $( 'input[name=betrag_auswahl]:checked' ).val();

		if ( otherAmount !== '' ) {
			otherAmount = otherAmount.replace( /[,.](\d)$/, '\:$10' );
			otherAmount = otherAmount.replace( /[,.](\d)(\d)$/, '\:$1$2' );
			otherAmount = otherAmount.replace( /[\$,.]/g, '' );
			otherAmount = otherAmount.replace( /:/, '.' );
			$( '#amount-other-input' ).val( otherAmount );
			amount = otherAmount;
		}

		if ( amount === null || isNaN( amount ) ) {
			return false;
		}

		return amount;
	}

	function removeBannerSpace() {
		getSkin().removeSpace();
	}

	/**
	 * Calculate the number of donors needed, given an average donation amount.
	 *
	 * This function cannot return less than 0 donors when the target has been reached.
	 *
	 * @param  {number} averageDonation Average donation amount in EUR
	 * @return {number} Number of donors needed (rounded up)
	 */
	function getRemainingDonorsNeeded( averageDonation ) {
		var dRemaining, dCollected, numDonors;
		dCollected = getApprDonationsRaw();
		dRemaining = GlobalBannerSettings.goalSum - dCollected;
		numDonors = Math.ceil( dRemaining / averageDonation );
		return Math.max( 0, numDonors );
	}

	/**
	 * @return {Skin}
	 */
	function getSkin() {
		var skinName,
			skinClass;

		if ( !skin ) {
			if ( onMediaWiki() ) {
				skinName = window.mw.config.get( 'skin' );
				if ( [ 'minerva', 'monobook', 'vector' ].indexOf( skinName ) === -1 ) {
					skinName = 'vector';	// when in doubt, fall back to vector
				}
			} else {
				skinName = 'wpde';
			}

			skinClass = require( './skin/' + skinName );
			skin = new skinClass;
		}

		return skin;
	}

	function onMediaWiki() {
		return typeof window.mw === 'object' && typeof window.mw.centralNotice !== 'undefined';
	}

	return {
		onMediaWiki: onMediaWiki,
		getSkin: getSkin,
		validateForm: validateForm,
		validateAndSetPeriod: validateAndSetPeriod,
		validateAmount: validateAmount,
		getAmount: getAmount,
		increaseImpCount: increaseImpCount,
		increaseBannerImpCount: increaseBannerImpCount,
		getDaysRemaining: getDaysRemaining,
		getCurrentGermanDay: getCurrentGermanDay,
		initializeBannerEvents: initializeBannerEvents,
		showFrequencyError: showFrequencyError,
		showAmountError: showAmountError,
		hideAmountError: hideAmountError,
		hideFrequencyError: hideFrequencyError,
		removeBannerSpace: removeBannerSpace,
		getDigitGroupingCharacter: getDigitGroupingCharacter
	}

};
