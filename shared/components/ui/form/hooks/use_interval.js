import { UNSET, VALID } from './validation_states';
import { useState } from 'preact/hooks';

const intervalIsValid = interval => interval === null ? UNSET : VALID;

export default function useInterval( initial ) {
	const [ interval, setInterval ] = useState( initial );
	const [ validity, setValidity ] = useState( intervalIsValid( initial ) );
	const update = newInterval => {
		setInterval( newInterval );
		setValidity( intervalIsValid( newInterval ) );
	};
	return [ interval, update, validity, setValidity ];
}
