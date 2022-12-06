import { UNSET, VALID } from '../../DonationForm/hooks/validation_states';

const intervalIsValid = interval => interval === null ? UNSET : VALID;

export const createIntervalSlice = ( initialInterval, set ) => ( {
	interval: initialInterval,
	intervalValidity: intervalIsValid( initialInterval ),
	setInterval: ( interval ) => set( () => ( { interval: interval } ) ),
	setIntervalValidity: () => set( ( state ) => ( { intervalValidity: intervalIsValid( state.interval ) } ) ),
} );
