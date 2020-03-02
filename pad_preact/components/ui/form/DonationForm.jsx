// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';

import TranslationContext from '../../../../shared/components/TranslationContext';
import SelectGroup from './SelectGroup';
import SelectCustomAmount from '../../../../shared/components/ui/form/SelectCustomAmount';
import SubmitValues from '../../../../shared/components/ui/form/SubmitValues';

import { isValid, isValidOrUnset } from '../../../../shared/components/ui/form/hooks/validation_states';
import useAmountWithCustom from '../../../../shared/components/ui/form/hooks/use_amount';
import useInterval from '../../../../shared/components/ui/form/hooks/use_interval';
import usePaymentMethod from '../../../../shared/components/ui/form/hooks/use_payment_method';
import useAddressOption from './hooks/use_address_option';
import { amountMessage, validateRequired } from '../../../../shared/components/ui/form/utils';
import { GiveAddressOptions } from './FormItemsBuilder';

function getAddressOptionMessage( paymentMethod, addressOption, translations ) {
	if ( paymentMethod === 'BEZ' ) {
		return translations[ 'anonymous-BEZ-info-message' ];
	}
	if ( addressOption === GiveAddressOptions.NO.value ) {
		return translations[ 'address-type-info-message' ];
	}
	return null;
}

export default function DonationForm( props ) {
	const Translations = useContext( TranslationContext );
	const [ paymentInterval, setInterval, intervalValidity, setIntervalValidity ] = useInterval( null );
	const [ paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity ] = usePaymentMethod( null );
	const [ addressOption, setAddressOption, addressOptionValidity, setAddressOptionValidity ] = useAddressOption( null );
	const [
		{ numericAmount, amountValidity, selectedAmount, customAmount },
		{ selectAmount, updateCustomAmount, validateCustomAmount, setAmountValidity }
	] = useAmountWithCustom( null, props.formatters.amountInputFormatter );
	const disabledIntervals = [];
	const disabledPaymentMethods = [];
	const [ disabledGiveAddressOptions, setdisabledGiveAddressOptions ] = useState( [] );

	const validate = e => {
		if ( [
			[ intervalValidity, setIntervalValidity ],
			[ amountValidity, setAmountValidity ],
			[ paymentMethodValidity, setPaymentMethodValidity ],
			[ addressOptionValidity, setAddressOptionValidity ]
		].map( validateRequired ).every( isValid ) ) {
			return;
		}
		e.preventDefault();
	};

	const onChangePaymentMethod = e => {
		setPaymentMethod( e.target.value );
		if ( e.target.value === 'BEZ' ) {
			setAddressOption( GiveAddressOptions.YES.value );
			setdisabledGiveAddressOptions( [ GiveAddressOptions.NO.value ] );
		} else {
			setdisabledGiveAddressOptions( [] );
		}
	};

	const formAction = addressOption === GiveAddressOptions.YES.value ?
		'https://spenden.wikimedia.de/donation/new' : 'https://spenden.wikimedia.de/donation/add';

	const onFormInteraction = this.props.onFormInteraction ? e => this.props.onFormInteraction( e ) : () => {};

	return <div className="form">
		<form method="post" name="donationForm" className="form__element" onClick={ onFormInteraction }
			action={ formAction + '?piwik_campaign=' + props.campaignName + '&piwik_kwd=' + props.bannerName + '&mbt=1'}>

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
						value={ customAmount }
						onInput={ e => updateCustomAmount( e.target.value ) }
						onBlur={ e => validateCustomAmount( e.target.value ) }
						placeholder={ Translations[ 'custom-amount-placeholder' ] }
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
					onSelected={ onChangePaymentMethod }
					disabledOptions={ disabledPaymentMethods }
				>
					<div className="sms-box">
						<label className="select-group__option">
							<a href="sms:81190" className="select-group__state">{ Translations[ 'sms-payment-message' ] }</a>
						</label>
						<span>{ Translations[ 'sms-info-message' ] }</span>
					</div>
				</SelectGroup>
			</div>

			<div className="form-field-group">
				<span className="section-title">Wollen Sie Ihre Kontaktdaten angeben?</span>
				<SelectGroup
					fieldname="address-option"
					selectionItems={ props.formItems.giveAddressOptions }
					isValid={ isValidOrUnset( addressOptionValidity )}
					infoMessage={ getAddressOptionMessage( paymentMethod, addressOption, Translations ) }
					errorMessage={ Translations[ 'no-address-type-message' ] }
					currentValue={ addressOption }
					onSelected={ e => setAddressOption( e.target.value ) }
					disabledOptions={ disabledGiveAddressOptions }
				>
				</SelectGroup>
			</div>

			<div className="submit-section button-group">
				<button className="button-group__button" onClick={ validate }>
					<span className="button-group__label">{ Translations[ 'submit-label' ] }</span>
				</button>
			</div>

			<SubmitValues
				addressType={ addressOption === GiveAddressOptions.NO.value ? 'anonym' : 'person' }
				amount={ props.formatters.amountForServerFormatter( numericAmount ) }
				interval={ paymentInterval }
				paymentType={ paymentMethod }
				impressionCounts={ props.impressionCounts }
			/>

		</form>
	</div>;
}
