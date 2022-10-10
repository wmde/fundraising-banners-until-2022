import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import TranslationContext from '../../shared/components/TranslationContext';
import { SelectGroup } from './SelectGroup';
import SelectCustomAmount from './SelectCustomAmount';
import SubmitValues from './SubmitValues';
import SmsBox from './SmsBox';

import { isValid, isValidOrUnset } from './hooks/validation_states';
import useAmountWithCustom from './hooks/use_amount';
import useInterval from './hooks/use_interval';
import usePaymentMethod from './hooks/use_payment_method';
import useAlternative, { Alternatives } from './hooks/use_alternative';
import useFormAction from './hooks/use_form_action';
import { amountMessage, validateRequired } from './utils';
import { Intervals, PaymentMethods } from '../../shared/components/ui/form/FormItemsBuilder';
import classNames from 'classnames';
import ChevronLeftIcon from '../Icons/ChevronLeftIcon';

const formSteps = Object.freeze( {
	ONE: Symbol( 'one' ),
	TWO: Symbol( 'two' )
} );

export default function BegYearlyRecurringDonationForm( props ) {
	const Translations = useContext( TranslationContext );
	const [ paymentInterval, setInterval, intervalValidity, setIntervalValidity ] = useInterval( null );
	const [ paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity ] = usePaymentMethod( null );
	const [ alternative, setAlternative, alternativeValidity, setAlternativeValidity ] = useAlternative( null );
	const [
		{ numericAmount, amountValidity, selectedAmount, customAmount },
		{ selectAmount, updateCustomAmount, validateCustomAmount, setAmountValidity }
	] = useAmountWithCustom( null, props.formatters.customAmountInputFormatter );
	const [ formStep, setFormStep ] = useState( formSteps.ONE );
	const [ disabledIntervals, setDisabledIntervals ] = useState( [] );
	const [ disabledPaymentMethods, setDisabledPaymentMethods ] = useState( [] );
	const [ step1ButtonText, setStep1ButtonText ] = useState( Translations[ 'submit-label' ] );
	const [ secondPageAmount, setSecondPageAmount ] = useState( '0' );
	const [ formAction ] = useFormAction( props );

	useEffect(
		() => setStep1ButtonText( paymentInterval === Intervals.ONCE.value ? Translations[ 'submit-label-short' ] : Translations[ 'submit-label' ] ),
		[ paymentInterval, Translations ]
	);

	const onSubmitStep1 = e => {
		if ( [
			[ intervalValidity, setIntervalValidity ],
			[ amountValidity, setAmountValidity ],
			[ paymentMethodValidity, setPaymentMethodValidity ]
		].map( validateRequired ).every( isValid ) ) {
			if ( paymentInterval !== Intervals.ONCE.value ) {
				props.onSubmit();
				return;
			}
			setSecondPageAmount( customAmount ?? selectedAmount );
			setAlternative( null );
			setFormStep( formSteps.TWO );
		}
		e.preventDefault();
	};

	const onSubmitStep2 = e => {
		if ( [
			[ intervalValidity, setIntervalValidity ],
			[ amountValidity, setAmountValidity ],
			[ paymentMethodValidity, setPaymentMethodValidity ],
			[ alternativeValidity, setAlternativeValidity ]
		].map( validateRequired ).every( isValid ) ) {
			if ( alternative === Alternatives.YES ) {
				props.onSubmitRecurring?.call();
			} else {
				props.onSubmitNonRecurring?.call();
			}
			props.onSubmit();
			return;
		}
		e.preventDefault();
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
		props.onSubmitChangeToYearly?.call();
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

	const onChangeAlternative = e => {
		setAlternative( e.target.value );

		if ( e.target.value === Alternatives.YES ) {
			setInterval( Intervals.YEARLY.value );
		}
	};

	return <form
		method="post"
		name="donationForm"
		onClick={ onFormInteraction }
		onSubmit={ onFormSubmit }
		action={ formAction }
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
							onInput={ e => { updateCustomAmount( e.target.value ); validateCustomAmount( e.target.value ); } }
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
					<button className="wmde-banner-form-button" type="submit">
						{ step1ButtonText }
					</button>
				</div>
			</div>

			<div className="wmde-banner-form-step-2">

				<div className="wmde-banner-form-step-2-title">
					<a href="banners/wikipedia.de/desktop/components/MultiStepDonationForm#" className="back" onClick={ onFormBack }>
						<ChevronLeftIcon/>
					</a>
					{ Translations[ 'form-step-2-header' ].replace( '{{amount}}', secondPageAmount ) }
				</div>
				<div className="wmde-banner-form-step-2-notice">{ Translations[ 'form-step-2-copy' ] }</div>

				<div className="wmde-banner-form-step-2-options">
					<div className={ classNames(
						'wmde-banner-select-group-container',
						{ 'wmde-banner-select-group-container--with-error': !isValidOrUnset( alternativeValidity ) }
					) }>
						<div className="wmde-banner-select-group">
							<div className="wmde-banner-select-group-option wmde-banner-select-group-option-no">
								<label>
									<input
										type="radio"
										onClick={ onChangeAlternative }
										checked={ alternative === Alternatives.NO }
										name="alternative"
										value={ Alternatives.NO }
										className="wmde-banner-select-group-input"/>
									<span className="wmde-banner-select-group-label">{ Translations[ 'form-step-2-no' ].replace( '{{amount}}', secondPageAmount ) }</span>
								</label>
							</div>
							<div className="wmde-banner-select-group-option wmde-banner-select-group-option-yes">
								<label>
									<input
										type="radio"
										onClick={ onChangeAlternative }
										checked={ alternative === Alternatives.YES }
										name="alternative"
										value={ Alternatives.YES }
										className="wmde-banner-select-group-input"/>
									<span className="wmde-banner-select-group-label">{ Translations[ 'form-step-2-yes' ].replace( '{{amount}}', secondPageAmount ) }</span>
								</label>
							</div>
						</div>
						<span className="wmde-banner-select-group-error-message">
							<span className="wmde-banner-error-icon">
								{ Translations[ 'form-step-2-error' ] }
							</span>
						</span>
					</div>
				</div>

				<a
					href="banners/wikipedia.de/desktop/components/MultiStepDonationForm#"
					className="wmde-banner-form-step-2-custom"
					onClick={ onFormBackToYearly }>
					{ Translations[ 'form-step-2-link' ] }
				</a>

				<div className="wmde-banner-form-button-container form-step-2-button">
					<button className="wmde-banner-form-button" type="submit">
						{ Translations[ 'form-step-2-button' ] }
					</button>
				</div>

			</div>
		</div>

		<SubmitValues
			amount={ props.formatters.amountForServerFormatter( numericAmount ) }
			interval={ paymentInterval }
			paymentType={ paymentMethod }
		/>
	</form>;
}
