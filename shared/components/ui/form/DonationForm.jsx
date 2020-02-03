// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useContext } from 'preact/hooks';

import TranslationContext from '../../TranslationContext';
import SelectGroup from './SelectGroup';
import SelectCustomAmount from './SelectCustomAmount';
import SmsBox from './SmsBox';

import { isValid, isValidOrUnset } from './hooks/validation_states';
import useAmountWithCustom from './hooks/use_amount';
import useInterval from './hooks/use_interval';
import usePaymentMethod from './hooks/use_payment_method';
import { amountMessage, validateRequired } from './utils';

export default function DonationForm( props ) {
	const Translations = useContext( TranslationContext );
	const [ paymentInterval, setInterval, intervalValidity, setIntervalValidity ] = useInterval( null );
	const [ paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity ] = usePaymentMethod( null );
	const [
		{ numericAmount, amountValidity, selectedAmount, customAmount },
		{ selectAmount, updateCustomAmount, validateCustomAmount, setAmountValidity }
	] = useAmountWithCustom( null, props.formatters.amountInputFormatter );
	const disabledIntervals = [];
	const disabledPaymentMethods = [];

	const validate = e => {
		if ( [
			[ intervalValidity, setIntervalValidity ],
			[ amountValidity, setAmountValidity ],
			[ paymentMethodValidity, setPaymentMethodValidity ]
		].map( validateRequired ).every( isValid ) ) {
			return;
		}
		e.preventDefault();
	};
	const onFormInteraction = this.props.onFormInteraction ? e => this.props.onFormInteraction( e ) : () => {};

	return <div className="form">
		<form method="post" name="donationForm" className="form__element" onClick={ onFormInteraction }
			action={ 'https://spenden.wikimedia.de/donation/new?piwik_campaign=' + props.campaignName + '&piwik_kwd=' + props.bannerName}>

			<div className="form-field-group">
				<SelectGroup
					fieldname="interval"
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
					fieldname="amount"
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
					fieldname="payment-method"
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

			<input type="hidden" name="betrag" value={ props.formatters.amountForServerFormatter( numericAmount ) } />
			<input type="hidden" name="periode" value={ paymentInterval } />
			<input type="hidden" name="zahlweise" value={ paymentMethod } />
			<input type="hidden" name="impCount" value={ props.impressionCounts.overallCount }/>
			<input type="hidden" name="bImpCount" value={ props.impressionCounts.bannerCount }/>
		</form>
	</div>;
}
