import { h } from 'preact';
import { useEffect, useContext, useState } from 'preact/hooks';
import { SelectGroup } from '../../DonationForm/subcomponents/SelectGroup';
import { isValid, isValidOrUnset } from '../../DonationForm/hooks/validation_states';
import { amountMessage, validateRequired } from '../../DonationForm/utils';
import SelectCustomAmount from '../../DonationForm/subcomponents/SelectCustomAmount';
import SmsBox from '../../DonationForm/subcomponents/SmsBox';
import TranslationContext from '../../../shared/components/TranslationContext';
import { propTypes } from './propTypes';
import { Intervals, PaymentMethods } from '../../../shared/components/ui/form/FormItemsBuilder';

export default function Donation( props ) {
	const Translations = useContext( TranslationContext );

	const {
		interval, setInterval, intervalValidity, setIntervalValidity,
		paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity,
		amountValidity, selectedAmount, customAmount,
		selectAmount, updateCustomAmount, validateAndSetCustomAmount, setAmountValidity,
		disabledIntervals, disabledPaymentMethods
	} = props.store;

	const [ isFormValid, setFormValidity ] = useState( true );
	const [ buttonText, setButtonText ] = useState( Translations[ 'submit-label' ] );

	useEffect( () => {
		setFormValidity( isValidOrUnset( intervalValidity ) && isValidOrUnset( amountValidity ) && isValidOrUnset( paymentMethodValidity ) );
	}, [ intervalValidity, amountValidity, paymentMethodValidity ] );

	useEffect(
		() => {
			setButtonText( interval === Intervals.ONCE.value && paymentMethod !== PaymentMethods.SOFORT.value ?
				Translations[ 'submit-label-short' ] :
				Translations[ 'submit-label' ] );
		},
		[ interval, paymentMethod, Translations ]
	);

	// check with side effects
	const paymentDataIsValid = () => {
		if ( customAmount ) {
			validateCustomAmount( customAmount );
		}
		return [
			[ intervalValidity, setIntervalValidity ],
			[ amountValidity, setAmountValidity ],
			[ paymentMethodValidity, setPaymentMethodValidity ]
		].map( validateRequired ).every( isValid );
	};

	const onSubmit = e => {
		e.preventDefault();
		if ( paymentDataIsValid() ) {
			props.onSubmit( props.step );
		}
	};

	return <form onSubmit={ onSubmit } className="wmde-banner-sub-form wmde-banner-sub-form-donation">
		<fieldset className="wmde-banner-form-field-group">
			<legend className="wmde-banner-form-field-group-legend">{ Translations[ 'intervals-header' ] }</legend>
			<SelectGroup
				fieldname="select-interval"
				selectionItems={ props.formItems.intervals }
				isValid={ isValidOrUnset( intervalValidity ) }
				errorMessage={ Translations[ 'no-interval-message' ] }
				currentValue={ interval }
				onSelected={ e => setInterval( e.target.value ) }
				disabledOptions={ disabledIntervals }
				errorPosition={ props.errorPosition }
			/>
		</fieldset>

		<fieldset className="wmde-banner-form-field-group">
			<legend className="wmde-banner-form-field-group-legend">{ Translations[ 'amounts-header' ] }</legend>
			<SelectGroup
				fieldname="select-amount"
				selectionItems={ props.formItems.amounts }
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
					onBlur={ e => validateAndSetCustomAmount( e.target.value ) }
					placeholder={ Translations[ 'custom-amount-placeholder' ] }
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
				isValid={ isValidOrUnset( paymentMethodValidity ) }
				errorMessage={ Translations[ 'no-payment-type-message' ] }
				currentValue={ paymentMethod }
				onSelected={ e => setPaymentMethod( e.target.value ) }
				disabledOptions={ disabledPaymentMethods }
				errorPosition={ props.errorPosition }
			>
				<SmsBox/>
			</SelectGroup>
		</fieldset>

		<div className="wmde-banner-form-button-container">
			<button className="wmde-banner-form-button" type="submit">{ buttonText }</button>
			{ !isFormValid && props.scrollToFirstError && (
				<button className="wmde-banner-form-button-error"
					onClick={ props.scrollToFirstError }>{ Translations[ 'global-error' ] }</button>
			) }
		</div>
	</form>;
}

Donation.propTypes = propTypes;
