import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import TranslationContext from '../../../shared/components/TranslationContext';
import { SelectGroup } from '../../../shared/components/ui/form/SelectGroup';
import SelectCustomAmount from '../../../shared/components/ui/form/SelectCustomAmount';
import SubmitValues from '../../../shared/components/ui/form/SubmitValues';
import SmsBox from '../../../shared/components/ui/form/SmsBox';

import { isValid, isValidOrUnset } from '../../../shared/components/ui/form/hooks/validation_states';
import useAmountWithCustom from '../../../shared/components/ui/form/hooks/use_amount';
import useInterval from '../../../shared/components/ui/form/hooks/use_interval';
import usePaymentMethod from '../../../shared/components/ui/form/hooks/use_payment_method';
import useAlternate, { Alternatives } from './use_alternative';
import { amountMessage, validateRequired } from '../../../shared/components/ui/form/utils';
import useFormAction from '../../../shared/components/ui/form/hooks/use_form_action';
import { Intervals, PaymentMethods } from '../../../shared/components/ui/form/FormItemsBuilder';
import classNames from 'classnames';
import ChevronLeftIcon from './ChevronLeftIcon';

const formSteps = Object.freeze( {
	ONE: Symbol( 'one' ),
	TWO: Symbol( 'two' )
} );

export default function MultiStepDonationForm( props ) {
	const Translations = useContext( TranslationContext );
	const [ paymentInterval, setInterval, intervalValidity, setIntervalValidity ] = useInterval( null );
	const [ paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity ] = usePaymentMethod( null );
	const [ alternative, setAlternative, alternativeValidity, setAlternativeValidity ] = useAlternate( null );
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

	return <div className="form">
		<form method="post" name="donationForm" className={ classNames(
			'form__element',
			{ 'is-step-2': formStep === formSteps.TWO }
		) } onClick={ onFormInteraction } onSubmit={ onFormSubmit } action={ formAction }>

			<div className="form-step-1">
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

				<div className="submit-section button-group">
					<button className="button-group__button" type="submit">
						<span className="button-group__label">{ step1ButtonText }</span>
					</button>
				</div>
			</div>

			<div className="form-step-2">

				<div className="form-step-label">
					<a href="banners/wikipedia.de/desktop/components/MultiStepDonationForm#" className="back" onClick={ onFormBack }>
						<ChevronLeftIcon/>
					</a>
					{ Translations[ 'form-step-2-header' ].replace( '{{amount}}', secondPageAmount ) }
				</div>
				<div className="form-step-2-notice">{ Translations[ 'form-step-2-copy' ] }</div>

				<div className="form-step-2-options">
					<div className={ classNames(
						'select-group-container',
						{ 'select-group-container--with-error': !isValidOrUnset( alternativeValidity ) }
					) }>
						<div className="select-group">
							<label className="select-group__option select-group__option-no">
								<input
									type="radio"
									onClick={ onChangeAlternative }
									checked={ alternative === Alternatives.NO }
									name="alternative"
									value={ Alternatives.NO }
									className="select-group__input"/>
								<span className="select-group__state">{ Translations[ 'form-step-2-no' ].replace( '{{amount}}', secondPageAmount ) }</span>
							</label>
							<label className="select-group__option select-group__option-yes">
								<input
									type="radio"
									onClick={ onChangeAlternative }
									checked={ alternative === Alternatives.YES }
									name="alternative"
									value={ Alternatives.YES }
									className="select-group__input"/>
								<span className="select-group__state">{ Translations[ 'form-step-2-yes' ].replace( '{{amount}}', secondPageAmount ) }</span>
							</label>
						</div>
						<span className="select-group__errormessage">
							<span className="select-group__erroricon">
								{ Translations[ 'form-step-2-error' ] }
							</span>
						</span>
					</div>
				</div>

				<a
					href="banners/wikipedia.de/desktop/components/MultiStepDonationForm#"
					className="form-step-2-custom"
					onClick={ onFormBackToYearly }>
					{ Translations[ 'form-step-2-link' ] }
				</a>

				<div className="submit-section button-group form-step-2-button">
					<button className="button-group__button" type="submit">
						<span className="button-group__label">{ Translations[ 'form-step-2-button' ] }</span>
					</button>
				</div>

			</div>

			<SubmitValues
				amount={ props.formatters.amountForServerFormatter( numericAmount ) }
				interval={ paymentInterval }
				paymentType={ paymentMethod }
			/>
		</form>
	</div>;
}
