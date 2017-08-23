/*jshint unused: false */

var customDayNames = {
	'06.12': {
		de: 'Nikolaustag',
		en: 'St Nicholas Day'
	},
	'24.12': {
		de: 'Weihnachtsfeiertag',
		en: 'Christmas Day'
	},
	'25.12': {
		de: '1. Weihnachtsfeiertag',
		en: 'Christmas Day'
	},
	'26.12': {
		de: '2. Weihnachtsfeiertag',
		en: 'Christmas Day'
	}
};

function getDateString( date ) {
	var dateString = '',
		day = date.getDate(),
		month = date.getMonth() + 1;
	if ( day < 10 ) {
		dateString += '0';
	}
	dateString += day;
	dateString += '.';
	if ( month < 10 ) {
		dateString += month;
	}
	dateString += month;
	return dateString;
}

function getCustomDayName( fallbackFunction, lang ) {
	var	currentDateString = getDateString( new Date() ),
		language = lang || 'de';
	if ( currentDateString in customDayNames ) {
		return customDayNames[ currentDateString ][ language ];
	}
	return fallbackFunction();
}

module.exports = getCustomDayName;
