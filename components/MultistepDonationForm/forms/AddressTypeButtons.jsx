import { h } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import { propTypes } from './propTypes';
import { isValid } from '../../DonationForm/hooks/validation_states';
import { validateRequired } from '../../DonationForm/utils';
import { PaymentMethods, AddressTypes } from '../../DonationForm/FormItemsBuilder';
import TranslationContext from '../../../shared/components/TranslationContext';
import ChevronLeftIcon from '../../Icons/ChevronLeftIcon';
import classNames from 'classnames';

export default function AddressTypeButtons( props ) {
	const Translations = useContext( TranslationContext );
	const [ addressType, setAddressType, addressTypeValidity, setAddressTypeValidity ] = props.formModel.addressType;
	const [ paymentMethod, , , ] = props.formModel.paymentMethod;
	const [ disabledAddressTypes, setDisabledAddressTypes ] = useState( [] );

	const onEntered = () => {
		props.trackBannerEvent( 'address-type-form-page-shown' );
		if ( paymentMethod === PaymentMethods.DIRECT_DEBIT.value ) {
			setDisabledAddressTypes( [ AddressTypes.NO.value ] );
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

	// 1. The button clicks update the value of addressType.
	// 2. We watch the value of addressType for changes
	// 3. If the value is not null we know the user clicked a button so we submit the form
	useEffect( () => {
		if ( addressType !== null ) {
			if ( addressTypeIsValid() ) {
				props.onSubmit( props.step );
			}
		}
	}, [ addressType ] );

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

	const onSelectAddressType = e => {
		e.preventDefault();
		setAddressType( e.target.value );
	};

	return <form className="wmde-banner-sub-form wmde-banner-form-address-type">
		<a tabIndex="-1" href="#" className="wmde-banner-form-address-type-back" onClick={ onBack }>
			<ChevronLeftIcon/> { Translations[ 'back-button' ] }
		</a>

		<div className="wmde-banner-form-address-type-title">
			{ Translations[ 'address-type-label' ] }
		</div>

		<div className="wmde-banner-form-address-type-buttons">
			{ props.formItems.addressType.map( ( { value, label, notice } ) => (
				<div key={ value } className={ classNames( 'wmde-banner-form-address-type-button', {
					'wmde-banner-form-address-type-button--disabled': disabledAddressTypes.indexOf( value ) > -1
				} ) }>
					<button
						tabIndex="-1"
						className={ `wmde-banner-form-button t-submit-address-type-${value}` }
						onClick={ onSelectAddressType }
						value={ value }
						disabled={ disabledAddressTypes.indexOf( value ) > -1 }
					>
						{ label }
					</button>
					<div className="wmde-banner-form-address-type-button-notice">
						{ notice }
					</div>
				</div>
			) ) }
		</div>

		<div className="wmde-banner-form-address-type-notice">{ getFormNotice() }</div>
	</form>;
}

AddressTypeButtons.propTypes = propTypes;
