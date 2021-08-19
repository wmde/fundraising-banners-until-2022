import { h, Component, createRef } from 'preact';
import classNames from 'classnames';

export default class SelectCustomAmount extends Component {

	ref = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			focused: false
		};
	}

	onFocus = ( e ) => {
		this.setState( { focused: true } );
		if ( this.props.value !== '' ) {
			e.target.select();
		}
	};

	onRadioClicked = () => {
		if ( this.ref.current ) {
			this.ref.current.focus();
		}
	}

	onBlur = ( e ) => {
		this.setState( { focused: false } );
		this.props.onBlur( e );
	};

	render( props, state ) {
		const anyAmountWasSelected = props.selectedAmount === null && props.value !== null;
		const showEuro = ( props.value !== null && props.value !== '' ) || state.focused;
		return <label className="select-group__option select-group__option--amount-other-input">
			<input type="radio"
				name={ props.fieldname }
				className="select-group__input"
				value=""
				checked={ state.focused || anyAmountWasSelected }
				onClick={ this.onRadioClicked }
			/>

			<div className={ classNames(
				'select-group__custom-input',
				{
					'select-group__custom-input--value-entered': props.value,
					'select-group__custom-input--focused': state.focused
				} ) }
			>

				{ showEuro ? <span className="select-group__custom-input--euro-symbol">&euro;</span> : null }

				<input type="text"
					value={ props.value || '' }
					onInput={ props.onInput }
					size="3"
					maxLength="8"
					onFocus={ this.onFocus }
					onBlur={ this.onBlur }
					autoComplete="off"
					placeholder={ state.focused ? '' : props.placeholder }
					ref={ this.ref }
					className="select-group__custom-input--input" />
			</div>
		</label>;
	}

}
