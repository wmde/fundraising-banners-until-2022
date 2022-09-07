import { h } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';
import classNames from 'classnames';

import TranslationContext from '../../../../../shared/components/TranslationContext';
import { SelectGroup } from './SelectGroup';
import SelectCustomAmount from './SelectCustomAmount';
import SmsBox from '../../../../../shared/components/ui/form/SmsBox';

import { isValid, isValidOrUnset } from '../../../../../shared/components/ui/form/hooks/validation_states';
import useAmountWithCustom from '../../../../../shared/components/ui/form/hooks/use_amount';
import useInterval from '../../../../../shared/components/ui/form/hooks/use_interval';
import useAddressType from './hooks/use_address_type';
import usePaymentMethod from '../../../../../shared/components/ui/form/hooks/use_payment_method';
import { amountMessage, validateRequired } from '../../../../../shared/components/ui/form/utils';
import { Intervals, PaymentMethods, AddressType } from '../FormItemsBuilder';
import SubmitValues from '../../../../../shared/components/ui/form/SubmitValues';
import ChevronRightIcon from '../ChevronRightIcon';
import useFormAction, { ADD_DONATION_URL, NEW_DONATION_URL } from '../../../../../shared/components/ui/form/hooks/use_form_action';

export default function DonationForm( props ) {
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
	const [ formAction, setUrl ] = useFormAction( props, { locale: 'en_GB', ast: '1' } );

	const isFormValid = () => {
		return isValid( intervalValidity ) && isValid( amountValidity ) && isValid( paymentMethodValidity ) && isValid( addressTypeValidity );
	};

	useEffect(
		() => {
			const someAddressData = addressType !== AddressType.NO.value;
			const paymentNeedsAddress = addressType === PaymentMethods.DIRECT_DEBIT;
			setUrl( someAddressData || paymentNeedsAddress ? NEW_DONATION_URL : ADD_DONATION_URL );
		},
		[ addressType, paymentMethod, setUrl ]
	);

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
		if ( e.target.value === PaymentMethods.DIRECT_DEBIT.value ) {
			setDisabledAddressTypes( [ AddressType.NO.value, AddressType.EMAIL.value ] );
		} else {
			setDisabledAddressTypes( [] );
		}
	};

	const onChangeAddressType = e => {
		setAddressType( e.target.value );
		if ( e.target.value !== AddressType.FULL.value ) {
			setDisabledPaymentMethods( [ PaymentMethods.DIRECT_DEBIT.value ] );
		} else {
			setDisabledPaymentMethods( [] );
		}
	};

	return <div className="form">
		<form method="post" name="donationForm" className="form__element" action={ formAction } onSubmit={ validate }>

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
						isValid={ isValidOrUnset( paymentMethodValidity )}
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

			<fieldset className="form__section">
				<legend className="form__section-head form__section-head--address-type">{ Translations[ 'address-type-label' ] }</legend>
				<div className="form-field-group">
					<SelectGroup
						fieldname="select-address-type"
						selectionItems={ props.formItems.addressType }
						isValid={ isValidOrUnset( addressTypeValidity )}
						errorMessage={ Translations[ 'no-type-statement-message' ] }
						currentValue={ addressType }
						onSelected={ onChangeAddressType }
						disabledOptions={ disabledAddressTypes }
						errorPosition={ props.errorPosition }
					>
					</SelectGroup>
				</div>
			</fieldset>

			<div className="submit-section button-group">
				<button className={ classNames( 'button-group__button', { 'is-valid': isFormValid() } ) } type="submit">
					<span className="button-group__label">{ Translations[ 'submit-label' ] } <ChevronRightIcon/></span>
				</button>
			</div>

			<SubmitValues
				amount={ props.formatters.amountForServerFormatter( numericAmount ) }
				interval={ paymentInterval }
				paymentType={ paymentMethod }
				addressType={ addressType }
			/>
		</form>
	</div>;
}
