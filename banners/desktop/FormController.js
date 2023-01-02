import { Intervals, PaymentMethods } from '../../components/DonationForm/FormItemsBuilder';
import { Alternatives } from '../../components/DonationForm/hooks/use_alternative';

let formModel = {};
let submitCallback = () => {};
let nextCallback = () => {};
let backCallback = () => {};
let goToStepCallback = () => {};

const submitStep = ( step, extraData ) => {
	const [ paymentInterval, setPaymentInterval, , ] = formModel.interval;
	const [ paymentMethod, , , ] = formModel.paymentMethod;

	switch ( step ) {
		case 1:
			if ( paymentInterval !== Intervals.ONCE.value || paymentMethod === PaymentMethods.SOFORT.value ) {
				submitCallback();
				return;
			}
			nextCallback();
			break;
		case 2:
			if ( extraData.upgradeToYearly === Alternatives.YES ) {
				setPaymentInterval( Intervals.YEARLY.value );
				submitCallback( 'submit-recurring' );
			} else {
				submitCallback( 'submit-non-recurring' );
			}
			break;
		case 3:
			setPaymentInterval( Intervals.YEARLY.value );
			submitCallback( 'submit-different-amount' );
			break;
	}
};

const goNext = () => {
	nextCallback();
};

const goBack = ( step ) => {
	const [ , setPaymentInterval, , ] = formModel.interval;
	switch ( step ) {
		case 2:
			setPaymentInterval( Intervals.ONCE.value );
			break;
	}
	backCallback();
};

const goToStep = ( step ) => {
	goToStepCallback( step );
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
		goToStep
	};
}
