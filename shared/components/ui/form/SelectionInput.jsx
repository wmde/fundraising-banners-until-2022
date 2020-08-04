// eslint-disable-next-line no-unused-vars
import { Component, h } from 'preact';
import classNames from 'classnames';

export default class SelectionInput extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			focused: false
		};
	}

	handleFocus = e => {
		e.target.select();
		this.setState( { focused: true } );
	}

	handleBlur = () => {
		this.setState( { focused: false } );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		return <div className={ classNames( 'selection-input', { focused: state.focused } ) }>
			<span className="selection-input-text">{ props.value }</span>
			<input
				className="selection-input-input"
				type="text"
				readOnly={ true }
				value={ props.focusedValue || props.value }
				onFocus={ this.handleFocus }
				onBlur={ this.handleBlur }
			/>
		</div>;
	}

}
