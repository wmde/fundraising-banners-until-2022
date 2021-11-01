import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import TranslationContext from '../../../../shared/components/TranslationContext';
import { SelectGroup } from '../../../../shared/components/ui/form/SelectGroup';
import SelectCustomAmount from '../../../../shared/components/ui/form/SelectCustomAmount';
import SubmitValues from '../../../../shared/components/ui/form/SubmitValues';
import SmsBox from '../../../../shared/components/ui/form/SmsBox';

import { isValid, isValidOrUnset } from '../../../../shared/components/ui/form/hooks/validation_states';
import useAmountWithCustom from '../../../../shared/components/ui/form/hooks/use_amount';
import useInterval from '../../../../shared/components/ui/form/hooks/use_interval';
import usePaymentMethod from '../../../../shared/components/ui/form/hooks/use_payment_method';
import useAddressType from './hooks/use_address_type';
import { amountMessage, validateRequired } from '../../../../shared/components/ui/form/utils';
import useFormAction, { ADD_DONATION_URL, NEW_DONATION_URL } from '../../../../shared/components/ui/form/hooks/use_form_action';
import { AddressType, Intervals, PaymentMethods } from '../../../../pad_english/components/ui/form/FormItemsBuilder';
import classNames from 'classnames';

export default function MultiStepDonationForm( props ) {
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
	const [ formAction, setUrl ] = useFormAction( props, { ast: 1 } );

	useEffect(
		() => setUrl( addressType !== AddressType.NO.value ? NEW_DONATION_URL : ADD_DONATION_URL ),
		[ addressType, setUrl ]
	);

	const onSubmitForm = e => {
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

	const getFormNotice = () => {
		if ( paymentMethod === PaymentMethods.DIRECT_DEBIT.value ) {
			return Translations[ 'address-type-notice-direct-debit' ];
		}
		return '';
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
		}
		return Translations[ 'submit-label-default' ];
	};

	return <form method="post" name="donationForm" className="banner__form" onClick={ onFormInteraction } action={ formAction }>
		<div className="form-step-1">
			<div className="form-step-label">{ Translations[ 'address-label-step-1' ] }</div>

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
					onInput={ e => updateCustomAmount( e.target.value ) }
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
		</div>

		<div className="form-step-2">

			<div className="form-step-label">{ Translations[ 'address-label-step-2' ] }</div>
			<div className="form-step-2-notice">{ getFormNotice() }</div>

			<div className={ classNames(
				'select-group-container--address-option',
				'select-group-container',
				{ 'select-group-container--with-error': !isValidOrUnset( addressTypeValidity ) }
			) }>

				<div className="select-group">
					{ props.formItems.addressType.map( ( { value, label, notice } ) => (
						<label key={ value } className={ classNames(
							'select-group__option',
							{ 'select-group__disabled': disabledAddressTypes.indexOf( value ) > -1 }
						) }>
							<input
								type="radio"
								onClick={ onChangeAddressType }
								checked={ value === addressType }
								name="address-option"
								value={ value }
								disabled={ disabledAddressTypes.indexOf( value ) > -1 }
								className="select-group__input"/>
							<span className="select-group__state">
								{ label || value }
								{ notice ? <span className="select-group__notice"><br/>({ notice })</span> : null }
							</span>
						</label>
					) ) }
				</div>

				<span className="select-group__errormessage">
					<span className="select-group__erroricon">
						{ Translations[ 'address-type-error-message' ] }
					</span>
				</span>

			</div>

			<div className="submit-section button-group form-step-2-button">
				<button className="button-group__button" onClick={ onSubmitForm }>
					<span className="button-group__label">{ getButtonText() }</span>
				</button>
				<a className="application-of-funds-link" onClick={ props.showFundsModal }>
					{ Translations[ 'use-of-funds-link' ] }
				</a>
			</div>

		</div>

		<SubmitValues
			addressType={ addressType }
			amount={ props.formatters.amountForServerFormatter( numericAmount ) }
			interval={ paymentInterval }
			paymentType={ paymentMethod }
		/>
	</form>;
}
