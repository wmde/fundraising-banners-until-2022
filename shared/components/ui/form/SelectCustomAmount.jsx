import { Component } from 'preact/compat';
// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import classNames from 'classnames';

export default class SelectCustomAmount extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			showEuro: false
		};
	}
	onFocus = ( e ) => {
		this.setState( { showEuro: true } );
		if ( this.props.value !== '' ) {
			e.target.select();
		}
	};
	onBlur = ( e ) => {
		this.props.onBlur( e );
		if ( this.props.value === '' ) {
			this.setState( { showEuro: false } );
		}
	};
	render( props, state ) {
		return <label className="select-group__option select-group__option--amount-other-input">
			<input type="radio" name="amount" className="select-group__input" value=""/>

			{ state.showEuro && props.language === 'en' ? <span className={ classNames(
				'select-group__custom-input--euro-symbol',
				{ 'select-group__custom-input--euro-symbol--value-entered': props.value } ) }
			>&euro;</span> : null }

			<input type="text"
				value={ props.value }
				onInput={ props.onInput }
				size="3"
				maxLength="8"
				onFocus={ this.onFocus }
				onBlur={ this.onBlur }
				autoComplete="off"
				placeholder={ props.placeholder }
				className={ classNames( 'select-group__custom-input', { 'select-group__custom-input--value-entered': props.value } ) } />

			{ state.showEuro && props.language === 'de' ? <span className={ classNames(
				'select-group__custom-input--euro-symbol',
				{ 'select-group__custom-input--euro-symbol--value-entered': props.value } ) }
			>&euro;</span> : null }

		</label>;
	}

}
