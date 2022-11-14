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
	};

	onBlur = ( e ) => {
		this.setState( { focused: false } );
		this.props.onBlur( e );
	};

	render( props, state ) {
		const anyAmountWasSelected = props.selectedAmount === null && props.value !== null;
		const showEuro = ( props.value !== null && props.value !== '' ) || state.focused;
		return <label className={
			classNames( 'wmde-banner-select-custom-amount',
				{
					'value-entered': props.value,
					'focused': state.focused
				}
			) }>
			<input type="radio"
				name={ props.fieldname }
				className="wmde-banner-select-custom-amount-radio"
				value=""
				checked={ state.focused || anyAmountWasSelected }
				onClick={ this.onRadioClicked }
			/>

			<div className="wmde-banner-select-custom-amount-input-container">

				{ showEuro ? <span className="wmde-banner-select-custom-amount-euro-symbol">&euro;</span> : null }

				<input
					tabIndex="-1"
					type="text"
					value={ props.value || '' }
					onInput={ props.onInput }
					size="3"
					maxLength="8"
					onFocus={ this.onFocus }
					onBlur={ this.onBlur }
					autoComplete="off"
					placeholder={ state.focused ? '' : props.placeholder }
					ref={ this.ref }
					className="wmde-banner-select-custom-amount-input"
				/>
			</div>
		</label>;
	}

}
