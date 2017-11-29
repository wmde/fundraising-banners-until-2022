const specialDayNameMessageKeys = {
	'12/06': 'day-name-st-nicholas-day',
	'12/24': 'day-name-christmas-eve',
	'12/25': 'day-name-christmas-day',
	'12/26': 'day-name-2nd-christmas-day'
};

const dayNameMessageKeys = {
	0: 'day-name-sunday',
	1: 'day-name-monday',
	2: 'day-name-tuesday',
	3: 'day-name-wednesday',
	4: 'day-name-thursday',
	5: 'day-name-friday',
	6: 'day-name-saturday'
};

function ensureTwoDigitValue( value ) {
	return ( '0' + value ).slice( -2 );
}

function getSpecialDayMessageKey( date ) {
	return (
		ensureTwoDigitValue( date.getMonth() + 1 ) +
		'/' +
		ensureTwoDigitValue( date.getDate() )
	);
}

export default class DayName {

	constructor( date ) {
		this.date = date;
	}

	getDayNameMessageKey() {
		if ( this.isSpecialDayName( this.date ) ) {
			return specialDayNameMessageKeys[ getSpecialDayMessageKey( this.date ) ];
		}
		return dayNameMessageKeys[ this.date.getDay() ];
	}

	isSpecialDayName() {
		return ( getSpecialDayMessageKey( this.date ) in specialDayNameMessageKeys );
	}

}
