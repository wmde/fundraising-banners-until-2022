import { Intervals, PaymentMethods } from '../../components/DonationForm/FormItemsBuilder';
import { Alternatives } from '../../components/DonationForm/hooks/use_alternative';

let formModel = {};
let submitCallback = () => {};
let nextCallback = () => {};
let backCallback = () => {};
let goToStepCallback = () => {};

let thirdPageAmount = '';

const submitStep = ( step, extraData ) => {
	const [ paymentInterval, setPaymentInterval, , ] = formModel.interval;
	const [ paymentMethod, , , ] = formModel.paymentMethod;

	switch ( step ) {
		case 1:
			document.getElementsByClassName( 'wmde-banner-form' )[ 0 ]?.scrollIntoView(
				{ behavior: 'smooth', block: 'center', inline: 'nearest' }
			);
			if ( paymentInterval !== Intervals.ONCE.value || paymentMethod === PaymentMethods.SOFORT.value ) {
				goToStepCallback( 3 );
				return;
			}
			nextCallback();
			break;
		case 2:
			if ( extraData.upgradeToYearly === Alternatives.YES ) {
				setPaymentInterval( Intervals.YEARLY.value );
			}
			goToStepCallback( 3 );
			break;
		case 3:
			submitCallback();
			break;
	}
};

const goNext = ( step ) => {
	const [ , setPaymentInterval, , ] = formModel.interval;
	switch ( step ) {
		case 2:
			setPaymentInterval( Intervals.YEARLY.value );
			backCallback();
			break;
	}
};

const goBack = ( step ) => {
	const [ , setPaymentInterval, , ] = formModel.interval;
	switch ( step ) {
		case 2:
			setPaymentInterval( Intervals.ONCE.value );
			break;
		case 3:
			// Going back to step 1 is probably the best for all possible user flows
			goToStepCallback( 1 );
			return;
	}
	backCallback();
};

const goToStep = ( step ) => {
	goToStepCallback( step );
};

const getSubmitValues = () => {
	const [ addressType, , , ] = formModel.addressType;
	const [ { numericAmount } ] = formModel.amount;
	const [ paymentInterval, , , ] = formModel.interval;
	const [ paymentMethod, , , ] = formModel.paymentMethod;

	return {
		addressType: addressType,
		amount: thirdPageAmount === '' ? numericAmount : thirdPageAmount,
		interval: paymentInterval,
		paymentMethod: paymentMethod
	};
};

const onNext = callback => {
	nextCallback = callback;
};

const onBack = callback => {
	backCallback = callback;
};

const onSubmit = callback => {
	submitCallback = callback;
};

const onGoToStep = callback => {
	goToStepCallback = callback;
};

export default function createFormController( withFormModel ) {
	formModel = withFormModel;

	return {
		onNext,
		onBack,
		onSubmit,
		onGoToStep,
		submitStep,
		goNext,
		goBack,
		goToStep,
		getSubmitValues
	};
}
