import { AMOUNT_TOO_HIGH, AMOUNT_TOO_LOW, UNSET, VALID } from '../../DonationForm/hooks/validation_states';
import { parseAmount } from '../../../shared/parse_amount';

function amountIsValid( amount ) {
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

function validateAndSetCustomAmount( amount, formatter ) {
	if ( amount === '' ) {
		return {
			selectedAmount: null,
			customAmount: amount,
			numericAmount: 0,
			amountValidity: UNSET
		};
	}
	const numericAmount = parseAmount( amount );
	return {
		customAmount: formatter( numericAmount ),
		numericAmount: numericAmount.toFixed( 2 ),
		amountValidity: amountIsValid( numericAmount )
	};
}

export const createAmountSlice = ( initialAmount, customAmountFormatter, get, set ) => ( {
	selectedAmount: initialAmount,
	amountValidity: amountIsValid( initialAmount ),
	customAmount: null,
	numericAmount: initialAmount ? Number( initialAmount ) : 0,
	getAmount: () => get( ( state ) => state.customAmount ?? state.selectedAmount ),
	selectAmount: ( amount ) => set( () => ( {
		selectedAmount: amount,
		customAmount: null,
		numericAmount: amount,
		amountValidity: VALID
	} ) ),
	setAmountValidity: ( isValid ) => set( () => ( { amountValidity: isValid } ) ),
	updateCustomAmount: ( amount ) => set( () => ( {
		selectedAmount: null,
		customAmount: amount,
		numericAmount: parseAmount( amount )
	} ) ),
	validateAndSetCustomAmount:( amount ) => set( () => ( validateAndSetCustomAmount( amount, customAmountFormatter ) ) ),
} );
