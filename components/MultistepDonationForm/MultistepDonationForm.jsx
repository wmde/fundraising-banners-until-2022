import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useKeenSlider } from 'keen-slider/react';
import useFormAction from './hooks/use_form_action';
import { createFormModel } from './formModel';
import SubmitValues from './SubmitValues';

export default function MultistepDonationForm( props ) {
	const onFormInteraction = this.props.onFormInteraction ? e => props.onFormInteraction( e ) : () => {};
	const formModel = createFormModel( props.formatters.customAmountInputFormatter );
	const formController = props.createFormController( formModel );
	const submitFormRef = useRef();

	const [ formAction ] = useFormAction( props, props.formActionProps ?? {} );
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
			setSubmitValues( formController.getSubmitValues() );
			submitFormRef.current.submit();
		}
	}, [ submitForm ] );

	formController.onNext( () => slider.next() );
	formController.onBack( () => slider.prev() );
	formController.onGoToStep( ( step ) => slider.moveToSlide( step - 1 ) );
	formController.onSubmit( ( eventName ) => {
		props.onSubmit( eventName );
		setSubmitForm( true );
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
