// eslint-disable-next-line no-unused-vars
import { h, Component } from 'preact';
import classNames from 'classnames';

export default class SelectCustomAmount extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			focused: false,
			showEuro: false
		};
	}

	onFocus = ( e ) => {
		this.setState( { showEuro: true, focused: true } );
		if ( this.props.value !== '' ) {
			e.target.select();
		}
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
			<input type="radio" name={ props.fieldname } className="select-group__input" value="" checked={ state.focused || props.value !== null }/>

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
					onInput={ props.onInput }
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
