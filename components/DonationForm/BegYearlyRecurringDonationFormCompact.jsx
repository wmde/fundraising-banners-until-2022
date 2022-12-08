import { createRef, h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import TranslationContext from '../../shared/components/TranslationContext';
import { SelectGroup } from './subcomponents/SelectGroup';
import SelectCustomAmount from './subcomponents/SelectCustomAmount';
import SubmitValues from './subcomponents/SubmitValues';
import SmsBox from './subcomponents/SmsBox';

import { isValid, isValidOrUnset } from './hooks/validation_states';
import useAmountWithCustom from './hooks/use_amount';
import useInterval from './hooks/use_interval';
import usePaymentMethod from './hooks/use_payment_method';
import useAlternative, { Alternatives } from './hooks/use_alternative';
import useFormAction from './hooks/use_form_action';
import { amountMessage, validateRequired } from './utils';
import { Intervals, PaymentMethods } from '../../shared/components/ui/form/FormItemsBuilder';
import classNames from 'classnames';

const formSteps = Object.freeze( {
	ONE: Symbol( 'one' ),
	TWO: Symbol( 'two' )
} );

/**
 * The only difference between this and the BegYearlyRecurringDonationForm
 * is that the SMS notice needed to be moved under the select options.
 *
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
export default function BegYearlyRecurringDonationForm( props ) {
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
	const [ formAction ] = useFormAction( props, props.formActionProps ?? {} );
	const FormStep2 = props.formStep2;

	useEffect(
		() => {
			setStep1ButtonText( paymentInterval === Intervals.ONCE.value && paymentMethod !== PaymentMethods.SOFORT.value ?
				Translations[ 'submit-label-short' ] :
				Translations[ 'submit-label' ] );
		},
		[ paymentInterval, paymentMethod, Translations ]
	);

	const scrollToTopOfStep2 = () => {
		document.getElementsByClassName( 'wmde-banner-form-steps' )[ 0 ]?.scrollIntoView(
			{ behavior: 'smooth', block: 'center', inline: 'nearest' }
		);
	};

	const onSubmitStep1 = e => {
		if ( customAmount ) {
			validateCustomAmount( customAmount );
		}
		if ( [
			[ intervalValidity, setIntervalValidity ],
			[ amountValidity, setAmountValidity ],
			[ paymentMethodValidity, setPaymentMethodValidity ]
		].map( validateRequired ).every( isValid ) ) {
			if ( paymentInterval !== Intervals.ONCE.value || paymentMethod === PaymentMethods.SOFORT.value ) {
				props.onSubmit();
				return;
			}
			props.onPage2();
			setSecondPageAmount( customAmount ?? selectedAmount );
			setUpgradeToYearly( null );
			setFormStep( formSteps.TWO );
			scrollToTopOfStep2();
		}
		e?.preventDefault();
	};

	const onSubmitStep2 = e => {
		if ( [
			[ intervalValidity, setIntervalValidity ],
			[ amountValidity, setAmountValidity ],
			[ paymentMethodValidity, setPaymentMethodValidity ],
			[ upgradeToYearlyValidity, setUpgradeToYearlyValidity ]
		].map( validateRequired ).every( isValid ) ) {
			if ( upgradeToYearly === Alternatives.YES ) {
				props.onSubmitRecurring();
			} else {
				props.onSubmitNonRecurring();
			}
			return;
		}
		e?.preventDefault();
	};

	const onFormSubmit = e => {
		if ( formStep === formSteps.ONE ) {
			onSubmitStep1( e );
		} else {
			onSubmitStep2( e );
		}
	};

	const onFormBack = e => {
		e.preventDefault();
		setFormStep( formSteps.ONE );
	};

	const onFormBackToYearly = e => {
		setInterval( Intervals.YEARLY.value );
		props.onChangeToYearly();
		onFormBack( e );
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

	const formRef = createRef();

	return <form
		method="post"
		name="donationForm"
		onClick={ onFormInteraction }
		onSubmit={ onFormSubmit }
		action={ formAction }
		ref={ formRef }
		className={ classNames(
			'wmde-banner-form',
			{ 'wmde-banner-form--is-step-2': formStep === formSteps.TWO }
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
						<div className="wmde-banner-sms-box-notice">{ Translations[ 'sms-info-message' ] }</div>
					</SelectGroup>
				</fieldset>

				<div className="wmde-banner-form-button-container">
					<button className="wmde-banner-form-button" type="submit">
						{ step1ButtonText }
					</button>
				</div>
			</div>

			<FormStep2
				onFormBack={ onFormBack }
				onSubmit={ onFormSubmit }
				formRef={ formRef }
				onChooseUpgradeToYearly={ onChooseUpgradeToYearly }
				onFormBackToYearly={ onFormBackToYearly }
				secondPageAmount={ secondPageAmount }
				upgradeToYearly={ upgradeToYearly }
				isValid={ isValidOrUnset( upgradeToYearlyValidity ) }
			/>
		</div>

		<SubmitValues
			amount={ props.formatters.amountForServerFormatter( numericAmount ) }
			interval={ paymentInterval }
			paymentType={ paymentMethod }
		/>
	</form>;
}
