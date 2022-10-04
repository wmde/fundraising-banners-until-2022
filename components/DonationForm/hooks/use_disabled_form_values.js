import { useState, useEffect } from 'preact/hooks';
import { Intervals, PaymentMethods } from '../FormItemsBuilder';

const AllIntervalsExceptOnce = Object.values( Intervals ).reduce(
	( intervals, interval ) => {
		if ( interval.value !== Intervals.ONCE.value ) {
			intervals.push( interval.value );
		}
		return intervals;
	},
	[]
);

/**
 * This hook implements the "business logic" for checking invalid combinations of
 * payment intervals and methods, returning lists of disabled intervals or methods
 * when one of them is selected. These lists can then be passed into the SelectGroup
 * components.
 *
 * As long as the SelectGroup makes it impossible to select an invalid value,
 * there is no need to set the complimentary, already selected value to null.
 *
 * @param {string} currentInterval
 * @param {string} currentPaymentMethod
 * @return {Array}
 */
export const useDisabledFormValues = function ( currentInterval, currentPaymentMethod ) {
	const [ disabledIntervals, setDisabledIntervals ] = useState( [] );
	const [ disabledPaymentMethods, setDisabledPaymentMethods ] = useState( [] );

	useEffect(
		() => {
			if ( currentInterval === Intervals.ONCE.value || currentInterval === null ) {
				setDisabledPaymentMethods( [] );
			} else {
				setDisabledPaymentMethods( [ PaymentMethods.SOFORT.value ] );
			}
		},
		[ currentInterval ]
	);

	useEffect(
		() => {
			if ( currentPaymentMethod === PaymentMethods.SOFORT.value ) {
				setDisabledIntervals( AllIntervalsExceptOnce );
			} else {
				setDisabledIntervals( [] );
			}
		},
		[ currentPaymentMethod ]
	);

	return [ disabledIntervals, disabledPaymentMethods ];
};
