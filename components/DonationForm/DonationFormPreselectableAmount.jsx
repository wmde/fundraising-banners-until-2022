import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import TranslationContext from '../../shared/components/TranslationContext';
import { SelectGroup } from './subcomponents/SelectGroup';
import SelectCustomAmount from './subcomponents/SelectCustomAmount';
import SmsBox from './subcomponents/SmsBox';
import SubmitValues from './subcomponents/SubmitValues';

import useAmountWithCustom from './hooks/use_amount';
import useInterval from './hooks/use_interval';
import usePaymentMethod from './hooks/use_payment_method';
import useFormAction from './hooks/use_form_action';
import { isValid, isValidOrUnset } from './hooks/validation_states';
import { useDisabledFormValues } from './hooks/use_disabled_form_values';
import { amountMessage, validateRequired } from './utils';

export default function DonationFormPreselectableAmount( props ) {
	const Translations = useContext( TranslationContext );
	const [ paymentInterval, setInterval, intervalValidity, setIntervalValidity ] = useInterval( null );
	const [ paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity ] = usePaymentMethod( null );
	const [
		{ numericAmount, amountValidity, selectedAmount, customAmount },
		{ selectAmount, updateCustomAmount, validateCustomAmount, setAmountValidity }
	] = useAmountWithCustom( props.preselectedAmount, props.formatters.customAmountInputFormatter );
	const [ disabledIntervals, disabledPaymentMethods ] = useDisabledFormValues( paymentInterval, paymentMethod );
	const [ formAction ] = useFormAction( props, props.formActionProps ?? {} );
	const [ isFormValid, setFormValidity ] = useState( true );

	useEffect( () => {
		setFormValidity( isValidOrUnset( intervalValidity ) && isValidOrUnset( amountValidity ) && isValidOrUnset( paymentMethodValidity ) );
	}, [ intervalValidity, amountValidity, paymentMethodValidity ] );

	useEffect( () => {
		if ( props.preselectedAmount ) {
			selectAmount( props.preselectedAmount );
		}
		/* eslint-disable-next-line */
	}, [ props.preselectedAmount ] );

	const validate = e => {
		if ( [
			[ intervalValidity, setIntervalValidity ],
			[ amountValidity, setAmountValidity ],
			[ paymentMethodValidity, setPaymentMethodValidity ]
		].map( validateRequired ).every( isValid ) ) {
			props.onSubmit();
			return;
		}
		e.preventDefault();
	};

	const onFormInteraction = this.props.onFormInteraction ? e => this.props.onFormInteraction( e ) : () => {};

	return <form
		method="post"
		name="donationForm"
		className="wmde-banner-form"
		onClick={ onFormInteraction }
		action={ formAction }
		onSubmit={ validate }
	>
		<fieldset className="wmde-banner-form-field-group">
			<legend className="wmde-banner-form-field-group-legend">{ Translations[ 'intervals-header' ]}</legend>
			<SelectGroup
				fieldname="select-interval"
				selectionItems={ props.formItems.intervals }
				isValid={ isValidOrUnset( intervalValidity ) }
				errorMessage={ Translations[ 'no-interval-message' ] }
				currentValue={ paymentInterval }
				onSelected={ e => setInterval( e.target.value ) }
				disabledOptions={ disabledIntervals }
				errorPosition={ props.errorPosition }
			/>
		</fieldset>

		<fieldset className="wmde-banner-form-field-group">
			<legend className="wmde-banner-form-field-group-legend">{ Translations[ 'amounts-header' ]}</legend>
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
					onInput={ e => {
						updateCustomAmount( e.target.value );
						validateCustomAmount( e.target.value );
					} }
					onBlur={ e => {
						validateCustomAmount( e.target.value );
					} }
					placeholder={ props.customAmountPlaceholder }
					language={
						/* eslint-disable-next-line dot-notation */
						Translations[ 'LANGUAGE' ]
					}
					o
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
			<button className="wmde-banner-form-button" type="submit">
				{ Translations[ 'submit-label' ] }
			</button>
			{ !isFormValid && props.scrollToFirstError && (
				<button className="wmde-banner-form-button-error" onClick={ props.scrollToFirstError }>{ Translations[ 'global-error' ] }</button>
			) }
		</div>

		<SubmitValues
			amount={ props.formatters.amountForServerFormatter( numericAmount ) }
			interval={ paymentInterval }
			paymentType={ paymentMethod }
			impressionCounts={ props.impressionCounts }
		/>
	</form>;
}
