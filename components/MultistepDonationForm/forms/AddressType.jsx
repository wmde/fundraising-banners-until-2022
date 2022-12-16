import { h } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import { propTypes } from './propTypes';
import { SelectGroup } from '../../DonationForm/subcomponents/SelectGroup';
import { isValid, isValidOrUnset } from '../../DonationForm/hooks/validation_states';
import { validateRequired } from '../../DonationForm/utils';
import { PaymentMethods, AddressTypes } from '../../DonationForm/FormItemsBuilder';
import TranslationContext from '../../../shared/components/TranslationContext';
import ChevronLeftIcon from '../../Icons/ChevronLeftIcon';

export default function AddressType( props ) {
	const Translations = useContext( TranslationContext );
	const [ addressType, setAddressType, addressTypeValidity, setAddressTypeValidity ] = props.formModel.addressType;
	const [ paymentMethod, , , ] = props.formModel.paymentMethod;
	const [ disabledAddressTypes, setDisabledAddressTypes ] = useState( [] );

	const onEntered = () => {
		props.trackBannerEvent( 'address-type-form-page-shown' );
		if ( paymentMethod === PaymentMethods.DIRECT_DEBIT.value ) {
			setDisabledAddressTypes( [ AddressTypes.NO.value ] );
			if ( addressType === AddressTypes.NO.value ) {
				setAddressType( null );
			}
		} else {
			setDisabledAddressTypes( [] );
		}
	};

	useEffect( () => {
		if ( props.active ) {
			onEntered();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ props.active ] );

	const addressTypeIsValid = () => {
		return [
			[ addressTypeValidity, setAddressTypeValidity ]
		].map( validateRequired ).every( isValid );
	};

	const onSubmit = e => {
		e.preventDefault();
		if ( addressTypeIsValid() ) {
			props.onSubmit( props.step );
		}
	};

	const getFormNotice = () => {
		if ( paymentMethod === PaymentMethods.DIRECT_DEBIT.value ) {
			return Translations[ 'address-type-notice-direct-debit' ];
		}
		return '';
	};

	const onBack = ( e ) => {
		e.preventDefault();
		props.onBack( props.step );
	};

	const getButtonText = () => {
		if ( addressType !== AddressTypes.NO.value ) {
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

	return <form onSubmit={ onSubmit } className="wmde-banner-sub-form wmde-banner-form-address-type">
		<div className="wmde-banner-form-address-type-title">
			<a tabIndex="-1" href="#" className="back" onClick={ onBack }>
				<ChevronLeftIcon/>
			</a>
			{ Translations[ 'address-type-label' ] }
		</div>

		<fieldset className="wmde-banner-form-field-group">
			<legend className="wmde-banner-form-field-group-legend">{ Translations[ 'intervals-header' ] }</legend>
			<SelectGroup
				fieldname="address-option"
				selectionItems={ props.formItems.addressType }
				isValid={ isValidOrUnset( addressTypeValidity ) }
				errorMessage={ Translations[ 'address-type-error-message' ] }
				currentValue={ addressType }
				onSelected={ e => setAddressType( e.target.value ) }
				disabledOptions={ disabledAddressTypes }
				errorPosition={ props.errorPosition }
			/>
		</fieldset>

		<div className="wmde-banner-form-address-type-notice">{ getFormNotice() }</div>

		<div className="wmde-banner-form-button-container wmde-banner-form-address-type-button">
			<button tabIndex="-1" className="wmde-banner-form-button" type="submit">
				{ getButtonText() }
			</button>
		</div>
	</form>;
}

AddressType.propTypes = propTypes;
