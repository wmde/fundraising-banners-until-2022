import { h } from 'preact';
import { useContext } from 'preact/hooks';

import TranslationContext from '../../TranslationContext';
import { SelectGroup } from './SelectGroup';
import SelectCustomAmount from './SelectCustomAmount';
import SmsBox from './SmsBox';

import { isValid, isValidOrUnset } from './hooks/validation_states';
import useAmountWithCustom from './hooks/use_amount';
import useInterval from './hooks/use_interval';
import usePaymentMethod from './hooks/use_payment_method';
import { amountMessage, validateRequired } from './utils';
import SubmitValues from './SubmitValues';
import useFormAction from './hooks/use_form_action';

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
	const [ formAction ] = useFormAction( props );

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

	return <div className="form">
		<form
			method="post"
			name="donationForm"
			className="form__element"
			onClick={ onFormInteraction }
			action={ formAction }
			onSubmit={ validate }
		>

			<div className="form-field-group">
				<SelectGroup
					fieldname="select-interval"
					selectionItems={ props.formItems.intervals }
					isValid={ isValidOrUnset( intervalValidity ) }
					errorMessage={ Translations[ 'no-interval-message' ] }
					currentValue={ paymentInterval }
					onSelected={ e => setInterval( e.target.value ) }
					disabledOptions={ disabledIntervals }
					errorPosition={ props.errorPosition }
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
					errorPosition={ props.errorPosition }
				>
					<SelectCustomAmount
						fieldname="select-amount"
						value={ customAmount }
						selectedAmount={ selectedAmount }
						onInput={ e => { updateCustomAmount( e.target.value ); validateCustomAmount( e.target.value ); } }
						onBlur={ e => { validateCustomAmount( e.target.value ); } }
						placeholder={ props.customAmountPlaceholder }
						language={
							/* eslint-disable-next-line dot-notation */
							Translations[ 'LANGUAGE' ]
						}
						o
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
					errorPosition={ props.errorPosition }
				>
					<SmsBox/>
				</SelectGroup>
			</div>

			<div className="submit-section button-group">
				<button className="button-group__button" type="submit">
					<span className="button-group__label">{ Translations[ 'submit-label' ] }</span>
				</button>
			</div>

			<SubmitValues
				amount={ props.formatters.amountForServerFormatter( numericAmount ) }
				interval={ paymentInterval }
				paymentType={ paymentMethod }
				impressionCounts={ props.impressionCounts }
			/>
		</form>
	</div>;
}
