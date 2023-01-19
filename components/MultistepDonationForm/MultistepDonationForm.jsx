import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useKeenSlider } from 'keen-slider/react';
import SubmitForm from './SubmitForm';
import PropTypes from 'prop-types';

export default function MultistepDonationForm( props ) {
	const onFormInteraction = this.props.onFormInteraction ? e => props.onFormInteraction( e ) : () => {};
	const formModel = props.useFormModel(
		props.formatters.customAmountInputFormatter,
		{
			bannerName: props.bannerName,
			campaignName: props.campaignName,
			impressionCounts: props.impressionCounts
		}
	);
	formModel.useSubmitValuesWatcher();
	const formController = props.createFormController( formModel );

	const [ currentSlide, setCurrentSlide ] = useState( 0 );
	// Trigger value for submitting the form
	const [ submitForm, setSubmitForm ] = useState( 0 );
	const [ sliderRef, slider ] = useKeenSlider( {
		initial: 0,
		loop: false,
		dragSpeed: 0,
		spacing: 15
	} );

	formController.onNext( () =>{
		setCurrentSlide( currentSlide + 1 );
		slider.next();
	} );

	formController.onBack( () => {
		setCurrentSlide( currentSlide - 1 );
		slider.prev();
	} );

	formController.onGoToStep( ( step ) => {
		setCurrentSlide( step - 1 );
		slider.moveToSlide( step - 1 );
	} );

	formController.onSubmit( ( eventName ) => {
		props.onSubmit( eventName );
		setSubmitForm( submitForm + 1 );
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
		<SubmitForm
			formAction={ formModel.formAction[ 0 ] }
			submitValues={ formModel.submit[ 0 ] }
			submit={ submitForm }
			amountFormatter={ props.formatters.amountForServerFormatter }
		/>
	</div>;
}

MultistepDonationForm.propTypes = {
	onSubmit: PropTypes.func,
	formItems: PropTypes.array,
	bannerName: PropTypes.string,
	campaignName: PropTypes.string,
	impressionCounts: PropTypes.string,
	formatters: PropTypes.object,
	onFormInteraction: PropTypes.func,
	buttonText: PropTypes.string,
	errorPosition: PropTypes.symbol,
	bannerType: PropTypes.symbol,
	formActionProps: PropTypes.object,
	donationForms: PropTypes.array,
	createFormController: PropTypes.func,
	useFormModel: PropTypes.func,
	trackBannerEvent: PropTypes.func
};
