// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';

import TranslationContext from '../../../../shared/components/TranslationContext';
import SelectGroup from '../../../../shared/components/ui/form/SelectGroup';
import SelectCustomAmount from '../../../../shared/components/ui/form/SelectCustomAmount';
import SmsBox from '../../../../shared/components/ui/form/SmsBox';

import { isValid, isValidOrUnset } from '../../../../shared/components/ui/form/hooks/validation_states';
import useAmountWithCustom from '../../../../shared/components/ui/form/hooks/use_amount';
import useInterval from '../../../../shared/components/ui/form/hooks/use_interval';
import usePaymentMethod from '../../../../shared/components/ui/form/hooks/use_payment_method';
import { amountMessage, validateRequired } from '../../../../shared/components/ui/form/utils';
import { Intervals, PaymentMethods } from '../../../../shared/components/ui/form/FormItemsBuilder';

export default function DonationFormWithHeaders( props ) {
	const Translations = useContext( TranslationContext );
	const [ paymentInterval, setInterval, intervalValidity, setIntervalValidity ] = useInterval( null );
	const [ paymentMethod, setPaymentMethod, paymentMethodValidity, setPaymentMethodValidity ] = usePaymentMethod( null );
	const [
		{ numericAmount, amountValidity, selectedAmount, customAmount },
		{ selectAmount, updateCustomAmount, validateCustomAmount, setAmountValidity }
	] = useAmountWithCustom( null, props.formatters.amountInputFormatter );
	const [ disabledIntervals, setDisabledIntervals ] = useState( [] );
	const [ disabledPaymentMethods, setDisabledPaymentMethods ] = useState( [] );

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
	};

	return <div className="form">
		<form method="post" name="donationForm" className="form__element"
			action={ 'https://spenden.wikimedia.de/donation/new?piwik_campaign=' + props.campaignName + '&piwik_kwd=' + props.bannerName}>

			<fieldset className="form__section">
				<legend className="form__section-head">{ Translations[ 'intervals-header' ]}</legend>
				<div className="form-field-group">
					<SelectGroup
						fieldname="interval"
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
			</fieldset>

			<fieldset className="form__section">
				<legend className="form__section-head">{ Translations[ 'payments-header' ] }</legend>
				<div className="form-field-group">
					<SelectGroup
						fieldname="payment-method"
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
