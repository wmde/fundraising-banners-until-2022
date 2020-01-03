import formatNumber from 'format-number';

export const donorFormatter = formatNumber( { round: 0, integerSeparator: '.' } );
export const millionFormatter = formatNumber( {
	decimal: ',',
	round: 1
} );
