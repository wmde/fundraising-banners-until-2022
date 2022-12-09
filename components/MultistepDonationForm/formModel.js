import useInterval from '../DonationForm/hooks/use_interval';
import usePaymentMethod from '../DonationForm/hooks/use_payment_method';
import useAmountWithCustom from '../DonationForm/hooks/use_amount';
import useAddressType from '../DonationForm/hooks/use_address_type';
import { useDisabledFormValues } from '../DonationForm/hooks/use_disabled_form_values';

export function createFormModel(
	customAmountFormatter,
	initialInterval = null,
	initialPaymentMethod = null,
	initialAmount = null,
	initialAddressType = null
) {
	/* eslint-disable react-hooks/rules-of-hooks */
	const interval = useInterval( initialInterval );
	const paymentMethod = usePaymentMethod( initialPaymentMethod );
	const amount = useAmountWithCustom( initialAmount, customAmountFormatter );
	const addressType = useAddressType( initialAddressType );
	const disabled = useDisabledFormValues( interval.interval, paymentMethod.paymentMethod );

	const initialState = {
		addressType: initialAddressType,
		amount: initialAmount,
		interval: initialInterval,
		paymentMethod: initialPaymentMethod
	};

	return {
		interval,
		paymentMethod,
		amount,
		addressType,
		disabled,
		initialState
	};
}
