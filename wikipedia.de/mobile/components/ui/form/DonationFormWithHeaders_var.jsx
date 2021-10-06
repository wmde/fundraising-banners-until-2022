// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import TranslationContext from '../../../../../shared/components/TranslationContext';
import { SelectGroup } from './SelectGroup_var';
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
import { AddressType } from './FormItemsBuilder';
import useAddressType from './hooks/use_address_type';
import useFormAction, { ADD_DONATION_URL, NEW_DONATION_URL } from '../../../../../shared/components/ui/form/hooks/use_form_action';

export default function DonationFormWithHeaders( props ) {
	const Translations = useContext( TranslationContext );
	const [ paymentInterval, setInterval, intervalValidity, setIntervalValidity ] = useInterval( null );
	const [ paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity ] = usePaymentMethod( null );
	const [
		{ numericAmount, amountValidity, selectedAmount, customAmount },
		{ selectAmount, updateCustomAmount, validateCustomAmount, setAmountValidity }
	] = useAmountWithCustom( null, props.formatters.customAmountInputFormatter );
	const [ addressType, setAddressType, addressTypeValidity, setAddressTypeValidity ] = useAddressType( null );
	const [ disabledIntervals, setDisabledIntervals ] = useState( [] );
	const [ disabledPaymentMethods, setDisabledPaymentMethods ] = useState( [] );
	const [ disabledAddressTypes, setDisabledAddressTypes ] = useState( [] );
	const [ formAction, setUrl ] = useFormAction( props, { provadd: 1 } );

	useEffect(
		() => setUrl( addressType !== AddressType.NO.value ? NEW_DONATION_URL : ADD_DONATION_URL ),
		[ addressType ]
	);

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

	const validate = e => {
		if ( [
			[ intervalValidity, setIntervalValidity ],
			[ amountValidity, setAmountValidity ],
			[ paymentMethodValidity, setPaymentMethodValidity ],
			[ addressTypeValidity, setAddressTypeValidity ]
		].map( validateRequired ).every( isValid ) ) {
			props.onSubmit();
			return;
		}
		e.preventDefault();
	};

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

		if ( e.target.value === PaymentMethods.DIRECT_DEBIT.value ) {
			setDisabledAddressTypes( [ AddressType.EMAIL.value, AddressType.NO.value ] );
		} else {
			setDisabledAddressTypes( [] );
		}
	};

	const onChangeAddressType = e => {
		setAddressType( e.target.value );

		if ( e.target.value === AddressType.FULL.value ) {
			removeDisabledPaymentMethod( PaymentMethods.DIRECT_DEBIT.value );
		} else {
			addDisabledPaymentMethod( PaymentMethods.DIRECT_DEBIT.value );
		}
	};

	const getButtonText = () => {
		if ( addressType !== AddressType.NO.value ) {
			return Translations[ 'submit-label-default' ];
		}

		if ( paymentMethod === PaymentMethods.PAYPAL.value ) {
			return Translations[ 'submit-label-paypal' ];
		} else if ( paymentMethod === PaymentMethods.CREDIT_CARD.value ) {
			return Translations[ 'submit-label-credit-card' ];
		} else if ( paymentMethod === PaymentMethods.SOFORT.value ) {
			return Translations[ 'submit-label-sofort' ];
		} else if ( paymentMethod === PaymentMethods.BANK_TRANSFER.value ) {
			return Translations[ 'submit-label-bank-transfer' ];
		} else {
			return Translations[ 'submit-label-default' ];
		}
	};

	return <div className="form">
		<form method="post" name="donationForm" className="form__element"
			action={ formAction }>

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
				</div>
			</fieldset>

			<fieldset className="form__section">
				<legend className="form__section-head">{ Translations[ 'payments-header' ] }</legend>
				<div className="form-field-group">
					<SelectGroup
						fieldname="select-payment-method"
						selectionItems={ props.formItems.paymentMethods }
						isValid={ isValidOrUnset( paymentMethodValidity )}
						errorMessage={ Translations[ 'no-payment-type-message' ] }
						currentValue={ paymentMethod }
						onSelected={ onChangePaymentMethod }
						disabledOptions={ disabledPaymentMethods }
					>
						<SmsBox/>
					</SelectGroup>
				</div>
			</fieldset>

			<fieldset className="form__section">
				<legend className="form__section-head">{ Translations[ 'address-type-label' ] }</legend>
				<div className="form-field-group">
					<SelectGroup
						fieldname="address-option"
						selectionItems={ props.formItems.addressType }
						isValid={ isValidOrUnset( addressTypeValidity ) }
						errorMessage={ Translations[ 'address-type-error-message' ] }
						currentValue={ addressType }
						onSelected={ onChangeAddressType }
						disabledOptions={ disabledAddressTypes }
					>
					</SelectGroup>
				</div>
			</fieldset>

			<div className="submit-section button-group">
				<button className="button-group__button" onClick={ validate }>
					<span className="button-group__label">{ getButtonText() }</span>
				</button>
			</div>

			<Footer/>

			<SubmitValues
				amount={ props.formatters.amountForServerFormatter( numericAmount ) }
				interval={ paymentInterval }
				paymentType={ paymentMethod }
				addressType={ addressType }
			/>
		</form>
	</div>;
}
