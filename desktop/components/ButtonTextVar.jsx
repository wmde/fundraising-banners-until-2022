// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

import TranslationContext from '../../shared/components/TranslationContext';
import { AddressType } from './ui/form/FormItemsBuilder';
import { PaymentMethods } from '../../shared/components/ui/form/FormItemsBuilder';
import { useContext } from 'preact/hooks';

export default function ButtonTextVar( props ) {
	const Translations = useContext( TranslationContext );

	const getButtonText = () => {
		if ( props.addressType !== AddressType.NO.value ) {
			return Translations[ 'submit-label-default' ];
		}

		if ( props.paymentMethod === PaymentMethods.PAYPAL.value ) {
			return Translations[ 'submit-label-paypal' ];
		} else if ( props.paymentMethod === PaymentMethods.CREDIT_CARD.value ) {
			return Translations[ 'submit-label-credit-card' ];
		} else if ( props.paymentMethod === PaymentMethods.BANK_TRANSFER.value ) {
			return Translations[ 'submit-label-bank-transfer' ];
		} else {
			return Translations[ 'submit-label-default' ];
		}
	};

	return <span>{ getButtonText() }</span>;
}
