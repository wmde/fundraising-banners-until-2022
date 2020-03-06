import { Component, createRef } from 'preact/compat';
// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import classNames from 'classnames';

export default class SelectCustomAmount extends Component {
	radioInput = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			focused: false,
			showEuro: false
		};
	}

	onFocus = ( e ) => {
		this.setState( { showEuro: true, focused: true } );
		this.radioInput.current.click();
		if ( this.props.value !== '' ) {
			e.target.select();
		}
	};

	onInput = ( e ) => {
		if ( !this.radioInput.current.checked ) {
			this.radioInput.current.click();
		}
		this.props.onInput( e );
	};

	onBlur = ( e ) => {
		this.setState( { focused: false } );
		this.props.onBlur( e );
		if ( this.props.value === '' ) {
			this.setState( { showEuro: false } );
		}
	};

	render( props, state ) {
		return <label className="select-group__option select-group__option--amount-other-input">
			<input type="radio" name="select-amount" className="select-group__input" value="" ref={this.radioInput}/>

			<div className={ classNames(
				'select-group__custom-input',
				{
					'select-group__custom-input--value-entered': props.value,
					'select-group__custom-input--focused': state.focused
				} ) }
			>

				{ state.showEuro ? <span className="select-group__custom-input--euro-symbol">&euro;</span> : null }

				<input type="text"
					value={ props.value }
					onInput={ this.onInput }
					size="3"
					maxLength="8"
					onFocus={ this.onFocus }
					onBlur={ this.onBlur }
					autoComplete="off"
					placeholder={ props.placeholder }
					className="select-group__custom-input--input" />
			</div>
		</label>;
	}

}
