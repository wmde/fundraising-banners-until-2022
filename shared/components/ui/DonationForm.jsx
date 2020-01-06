// eslint-disable-next-line no-unused-vars
import { Component, h } from 'preact';
import { LocalImpressionCount } from '../../local_impression_count';
import { parseAmount } from '../../parse_amount';

// TODO pass in formatter as a dependency to be able to localize this component
import { amountForServerFormatter, amountInputFormatter } from '../../number_formatter/de';

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
			paymentMethodIsValid: true
		};

		this.impCount = new LocalImpressionCount( props.bannerName );
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
			amount: amountForServerFormatter( evt.target.value ),
			amountIsValid: true
		} );
	};

	amountTyped = ( evt ) => {
		this.setState( {
			selectedAmount: null,
			customAmount: evt.target.value,
			amount: amountForServerFormatter( parseAmount( evt.target.value ) )
		} );
	};

	finishedTypingAmount = ( evt ) => {
		const customAmount = parseAmount( evt.target.value );
		this.setState( {
			customAmount: amountInputFormatter( customAmount ),
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
		const intervals = [
			{ value: '0', label: 'einmalig', width: 'fullwidth' },
			{ value: '1', label: 'monatlich' },
			{ value: '3', label: 'vierteljährlich' },
			{ value: '6', label: 'halbjährlich' },
			{ value: '12', label: 'jährlich' }
		];
		const amounts = [
			{ value: '5' },
			{ value: '10' },
			{ value: '20' },
			{ value: '25' },
			{ value: '50' },
			{ value: '100' }
		];
		const paymentMethods = [
			{ value: 'BEZ', label: 'Lastschrift' },
			{ value: 'UEB', label: 'Überweisung' },
			{ value: 'MCP', label: 'Kreditkarte' },
			{ value: 'PPL', label: 'PayPal' }
		];

		return <div className="form">
			<form method="post" name="donationForm" className="form__element"
				action={ 'https://spenden.wikimedia.de/donation/new?piwik_campaign=' + props.campaignName + '&piwik_kwd=' + props.bannerName}>
				<div className="form-field-group">
					<div
						className={ 'select-group-container' + ( state.paymentIntervalIsValid ? '' : ' select-group-container--with-error' ) }>
						<div id="WMDE_Banner-frequency" className="WMDE-Banner-frequency select-group">
							{intervals.map( ( { value, label, width } ) => (
								<label className={ 'select-group__option select-group__option--' + ( width || 'halfwidth' ) } key={value}>
									<input type="radio" onClick={this.intervalSelected} checked={value === state.paymentInterval}
										name="periode" value={value} className="select-group__input"/>
									<span className="select-group__state">{label}</span>
								</label> ) )
							}
						</div>
						<span className="select-group__errormessage">Bitte wählen Sie zuerst ein Zahlungsintervall.</span>
					</div>
				</div>

				<div className={ 'form-field-group select-group-container' + ( state.amountIsValid ? '' : ' select-group-container--with-error' ) }>
					<div id="WMDE_Banner-amounts" className="WMDE-Banner-amounts select-group">
						{amounts.map( ( { value } ) => (
							<label className="select-group__option select-group__option--quarterwidth" key={value}>
								<input type="radio" name="betrag_auswahl"
									onClick={this.amountSelected}
									className="select-group__input"
									checked={ value === state.selectedAmount }
									value={ value }/>
								<span className="select-group__state">{value} €</span>
							</label>
						) ) }
						<label className="select-group__option select-group__option--halfwidth">
							<input type="text"
								value={ state.customAmount }
								onInput={ this.amountTyped }
								size="3"
								onBlur={ this.finishedTypingAmount }
								autoComplete="off"
								placeholder="Wunschbetrag"
								className={ 'select-group__custom-input' + ( state.customAmount ? ' select-group__custom-input--value-entered' : '' ) } />
						</label>
					</div>
					<span className='select-group__errormessage'>Bitte geben Sie einen Spendenbetrag von min. 1€ ein.</span>
				</div>

				<div className="form-field-group">
					<div className={ 'select-group-container' + ( state.paymentMethodIsValid ? '' : ' select-group-container--with-error' ) }>
						<div id="WMDE_Banner-payment-type" className="WMDE-Banner-payment select-group">
							{paymentMethods.map( ( { value, label } ) => (
								<label className="select-group__option select-group__option--halfwidth" key={value}>
									<input type="radio" checked={value === state.paymentMethod }
										onClick={this.paymentMethodSelected}
										name="zahlweise" value={value}
										className="select-group__input" />
									<span className="select-group__state">{label}</span>
								</label>
							) ) }
							<div className="sms-box">
								<label className="select-group__option select-group__option--halfwidth">
									<a href="sms:81190" className="select-group__state">5 € per SMS</a>
								</label>
								<span>SMS mit "WIKI" an die 81190. Kosten zzgl. einer Standard-SMS.</span>
							</div>
						</div>
						<span className="select-group__errormessage">Bitte wählen Sie eine Zahlmethode aus.</span>
					</div>
				</div>

				<div id="WMDE_Banner-submit" className="WMDE-Banner-submit button-group">
					<button className="button-group__button" onClick={this.validateForm}>
						<span className="button-group__label">Weiter, um Spende abzuschließen</span>
					</button>
				</div>

				<input type="hidden" id="amount" name="betrag" value={ state.amount } />
				<input type="hidden" id="impCount" name="impCount" value={this.impCount.overallCount}/>
				<input type="hidden" id="bImpCount" name="bImpCount" value={this.impCount.bannerCount}/>
			</form>
		</div>;
	}
}
