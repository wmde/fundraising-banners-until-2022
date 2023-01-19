import useInterval from '../../DonationForm/hooks/use_interval';
import usePaymentMethod from '../../DonationForm/hooks/use_payment_method';
import useAmountWithCustom from '../../DonationForm/hooks/use_amount';
import useAddressType from '../../DonationForm/hooks/use_address_type';
import { useDisabledFormValues } from '../../DonationForm/hooks/use_disabled_form_values';
import { useEffect, useState } from 'preact/hooks';
import useFormAction from '../../DonationForm/hooks/use_form_action';

export default function useFormModel(
	customAmountFormatter,
	formActionParameters,
	extraFormActionParameters = {},
	initialInterval = null,
	initialPaymentMethod = null,
	initialAmount = null,
	initialAddressType = null
) {
	const formAction = useFormAction( formActionParameters, extraFormActionParameters );
	const interval = useInterval( initialInterval );
	const paymentMethod = usePaymentMethod( initialPaymentMethod );
	const amount = useAmountWithCustom( initialAmount, customAmountFormatter );
	const addressType = useAddressType( initialAddressType );
	const disabled = useDisabledFormValues( interval.interval, paymentMethod.paymentMethod );
	const submit = useState( {} );

	const useSubmitValuesWatcher = () => useEffect( () => {
		submit[ 1 ]( {
			addressType: addressType[ 0 ],
			interval: interval[ 0 ],
			numericAmount: amount[ 0 ].numericAmount,
			paymentMethod: paymentMethod[ 0 ]
		} );
	}, [ interval[ 0 ], paymentMethod[ 0 ], addressType[ 0 ], amount[ 0 ].numericAmount ] );

	return {
		formAction,
		interval,
		paymentMethod,
		amount,
		addressType,
		disabled,
		submit,
		useSubmitValuesWatcher
	};
}
