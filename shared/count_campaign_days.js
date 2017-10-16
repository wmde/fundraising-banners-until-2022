module.exports = function ( startDate, endDate ) {
	function getCampaignDayString() {
		var daysSinceStart = getDaysSinceCampaignStart() + 1;
		return daysSinceStart + '.';
	}

	function dateObjectFromString( dateStr ) {
		var dateParts = dateStr.split( '-' );
		return new Date( dateParts[ 0 ], dateParts[ 1 ] - 1, dateParts[ 2 ] );
	}

	function getDaysSinceCampaignStart() {
		var startDay = dateObjectFromString( startDate );
		return Math.floor( new Date( new Date() - startDay ) / 1000 / 60 / 60 / 24 );
	}

	function getDaysUntilCampaignEnds() {
		var endDay = dateObjectFromString( endDate ),
			dayDelta = endDay - new Date();
		if ( dayDelta > 0 ) {
			return Math.floor( dayDelta / 1000 / 60 / 60 / 24 );
		} else {
			return 0;
		}
	}

	function getCampaignDaySentence() {
		if ( getDaysUntilCampaignEnds() == 0 ) {
			return 'Heute ist der letzte Tag unserer Spendenkampagne.';
		} else if ( getDaysUntilCampaignEnds() < 7 ) {
			return 'Dies ist die letzte Woche unserer Spendenkampagne.';
		} else if ( getDaysSinceCampaignStart() > 0 ) {
			return 'Heute ist der ' + getCampaignDayString() + ' Tag unserer Spendenkampagne.';
		}
		if ( getDaysSinceCampaignStart() < 0 ) {
			return 'Heute bitten wir Sie um Ihre Unterstützung.';
		}
		return 'Heute beginnt unsere Spendenkampagne.';
	}

	function getEnglishCampaignDaySentence() {
		if ( getDaysUntilCampaignEnds() == 0 ) {
			return 'Today is the final day of our donation campaign.';
		} else if ( getDaysUntilCampaignEnds() < 7 ) {
			return 'This is the last week of our donation campaign.';
		}
		return '';
	}

	return function ( language ) {
		return language === 'de' ? getCampaignDaySentence() : getEnglishCampaignDaySentence();
	};

};
