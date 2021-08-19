import { h } from 'preact';
import classNames from 'classnames';

export default function LanguageWarningBox( props ) {

	return <div className={ classNames( props.show ? 'lang-warning--visible' : 'lang-warning--hidden', 'lang-warning' ) }>
		<p>Please note: the next steps of the donation process are in German</p>
	</div>;
}
