// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import classNames from 'classnames';

import TranslationContext from '../../../../shared/components/TranslationContext';
import SelectGroup from '../../../../shared/components/ui/form/SelectGroup';
import SelectCustomAmount from '../../../../shared/components/ui/form/SelectCustomAmount';
import SmsBox from '../../../../shared/components/ui/form/SmsBox';

import { isValid, isValidOrUnset } from '../../../../shared/components/ui/form/hooks/validation_states';
import useAmountWithCustom from '../../../../shared/components/ui/form/hooks/use_amount';
import useInterval from '../../../../shared/components/ui/form/hooks/use_interval';
import usePaymentMethod from '../../../../shared/components/ui/form/hooks/use_payment_method';
import { amountMessage, validateRequired } from '../../../../shared/components/ui/form/utils';
import SubmitValues from '../../../../shared/components/ui/form/SubmitValues';
import { AddressType } from './FormItemsBuilder';
import { PaymentMethods } from '../../../../shared/components/ui/form/FormItemsBuilder';

const formSteps = Object.freeze( {
	ONE: Symbol( 'one' ),
	TWO: Symbol( 'two' )
} );

export default function MultiStepDonationForm( props ) {
	const Translations = useContext( TranslationContext );
	const [ paymentInterval, setInterval, intervalValidity, setIntervalValidity ] = useInterval( null );
	const [ paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity ] = usePaymentMethod( null );
	const [
		{ numericAmount, amountValidity, selectedAmount, customAmount },
		{ selectAmount, updateCustomAmount, validateCustomAmount, setAmountValidity }
	] = useAmountWithCustom( null, props.formatters.customAmountInputFormatter );
	const [ addressType, setAddressType ] = useState( AddressType.YES.value );
	const [ formStep, setFormStep ] = useState( formSteps.ONE );
	const disabledIntervals = [];
	const disabledPaymentMethods = [];
	let [ disabledAddressTypes, setDisabledAddressTypes ] = useState( [] );

	const onSubmitStep1 = e => {
		e.preventDefault();
		if ( [
			[ intervalValidity, setIntervalValidity ],
			[ amountValidity, setAmountValidity ],
			[ paymentMethodValidity, setPaymentMethodValidity ]
		].map( validateRequired ).every( isValid ) ) {
			setFormStep( formSteps.TWO );
		}
	};
	const onSubmitStep2 = () => {
		props.onSubmit();
	};
	const onFormBack = () => {
		setFormStep( formSteps.ONE );
	};
	const onFormInteraction = this.props.onFormInteraction ? e => this.props.onFormInteraction( e ) : () => {};
	const changePaymentMethod = e => {
		setPaymentMethod( e.target.value );
		setAddressType( AddressType.YES.value );
		if ( e.target.value === PaymentMethods.DIRECT_DEBIT.value ) {
			setDisabledAddressTypes( [ AddressType.YES.value, AddressType.NO.value ] );
		} else {
			setDisabledAddressTypes( [] );
		}
	};
	const getFormAction = () => {
		const piwick = '?piwik_campaign=' + props.campaignName + '&piwik_kwd=' + props.bannerName;
		if ( addressType === AddressType.YES.value ) {
			return 'https://spenden.wikimedia.de/donation/new' + piwick;
		}
		return 'https://spenden.wikimedia.de/donation/add' + piwick + '&mbt=1';
	};
	const getFormNotice = () => {
		if ( paymentMethod === PaymentMethods.DIRECT_DEBIT.value ) {
			return Translations[ 'address-type-notice-disabled' ];
		} else if ( addressType === AddressType.NO.value ) {
			return Translations[ 'address-type-notice-nein' ];
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
		} else if ( paymentMethod === PaymentMethods.BANK_TRANSFER.value ) {
			return Translations[ 'submit-label-bank-transfer' ];
		} else {
			return Translations[ 'submit-label-default' ];
		}
	};

	return <div className={ classNames( {
		'form': true,
		'is-step-2': formStep === formSteps.TWO
	} ) }>
		<form method="post" name="donationForm" className="form__element" onClick={ onFormInteraction }
			action={ getFormAction() }>

			<div className="form-field-group">
				<SelectGroup
					fieldname="select-interval"
					selectionItems={ props.formItems.intervals }
					isValid={ isValidOrUnset( intervalValidity ) }
					errorMessage={ Translations[ 'no-interval-message' ] }
					currentValue={ paymentInterval }
					onSelected={ e => setInterval( e.target.value ) }
					disabledOptions={ disabledIntervals }
				/>
			</div>

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

			<div className="form-field-group">
				<SelectGroup
					fieldname="select-payment-method"
					selectionItems={ props.formItems.paymentMethods }
					isValid={ isValidOrUnset( paymentMethodValidity )}
					errorMessage={ Translations[ 'no-payment-type-message' ] }
					currentValue={ paymentMethod }
					onSelected={ changePaymentMethod }
					disabledOptions={ disabledPaymentMethods }
				>
					<SmsBox/>
				</SelectGroup>
			</div>

			<div className="submit-section button-group">
				<button className="button-group__button" onClick={ onSubmitStep1 }>
					{ Translations[ 'submit-label-short' ] }
				</button>
			</div>

			<div className="form-step-2">

				<label className="form-step-2-label">
					<a href="#" className="back" onClick={ onFormBack }>
						<i className="back__arrow"></i>
					</a>
					<div>
						{ Translations[ 'address-type-label' ] }
						<span className="form-step-2-notice"><br/>{ getFormNotice() }</span>
					</div>
				</label>

				<div className="form-step-2-content">
					<div className="form-step-2-field">

						<div className="form-field-group">
							<SelectGroup
								fieldname="address-option"
								selectionItems={ props.formItems.addressType }
								isValid={ true }
								currentValue={ addressType }
								onSelected={ e => setAddressType( e.target.value ) }
								disabledOptions={ disabledAddressTypes }
							>
							</SelectGroup>
						</div>
					</div>

					<div className="submit-section button-group form-step-2-button">
						<button className="button-group__button" onClick={ onSubmitStep2 }>
							{ getButtonText() }
						</button>
					</div>
				</div>

			</div>

			<SubmitValues
				addressType={ addressType === AddressType.NO.value ? 'anonym' : 'person' }
				amount={ props.formatters.amountForServerFormatter( numericAmount ) }
				interval={ paymentInterval }
				paymentType={ paymentMethod }
				impressionCounts={ props.impressionCounts }
			/>
		</form>
	</div>;
}
