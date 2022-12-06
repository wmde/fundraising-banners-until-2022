import { UNSET, VALID } from '../../DonationForm/hooks/validation_states';

const addressTypeIsValid = addressType => addressType === null ? UNSET : VALID;

export const createAddressTypeSlice = ( initialAddressType, set ) => ( {
	addressType: initialAddressType,
	addressTypeValidity: addressTypeIsValid( initialAddressType ),
	setAddressType: ( addressType ) => set( () => ( { addressType: addressType } ) ),
	setAddressTypeValidity: () => set( ( state ) => ( { addressTypeValidity: addressTypeIsValid( state.addressType ) } ) ),
} );
