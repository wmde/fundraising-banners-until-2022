import { h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../TranslationContext';

export default function SmsBox() {
	const Translations = useContext( TranslationContext );
	return <div className="sms-box">
		<label className="select-group__option">
			<a href="sms:81190" className="select-group__state">{ Translations[ 'sms-payment-message' ] }</a>
		</label>
		<span className="sms-box__hint">{ Translations[ 'sms-info-message' ] }</span>
	</div>;
}
