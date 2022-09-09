import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import TranslationContext from '../../../../../shared/components/TranslationContext';
import { SelectGroup } from './SelectGroup';
import SelectCustomAmount from '../../../../../shared/components/ui/form/SelectCustomAmount';
import SmsBox from '../../../../../shared/components/ui/form/SmsBox';

import { isValid, isValidOrUnset } from '../../../../../shared/components/ui/form/hooks/validation_states';
import useAmountWithCustom from '../../../../../shared/components/ui/form/hooks/use_amount';
import useInterval from '../../../../../shared/components/ui/form/hooks/use_interval';
import usePaymentMethod from '../../../../../shared/components/ui/form/hooks/use_payment_method';
import { amountMessage, validateRequired } from '../../../../../shared/components/ui/form/utils';
import { Intervals, PaymentMethods } from '../../../../../shared/components/ui/form/FormItemsBuilder';
import SubmitValues from '../../../../../shared/components/ui/form/SubmitValues';
import Footer from '../../../../../shared/components/ui/EasySelectFooter';
import useFormAction from '../../../../../shared/components/ui/form/hooks/use_form_action';

export default function DonationFormWithHeaders( props ) {
	const Translations = useContext( TranslationContext );
	const [ paymentInterval, setInterval, intervalValidity, setIntervalValidity ] = useInterval( null );
	const [ paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity ] = usePaymentMethod( null );
	const [
		{ numericAmount, amountValidity, selectedAmount, customAmount },
		{ selectAmount, updateCustomAmount, validateCustomAmount, setAmountValidity }
	] = useAmountWithCustom( null, props.formatters.customAmountInputFormatter );
	const [ disabledIntervals, setDisabledIntervals ] = useState( [] );
	const [ disabledPaymentMethods, setDisabledPaymentMethods ] = useState( [] );
	const [ formAction ] = useFormAction( props );
	const [ isFormValid, setFormValidity ] = useState( true );

	useEffect( () => {
		setFormValidity( isValidOrUnset( intervalValidity ) && isValidOrUnset( amountValidity ) && isValidOrUnset( paymentMethodValidity ) );
	}, [ intervalValidity, amountValidity, paymentMethodValidity ] );

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

	const onChangeInterval = e => {
		setInterval( e.target.value );
		if ( e.target.value !== Intervals.ONCE.value ) {
			setDisabledPaymentMethods( [ PaymentMethods.SOFORT.value ] );
		} else {
			setDisabledPaymentMethods( [] );
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

	const getButtonText = () => {
		return Translations[ 'submit-label' ];
	};

	return <div className="form">
		<form method="post" name="donationForm" className="form__element" action={ formAction } onSubmit={ validate } >

			<fieldset className="form__section">
				<legend className="form__section-head">{ Translations[ 'intervals-header' ]}</legend>
				<div className="form-field-group">
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
				</div>
			</fieldset>

			<fieldset className="form__section">
				<legend className="form__section-head">{ Translations[ 'amounts-header' ]}</legend>
				<div className={ 'form-field-group' }>
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
				</div>
			</fieldset>

			<fieldset className="form__section">
				<legend className="form__section-head">{ Translations[ 'payments-header' ] }</legend>
				<div className="form-field-group">
					<SelectGroup
						fieldname="select-payment-method"
						selectionItems={ props.formItems.paymentMethods }
						isValid={ isValidOrUnset( paymentMethodValidity ) }
						errorMessage={ Translations[ 'no-payment-type-message' ] }
						currentValue={ paymentMethod }
						onSelected={ onChangePaymentMethod }
						disabledOptions={ disabledPaymentMethods }
						errorPosition={ props.errorPosition }
					>
						<SmsBox/>
					</SelectGroup>
				</div>
			</fieldset>

			<div className="submit-section button-group">
				<button className="button-group__button" type="submit">
					<span className="button-group__label">{ getButtonText() }</span>
				</button>
				{ !isFormValid && props.scrollToFirstError && (
					<button className="button-group__error" onClick={ props.scrollToFirstError }>{ Translations[ 'global-error' ] }</button>
				) }
			</div>

			<div className="smallprint">
				<span>
					<a className="application-of-funds-link"
						href={`https://spenden.wikimedia.de/use-of-funds?${ props.trackingParams }`}
						onClick={ props.toggleFundsModal } >Wohin geht meine Spende?</a>
				</span>
			</div>

			<Footer/>

			<SubmitValues
				amount={ props.formatters.amountForServerFormatter( numericAmount ) }
				interval={ paymentInterval }
				paymentType={ paymentMethod }
			/>
		</form>
	</div>;
}
