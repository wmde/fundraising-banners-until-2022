import { createRef, h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import TranslationContext from '../../shared/TranslationContext';
import { SelectGroup } from './subcomponents/SelectGroup';
import SelectCustomAmount from './subcomponents/SelectCustomAmount';
import SubmitValues from './subcomponents/SubmitValues';
import SmsBox from './subcomponents/SmsBox';

import { isValid, isValidOrUnset, UNSET } from './hooks/validation_states';
import useAmountWithCustom from './hooks/use_amount';
import useInterval from './hooks/use_interval';
import usePaymentMethod from './hooks/use_payment_method';
import useAlternative, { Alternatives } from './hooks/use_alternative';
import useFormAction from './hooks/use_form_action';
import { amountMessage, validateRequired } from './utils';
import { Intervals, PaymentMethods } from '../../components/DonationForm/FormItemsBuilder';
import classNames from 'classnames';
import useCustomAmount from './hooks/use_custom_amount';

const formSteps = Object.freeze( {
	ONE: Symbol( 'one' ),
	TWO: Symbol( 'two' ),
	THREE: Symbol( 'three' )
} );

export default function BegYearlyRecurringDonation3StepForm( props ) {
	const Translations = useContext( TranslationContext );
	const [ paymentInterval, setInterval, intervalValidity, setIntervalValidity ] = useInterval( null );
	const [ paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity ] = usePaymentMethod( null );
	const [ upgradeToYearly, setUpgradeToYearly, upgradeToYearlyValidity, setUpgradeToYearlyValidity ] = useAlternative( null );
	const [
		{ numericAmount, amountValidity, selectedAmount, customAmount },
		{ selectAmount, updateCustomAmount, validateCustomAmount, setAmountValidity }
	] = useAmountWithCustom( null, props.formatters.customAmountInputFormatter );
	const [ formStep, setFormStep ] = useState( formSteps.ONE );
	const [ disabledIntervals, setDisabledIntervals ] = useState( [] );
	const [ disabledPaymentMethods, setDisabledPaymentMethods ] = useState( [] );
	const [ step1ButtonText, setStep1ButtonText ] = useState( Translations[ 'submit-label' ] );
	const [ secondPageAmount, setSecondPageAmount ] = useState( '0' );
	const [ thirdPageAmount, numericThirdPageAmount, setThirdPageAmount, thirdPageAmountValidity, setThirdPageAmountValidity ] = useCustomAmount( '' );
	const [ formAction ] = useFormAction( props, props.formActionProps ?? {} );
	const FormStep2 = props.formStep2;
	const FormStep3 = props.formStep3;
	const formRef = createRef();

	useEffect(
		() => {
			setStep1ButtonText( paymentInterval === Intervals.ONCE.value && paymentMethod !== PaymentMethods.SOFORT.value ?
				Translations[ 'submit-label-short' ] :
				Translations[ 'submit-label' ] );
		},
		[ paymentInterval, paymentMethod, Translations ]
	);

	// check with side effects
	const paymentDataIsValid = () => [
		[ intervalValidity, setIntervalValidity ],
		[ amountValidity, setAmountValidity ],
		[ paymentMethodValidity, setPaymentMethodValidity ]
	].map( validateRequired ).every( isValid );

	const upgradeToYearIsValid = () => isValid( validateRequired( [ upgradeToYearlyValidity, setUpgradeToYearlyValidity ] ) );
	const thirdPageAmountIsValid = () => isValid( validateRequired( [ thirdPageAmountValidity, setThirdPageAmountValidity ] ) );

	const onSubmitStep1 = e => {
		if ( customAmount ) {
			validateCustomAmount( customAmount );
		}
		if ( paymentDataIsValid() ) {
			if ( paymentInterval !== Intervals.ONCE.value || paymentMethod === PaymentMethods.SOFORT.value ) {
				props.onSubmit();
				return;
			}
			props.onPage2();
			setSecondPageAmount( customAmount ?? selectedAmount );
			setUpgradeToYearly( null );
			setFormStep( formSteps.TWO );
		}
		e?.preventDefault();
	};

	const onFormChangeToYearly = () => {
		props.onPage3();
		setInterval( Intervals.YEARLY.value );
		setUpgradeToYearly( Alternatives.YES );
		setFormStep( formSteps.THREE );
	};

	const onSubmitStep2 = e => {
		if ( paymentDataIsValid() && upgradeToYearIsValid() ) {
			if ( upgradeToYearly === Alternatives.YES ) {
				props.onSubmitRecurring();
			} else {
				props.onSubmitNonRecurring();
			}
			return;
		}
		e?.preventDefault();
	};

	const onSubmitStep3 = e => {
		if ( thirdPageAmountIsValid() && paymentDataIsValid() && upgradeToYearIsValid() ) {
			props.onSubmitStep3();
			if ( parseFloat( numericThirdPageAmount ) > parseFloat( numericAmount ) ) {
				props.onStep3Increased();
			}
			if ( parseFloat( numericThirdPageAmount ) < parseFloat( numericAmount ) ) {
				props.onStep3Decreased();
			}
			return;
		}
		e?.preventDefault();
	};

	const onFormSubmit = e => {
		switch ( formStep ) {
			case formSteps.ONE:
				onSubmitStep1( e );
				break;
			case formSteps.TWO:
				onSubmitStep2( e );
				break;
			case formSteps.THREE:
				onSubmitStep3( e );
				break;
		}
	};

	const onFormBack = e => {
		e.preventDefault();
		if ( formStep === formSteps.THREE ) {
			setThirdPageAmount( '' );
			setThirdPageAmountValidity( UNSET );
			setInterval( Intervals.ONCE.value );
			setUpgradeToYearly( null );
			setFormStep( formSteps.TWO );
		} else if ( formStep === formSteps.TWO ) {
			setFormStep( formSteps.ONE );
		}
	};

	const addDisabledPaymentMethod = paymentMethodToDisable => {
		let currentDisabledPaymentMethods = disabledPaymentMethods;
		if ( currentDisabledPaymentMethods.includes( paymentMethodToDisable ) ) {
			return;
		}
		currentDisabledPaymentMethods.push( paymentMethodToDisable );
		setDisabledPaymentMethods( currentDisabledPaymentMethods );
	};

	const removeDisabledPaymentMethod = paymentMethodToEnable => {
		let currentDisabledPaymentMethods = disabledPaymentMethods;
		const index = currentDisabledPaymentMethods.indexOf( paymentMethodToEnable );
		if ( index === -1 ) {
			return;
		}
		currentDisabledPaymentMethods.splice( index, 1 );
		setDisabledPaymentMethods( currentDisabledPaymentMethods );
	};

	const onFormInteraction = this.props.onFormInteraction ? e => this.props.onFormInteraction( e ) : () => {};

	const onChangeInterval = e => {
		setInterval( e.target.value );

		if ( e.target.value !== Intervals.ONCE.value ) {
			addDisabledPaymentMethod( PaymentMethods.SOFORT.value );
		} else {
			removeDisabledPaymentMethod( PaymentMethods.SOFORT.value );
		}
	};

	const onChangePaymentMethod = e => {
		setPaymentMethod( e.target.value );
		if ( e.target.value === PaymentMethods.SOFORT.value ) {
			setDisabledIntervals(
				// Exclude all intervals except "once"
				props.formItems.intervals
					.map( intervalItem => intervalItem.value )
					.filter( interval => interval !== Intervals.ONCE.value )
			);
		} else {
			setDisabledIntervals( [] );
		}
	};

	const onChooseUpgradeToYearly = e => {
		setUpgradeToYearly( e.target.value );

		if ( e.target.value === Alternatives.YES ) {
			setInterval( Intervals.YEARLY.value );
		}
	};

	const getSubmitAmount = () => {
		if ( thirdPageAmount !== '' ) {
			return props.formatters.amountForServerFormatter( numericThirdPageAmount );
		}

		return props.formatters.amountForServerFormatter( numericAmount );
	};

	return <form
		method="post"
		name="donationForm"
		onClick={ onFormInteraction }
		onSubmit={ onFormSubmit }
		action={ formAction }
		ref={ formRef }
		className={ classNames(
			'wmde-banner-form',
			{ 'wmde-banner-form--is-step-1': formStep === formSteps.ONE },
			{ 'wmde-banner-form--is-step-2': formStep === formSteps.TWO },
			{ 'wmde-banner-form--is-step-3': formStep === formSteps.THREE }
		) }
	>
		<div className="wmde-banner-form-steps">
			<div className="wmde-banner-form-step-1">
				<fieldset className="wmde-banner-form-field-group">
					<legend className="wmde-banner-form-field-group-legend">{ Translations[ 'intervals-header' ]}</legend>
					<SelectGroup
						fieldname="select-interval"
						selectionItems={ props.formItems.intervals }
						isValid={ isValidOrUnset( intervalValidity ) }
						errorMessage={ Translations[ 'no-interval-message' ] }
						currentValue={ paymentInterval }
						onSelected={ onChangeInterval }
						disabledOptions={ disabledIntervals }
						errorPosition={ props.errorPosition }
					/>
				</fieldset>

				<fieldset className="wmde-banner-form-field-group">
					<legend className="wmde-banner-form-field-group-legend">{ Translations[ 'amounts-header' ]}</legend>
					<SelectGroup
						fieldname="select-amount"
						selectionItems={props.formItems.amounts}
						isValid={ isValidOrUnset( amountValidity ) }
						errorMessage={ amountMessage( amountValidity, Translations ) }
						currentValue={ selectedAmount }
						onSelected={ e => selectAmount( e.target.value ) }
						disabledOptions={ [] }
						errorPosition={ props.errorPosition }
					>
						<SelectCustomAmount
							fieldname="select-amount"
							value={ customAmount }
							selectedAmount={ selectedAmount }
							onInput={ e => updateCustomAmount( e.target.value ) }
							onBlur={ e => validateCustomAmount( e.target.value ) }
							placeholder={ props.customAmountPlaceholder }
							language={
								/* eslint-disable-next-line dot-notation */
								Translations[ 'LANGUAGE' ]
							}
						/>
					</SelectGroup>
				</fieldset>

				<fieldset className="wmde-banner-form-field-group">
					<legend className="wmde-banner-form-field-group-legend">{ Translations[ 'payments-header' ] }</legend>
					<SelectGroup
						fieldname="select-payment-method"
						selectionItems={ props.formItems.paymentMethods }
						isValid={ isValidOrUnset( paymentMethodValidity )}
						errorMessage={ Translations[ 'no-payment-type-message' ] }
						currentValue={ paymentMethod }
						onSelected={ onChangePaymentMethod }
						disabledOptions={ disabledPaymentMethods }
						errorPosition={ props.errorPosition }
					>
						<SmsBox/>
					</SelectGroup>
				</fieldset>

				<div className="wmde-banner-form-button-container">
					<button tabIndex="-1" className="wmde-banner-form-button" type="submit">
						{ step1ButtonText }
					</button>
				</div>
			</div>

			<FormStep2
				onFormBack={ onFormBack }
				onSubmit={ onSubmitStep2 }
				formRef={ formRef }
				onChooseUpgradeToYearly={ onChooseUpgradeToYearly }
				onFormBackToYearly={ onFormChangeToYearly }
				secondPageAmount={ secondPageAmount }
				upgradeToYearly={ upgradeToYearly }
				isValid={ isValidOrUnset( upgradeToYearlyValidity ) }
			/>

			<FormStep3
				onFormBack={ onFormBack }
				onSubmit={ onSubmitStep3 }
				amount={ thirdPageAmount }
				numericAmount={ numericThirdPageAmount }
				setAmount={ setThirdPageAmount }
				isValid={ isValidOrUnset( thirdPageAmountValidity ) }
				formatter={ props.formatters.customAmountInputFormatter }
			/>
		</div>
		<SubmitValues
			amount={ getSubmitAmount() }
			interval={ paymentInterval }
			paymentType={ paymentMethod }
		/>
	</form>;
}
