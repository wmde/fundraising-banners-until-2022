import formatter from 'format-number';
import amountForServerFormatter from './server';

export const integerFormatter = formatter( { round: 0, integerSeparator: '.' } );
export const amountInputFormatter = formatter( { round: 2, suffix: ' €', decimal: ',', integerSeparator: '' } );
export const millionFormatter = formatter( { round: 1, decimal: ',', suffix: ' Mio. €', padRight: 1 } );

export { amountForServerFormatter };
