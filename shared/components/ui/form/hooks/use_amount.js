import { AMOUNT_TOO_HIGH, AMOUNT_TOO_LOW, UNSET, VALID } from './validation_states';
import { parseAmount } from '../../../../parse_amount';
import { useReducer } from 'preact/hooks';

function validateAmount( amount ) {
	if ( amount === null ) {
		return UNSET;
	}
	if ( amount < 1.0 ) {
		return AMOUNT_TOO_LOW;
	}
	if ( amount > 100000 ) {
		return AMOUNT_TOO_HIGH;
	}
	return VALID;
}

function amountReducer( state, action ) {
	let numericAmount;
	switch ( action.type ) {
		case 'AMOUNT_SELECTED':
			return {
				...state,
				selectedAmount: action.payload,
				customAmount: null,
				numericAmount: action.payload,
				amountValidity: VALID
			};
		case 'AMOUNT_TYPED':
			return {
				...state,
				selectedAmount: null,
				customAmount: action.payload,
				numericAmount: parseAmount( action.payload )
			};
		case 'CUSTOM_AMOUNT_LOST_FOCUS':
			// Don't validate immediately when field is empty
			if ( action.payload === '' ) {
				return {
					...state,
					selectedAmount: null,
					customAmount: action.payload,
					numericAmount: 0,
					amountValidity: UNSET
				};
			}
			numericAmount = parseAmount( action.payload );
			return {
				...state,
				customAmount: action.formatter( numericAmount ),
				numericAmount: numericAmount.toFixed( 2 ),
				amountValidity: validateAmount( numericAmount )
			};
		case 'SET_VALIDITY':
			return {
				...state,
				amountValidity: action.payload
			};
	}
	return state;
}

/**
 * Create "setter" function with dispatcher
 * @param {string} name
 * @param {Function} dispatch
 * @return {function([*]=)}
 */
function createAction( name, dispatch ) {
	return function ( value ) {
		dispatch( { type: name, payload: value } );
	};
}

export default function useAmountWithCustom( initial, customAmountFormatter ) {
	const [ state, dispatch ] = useReducer( amountReducer, {
		selectedAmount: initial,
		customAmount: null,
		numericAmount: 0,
		amountValidity: validateAmount( initial )
	} );
	return [
		state,
		{
			selectAmount: createAction( 'AMOUNT_SELECTED', dispatch ),
			updateCustomAmount: createAction( 'AMOUNT_TYPED', dispatch ),
			validateCustomAmount: amount => dispatch( { type: 'CUSTOM_AMOUNT_LOST_FOCUS', payload: amount, formatter: customAmountFormatter } ),
			setAmountValidity: createAction( 'SET_VALIDITY', dispatch )
		}

	];
}
