// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import classNames from 'classnames';

export default function SelectCustomAmount( props ) {
	return <label className="select-group__option select-group__option-amount-other-input">
		<input type="radio" name="amount" className="select-group__input" value=""/>
		<input type="text"
			value={ props.value }
			onInput={ props.onInput }
			size="3"
			maxLength="8"
			onBlur={ props.onBlur }
			autoComplete="off"
			placeholder={ props.placeholder }
			className={ classNames( 'select-group__custom-input', { 'select-group__custom-input--value-entered': props.value } ) } />
	</label>;
}
