import { AMOUNT_TOO_HIGH, AMOUNT_TOO_LOW, UNSET, VALID } from './validation_states';
import { useState } from 'preact/hooks';
import { parseAmount } from '../../../shared/parse_amount';

function customAmountIsValid( amount ) {
	if ( amount === null ) {
		return UNSET;
	}
	if ( amount < 1.0 ) {
		return AMOUNT_TOO_LOW;
	}
	if ( amount >= 100000 ) {
		return AMOUNT_TOO_HIGH;
	}
	return VALID;
}

export default function useCustomAmount( initial ) {
	const [ customAmount, setCustomAmount ] = useState( initial );
	const [ numericCustomAmount, setNumericCustomAmount ] = useState( 0 );
	const [ validity, setValidity ] = useState( UNSET );
	const update = newCustomAmount => {
		const numericAmount = parseAmount( newCustomAmount ).toFixed( 2 );
		setCustomAmount( newCustomAmount );
		setValidity( customAmountIsValid( numericAmount ) );
		setNumericCustomAmount( numericAmount );
	};
	return [ customAmount, numericCustomAmount, update, validity, setValidity ];
}
