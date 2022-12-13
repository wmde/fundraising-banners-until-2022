import useFormModel from './use_form_model';
import useCustomAmount from '../../../components/DonationForm/hooks/use_custom_amount';
import { useEffect } from 'preact/hooks';

export default function useFormModelWithCustom(
	customAmountFormatter,
	formActionParameters,
	extraFormActionParameters = {},
	initialInterval = null,
	initialPaymentMethod = null,
	initialAmount = null,
	initialAddressType = null
) {
	const formModel = useFormModel(
		customAmountFormatter,
		formActionParameters,
		extraFormActionParameters,
		initialInterval,
		initialPaymentMethod,
		initialAmount,
		initialAddressType
	);
	const customAmount = useCustomAmount( '' );

	const useSubmitValuesWatcher = () => useEffect( () => {
		formModel.submit[ 1 ]( {
			interval: formModel.interval[ 0 ],
			paymentMethod: formModel.paymentMethod[ 0 ],
			addressType: formModel.addressType[ 0 ],
			numericAmount: customAmount[ 0 ] === '' ? formModel.amount[ 0 ].numericAmount : customAmount[ 1 ]
		} );
	}, [ formModel.interval[ 0 ], formModel.paymentMethod[ 0 ], formModel.addressType[ 0 ], formModel.amount[ 0 ].numericAmount, customAmount[ 0 ] ] );

	formModel.useSubmitValuesWatcher = useSubmitValuesWatcher;
	formModel.customAmount = customAmount;
	return formModel;
}
