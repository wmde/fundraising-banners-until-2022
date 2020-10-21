// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useContext } from 'preact/hooks';

import TranslationContext from '../../../../shared/components/TranslationContext';
import { SelectGroup } from '../../../../shared/components/ui/form/SelectGroup';
import SelectCustomAmount from '../../../../shared/components/ui/form/SelectCustomAmount';
import SmsBox from '../../../../shared/components/ui/form/SmsBox';

import { isValid, isValidOrUnset } from '../../../../shared/components/ui/form/hooks/validation_states';
import useAmountWithCustom from '../../../../shared/components/ui/form/hooks/use_amount';
import useInterval from '../../../../shared/components/ui/form/hooks/use_interval';
import usePaymentMethod from '../../../../shared/components/ui/form/hooks/use_payment_method';
import { amountMessage, validateRequired } from '../../../../shared/components/ui/form/utils';
import SubmitValues from './SubmitValues';

export default function DonationForm( props ) {
	const Translations = useContext( TranslationContext );
	const [ paymentInterval, setInterval, intervalValidity, setIntervalValidity ] = useInterval( null );
	const [ paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity ] = usePaymentMethod( null );
	const [
		{ numericAmount, amountValidity, selectedAmount, customAmount },
		{ selectAmount, updateCustomAmount, validateCustomAmount, setAmountValidity }
	] = useAmountWithCustom( null, props.formatters.customAmountInputFormatter );
	const disabledIntervals = [];
	const disabledPaymentMethods = [];

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

	const formActionParams = {
		piwik_campaign: props.campaignName,
		piwik_kwd: props.bannerName
	};

	const queryString = Object.keys( formActionParams )
		.map( key => `${key}=${formActionParams[ key ]}` )
		.join( '&' );

	return <div className="form">
		<form method="post" name="donationForm" className="form__element" onClick={ onFormInteraction }
			action={ 'https://spenden.wikimedia.de/donation/new?' + queryString }>

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
				<legend className="form__section-head">Die durchschnittliche Spende beträgt 22,81 €.</legend>
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
					onSelected={ e => setPaymentMethod( e.target.value ) }
					disabledOptions={ disabledPaymentMethods }
				>
					<SmsBox/>
				</SelectGroup>
			</div>

			<div className="submit-section button-group">
				<button className="button-group__button" onClick={ validate }>
					<span className="button-group__label">{ Translations[ 'submit-label' ] }</span>
				</button>
			</div>

			<SubmitValues
				addressType={ '' }
				amount={ props.formatters.amountForServerFormatter( numericAmount ) }
				interval={ paymentInterval }
				paymentType={ paymentMethod }
				impressionCounts={ props.impressionCounts }
			/>
		</form>
	</div>;
}
