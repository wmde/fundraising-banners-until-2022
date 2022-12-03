import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useKeenSlider } from 'keen-slider/react';
import useFormAction, { ADD_DONATION_URL, NEW_DONATION_URL} from './hooks/use_form_action';
import { createFormModel } from './formModel';
import SubmitValues from './SubmitValues';
import { AddressTypes } from '../DonationForm/FormItemsBuilder';

export default function MultistepDonationForm( props ) {
	const onFormInteraction = this.props.onFormInteraction ? e => props.onFormInteraction( e ) : () => {};
	const formModel = createFormModel( props.formatters.customAmountInputFormatter );
	const formController = props.createFormController( formModel );
	const submitFormRef = useRef();

	const [ formAction, setUrl ] = useFormAction( props, props.formActionProps ?? {} );
	const [ currentSlide, setCurrentSlide ] = useState( 0 );
	const [ submitForm, setSubmitForm ] = useState( false );
	const [ submitValues, setSubmitValues ] = useState( formModel.initialState );
	const [ sliderRef, slider ] = useKeenSlider( {
		initial: 0,
		loop: false,
		dragSpeed: 0,
		spacing: 15,
		slideChanged( s ) {
			setCurrentSlide( s.details().relativeSlide );
		}
	} );

	useEffect( () => {
		if ( submitForm ) {
			submitFormRef.current.submit();
		}
	}, [ submitForm ] );

	formController.onNext( () => slider.next() );
	formController.onBack( () => slider.prev() );
	formController.onGoToStep( ( step ) => slider.moveToSlide( step - 1 ) );
	formController.onSubmit( ( eventName ) => {
		// The following timeouts are ugly hack to get around the asynchronous state change of the store
		// and the asynchronous rendering of SubmitValues before the form is submitted
		// See https://blog.logrocket.com/why-react-doesnt-update-state-immediately/

		// Wait for a few ms until P(React) has updated the store
		setTimeout( () => {
			const finalSubmitValues = formController.getSubmitValues();

			// TODO Move form address generation to FormController
			if ( finalSubmitValues.addressType === AddressTypes.NO.value ) {
				setUrl( ADD_DONATION_URL );
			} else {
				setUrl( NEW_DONATION_URL );
			}
			setSubmitValues( finalSubmitValues );
			// wait for the submit values to be rendered,
			// then trigger the effect (which submits the form) by changing submitForm to true
			setTimeout( () => {
				props.onSubmit( eventName );
				setSubmitForm( true );
			}, 100 );
		}, 50 );
	} );

	const onSubmitStep = ( step, extraData = {} ) => formController.submitStep( step, extraData );
	const onBack = ( step, extraData = {} ) => formController.goBack( step, extraData );
	const onNext = ( step, extraData = {} ) => formController.goNext( step, extraData );

	return <div className="wmde-banner-form">
		<div ref={ sliderRef } className="keen-slider wmde-banner-form-slider">
			{ props.donationForms.map( ( Form, idx ) => (
				<div key={ idx } className="keen-slider__slide wmde-banner-form-slide">
					<Form
						formItems={ props.formItems }
						step={ idx + 1 }
						onSubmit={ onSubmitStep }
						onBack={ onBack }
						onNext={ onNext }
						trackBannerEvent={ props.trackBannerEvent }
						formModel={ formModel }
						active={ currentSlide === idx }
						onClick={ onFormInteraction }
						formatters={ props.formatters }
					/>
				</div>
			) ) }
		</div>
		<form
			method="post"
			name="donationForm"
			action={ formAction }
			ref={ submitFormRef }
		>
			<SubmitValues
				submitValues={ submitValues }
				formatter={ props.formatters.amountForServerFormatter }
			/>
		</form>
	</div>;
}
