import { UNSET, VALID } from '../../DonationForm/hooks/validation_states';

const paymentMethodIsValid = method => method === null ? UNSET : VALID;

export const createPaymentMethodSlice = ( initialPaymentMethod, set ) => ( {
	paymentMethod: initialPaymentMethod,
	paymentMethodValidity: paymentMethodIsValid( initialPaymentMethod ),
	setPaymentMethod: ( paymentMethod ) => set( () => ( { paymentMethod: paymentMethod } ) ),
	setPaymentMethodValidity: () => set( ( state ) => ( { paymentMethodValidity: paymentMethodIsValid( state.paymentMethod ) } ) ),
} );
