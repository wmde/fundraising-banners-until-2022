import { UNSET, VALID } from '../../../../../../shared/components/ui/form/hooks/validation_states';
import { useState } from 'preact/hooks';

const addressTypeIsValid = method => method === null ? UNSET : VALID;

export default function useAddressType( initial ) {
	const [ addressType, setAddressType ] = useState( initial );
	const [ validity, setValidity ] = useState( addressTypeIsValid( initial ) );
	const update = newAddressType => {
		setAddressType( newAddressType );
		setValidity( addressTypeIsValid( newAddressType ) );
	};
	return [ addressType, update, validity, setValidity ];
}
