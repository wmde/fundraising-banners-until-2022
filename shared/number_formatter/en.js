import formatter from 'format-number';
import amountForServerFormatter from './server';
import getEnglishOrdinalSuffixOf from '../english_ordinal';

export const integerFormatter = formatter( { round: 0 } );
/** @deprecated */
export const amountInputFormatter = formatter( { round: 2, prefix: '€', integerSeparator: '' } ); /** @deprecated */
export const customAmountInputFormatter = formatter( { round: 2, integerSeparator: '' } );
export const millionFormatter = formatter( { round: 1, prefix: '€ ', suffix: 'M', padRight: 1 } );
export const millionFormatterNumeric = function ( numberToFormat ) {
	return formatter( { round: 1, padRight: 1 } )( numberToFormat / 1000000 );
};
export const dayOfMonthFormatter = day => getEnglishOrdinalSuffixOf( day );

export { amountForServerFormatter };
