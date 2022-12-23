export function getDaysLeft( daysLeft, translations ) {
	return translations[ 'prefix-days-left' ] +
		' ' + daysLeft + ' ' +
		( daysLeft === 1 ? translations[ 'day-singular' ] : translations[ 'day-plural' ] ) + ' ' +
		translations[ 'suffix-days-left' ];
}
