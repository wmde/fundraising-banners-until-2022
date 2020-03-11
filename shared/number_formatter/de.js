import formatter from 'format-number';
import amountForServerFormatter from './server';

export const integerFormatter = formatter( { round: 0, integerSeparator: '.' } );
/** @deprecated */
export const amountInputFormatter = formatter( { round: 2, suffix: ' €', decimal: ',', integerSeparator: '' } );
export const customAmountInputFormatter = formatter( { round: 2, decimal: ',', integerSeparator: '' } );
export const millionFormatter = formatter( { round: 1, decimal: ',', suffix: ' Mio. €', padRight: 1 } );
export const millionFormatterNumeric = function ( numberToFormat ) {
	return formatter( { round: 1, decimal: ',', padRight: 1 } )( numberToFormat / 1000000 );
};

export { amountForServerFormatter };
