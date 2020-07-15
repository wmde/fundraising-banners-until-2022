import { UNSET, VALID } from '../../../../../shared/components/ui/form/hooks/validation_states';
import { useState } from 'preact/hooks';

const addressOptionIsValid = method => method === null ? UNSET : VALID;

export default function useAddressOption( initial ) {
	const [ addressOption, setAddressOption ] = useState( initial );
	const [ validity, setValidity ] = useState( addressOptionIsValid( initial ) );
	const update = newAddressOption => {
		setAddressOption( newAddressOption );
		setValidity( addressOptionIsValid( newAddressOption ) );
	};
	return [ addressOption, update, validity, setValidity ];
}
