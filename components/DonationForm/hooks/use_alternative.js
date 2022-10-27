import { useState } from 'preact/hooks';
import { UNSET, VALID } from './validation_states';

const alternativeIsValid = alternative => alternative === null ? UNSET : VALID;

export const Alternatives = { NO: 'NO', YES: 'YES' };

export default function useAlternative( initial ) {
	const [ alternative, setAlternative ] = useState( initial );
	const [ validity, setValidity ] = useState( alternativeIsValid( initial ) );
	const update = newAlternative => {
		setAlternative( newAlternative );
		setValidity( alternativeIsValid( newAlternative ) );
	};
	return [ alternative, update, validity, setValidity ];
}
