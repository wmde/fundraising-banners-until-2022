import { UNSET, VALID } from './validation_states';
import { useState } from 'preact/hooks';

const paymentMethodIsValid = method => method === null ? UNSET : VALID;

export default function usePaymentMethod( initial ) {
	const [ paymentMethod, setPayment ] = useState( initial );
	const [ validity, setValidity ] = useState( paymentMethodIsValid( initial ) );
	const update = newPaymentMethod => {
		setPayment( newPaymentMethod );
		setValidity( paymentMethodIsValid( newPaymentMethod ) );
	};
	return [ paymentMethod, update, validity, setValidity ];
}
