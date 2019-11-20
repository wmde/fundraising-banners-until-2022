import formatter from 'format-number';
import amountForServerFormatter from './server';

export const donorFormatter = formatter( { round: 0 } );
export const amountInputFormatter = formatter( { round: 2, suffix: ' €', decimal: ',', integerSeparator: '' } );

export { amountForServerFormatter };
