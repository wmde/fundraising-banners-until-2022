// eslint-disable-next-line no-unused-vars
import { Component, h } from 'preact';
import { parseAmount } from '../../../parse_amount';
import { useContext } from 'preact/hooks';

import TranslationContext from '../../TranslationContext';
import SelectGroup from './SelectGroup';
import SelectCustomAmount from './SelectCustomAmount';

export default class DonationForm extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			paymentInterval: null,
			selectedAmount: null,
			customAmount: '',
			amount: 0,
			paymentMethod: null,
			paymentIntervalIsValid: true,
			amountIsValid: true,
			paymentMethodIsValid: true,

			disabledIntervals: [],
			disabledAmounts: [],
			disabledPaymentMethods: []
		};
	}

	intervalSelected = ( evt ) => {
		this.setState( {
			paymentInterval: evt.target.value,
			paymentIntervalIsValid: true
		} );
	};

	amountSelected = ( evt ) => {
		this.setState( {
			selectedAmount: evt.target.value,
			customAmount: '',
			amount: this.props.formatters.amountForServerFormatter( evt.target.value ),
			amountIsValid: true
		} );
	};

	amountTyped = ( evt ) => {
		this.setState( {
			selectedAmount: null,
			customAmount: evt.target.value,
			amount: this.props.formatters.amountForServerFormatter( parseAmount( evt.target.value ) )
		} );
	};

	finishedTypingAmount = ( evt ) => {
		const customAmount = parseAmount( evt.target.value );
		this.setState( {
			customAmount: this.props.formatters.amountInputFormatter( customAmount ),
			amountIsValid: customAmount >= 1.0
		} );
	};

	paymentMethodSelected = ( evt ) => {
		this.setState( {
			paymentMethod: evt.target.value,
			paymentMethodIsValid: true
		} );
	};

	validateForm = ( evt ) => {
		const validationState = {};
		if ( this.state.paymentInterval === null ) {
			validationState.paymentIntervalIsValid = false;
		}
		if ( this.state.paymentMethod === null ) {
			validationState.paymentMethodIsValid = false;
		}
		if ( this.state.selectedAmount === null && !this.state.customAmount ) {
			validationState.amountIsValid = false;
		}
		if ( Object.keys( validationState ).length > 0 ) {
			this.setState( validationState );
			evt.preventDefault();
		}
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {

		const Translations = useContext( TranslationContext );

		return <div className="form">
			<form method="post" name="donationForm" className="form__element"
				action={ 'https://spenden.wikimedia.de/donation/new?piwik_campaign=' + props.campaignName + '&piwik_kwd=' + props.bannerName}>
				<div className="form-field-group">
					<SelectGroup
						fieldname="interval"
						selectionItems={props.formItems.intervals}
						isValid={state.paymentIntervalIsValid}
						errorMessage={Translations[ 'no-interval-message' ]}
						currentValue={state.paymentInterval}
						onSelected={this.intervalSelected}
						disabledOptions={ state.disabledIntervals }
					/>
				</div>

				<div className={ 'form-field-group' }>
					<SelectGroup
						fieldname="amount"
						selectionItems={props.formItems.amounts}
						isValid={state.amountIsValid}
						errorMessage={Translations[ 'amount-too-low-message' ]}
						currentValue={state.selectedAmount}
						onSelected={this.amountSelected}
						disabledOptions={ state.disabledAmounts }
					>
						<SelectCustomAmount
							value={ state.customAmount }
							onInput={ this.amountTyped }
							onBlur={ this.finishedTypingAmount }
							placeholder={ Translations[ 'custom-amount-placeholder' ] }
						/>
					</SelectGroup>
				</div>

				<div className="form-field-group">
					<SelectGroup
						fieldname="payment-method"
						selectionItems={props.formItems.paymentMethods}
						isValid={state.paymentMethodIsValid}
						errorMessage={Translations[ 'no-payment-type-message' ]}
						currentValue={state.paymentMethod}
						onSelected={this.paymentMethodSelected}
						disabledOptions={ state.disabledPaymentMethods }
					>
						<div className="sms-box">
							<label className="select-group__option">
								<a href="sms:81190" className="select-group__state">{ Translations[ 'sms-payment-message' ] }</a>
							</label>
							<span>{ Translations[ 'sms-info-message' ] }</span>
						</div>
					</SelectGroup>
				</div>

				<div className="submit-section button-group">
					<button className="button-group__button" onClick={this.validateForm}>
						<span className="button-group__label">{ Translations[ 'submit-label' ] }</span>
					</button>
				</div>

				<input type="hidden" name="betrag" value={ state.amount } />
				<input type="hidden" name="periode" value={ state.paymentInterval } />
				<input type="hidden" name="zahlweise" value={ state.paymentMethod } />
				<input type="hidden" name="impCount" value={ props.impressionCounts.overallCount }/>
				<input type="hidden" name="bImpCount" value={ props.impressionCounts.bannerCount }/>
			</form>
		</div>;
	}
}
