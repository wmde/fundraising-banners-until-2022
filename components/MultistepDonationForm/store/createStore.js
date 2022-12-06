import create from 'zustand'
import { createIntervalSlice } from './intervalSlice';
import { createPaymentMethodSlice } from './paymentMethodSlice';
import { createAddressTypeSlice } from './addressTypeSlice';
import { createAmountSlice } from './amountSlice';

export function createStore(
	customAmountFormatter,
	initialInterval = null,
	initialPaymentMethod = null,
	initialAmount = null,
	initialAddressType = null
) {
	return create( ( ...a ) => ( {
		...createIntervalSlice( initialInterval, ...a ),
		...createPaymentMethodSlice( initialPaymentMethod, ...a ),
		...createAmountSlice( initialAmount, customAmountFormatter, ...a ),
		...createAddressTypeSlice( initialAddressType, ...a ),
	} ) )
}
