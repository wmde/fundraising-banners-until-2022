import create, { createStore } from 'zustand'
import { createIntervalSlice } from './intervalSlice';
import { createPaymentMethodSlice } from './paymentMethodSlice';
import { createAddressTypeSlice } from './addressTypeSlice';
import { createAmountSlice } from './amountSlice';
import { AddressTypes, Intervals, PaymentMethods } from '../../DonationForm/FormItemsBuilder';

export function createDonationStore(
	customAmountFormatter,
	initialInterval = null,
	initialPaymentMethod = null,
	initialAmount = null,
	initialAddressType = null
) {
	return createStore()( ( set, get ) => ( {
		...createIntervalSlice( initialInterval, set, get ),
		...createPaymentMethodSlice( initialPaymentMethod, set, get ),
		...createAmountSlice( initialAmount, customAmountFormatter, set, get ),
		...createAddressTypeSlice( initialAddressType, set, get ),
		disabledIntervals: [],
		disabledPaymentMethods: [],
		disabledAddressTypes: []
		// disabledIntervals: get( ( state ) => {
		// 	if ( state.paymentMethod === PaymentMethods.SOFORT.value ) {
		// 		return [
		// 			Intervals.YEARLY,
		// 			Intervals.BIANNUAL,
		// 			Intervals.MONTHLY,
		// 			Intervals.QUARTERLY,
		// 		];
		// 	}
		// 	return [];
		// } ),
		// disabledPaymentMethods: get( ( state ) => {
		// 	if ( state.interval === Intervals.ONCE.value || state.interval === null ) {
		// 		return [];
		// 	}
		// 	return [ PaymentMethods.SOFORT.value ];
		// } ),
		// disabledAddressTypes: get( ( state ) => {
		// 	if ( state.paymentMethod === PaymentMethods.DIRECT_DEBIT.value ) {
		// 		return [ AddressTypes.NO.value ];
		// 	}
		// 	return [];
		// } )
	} ) )
}
