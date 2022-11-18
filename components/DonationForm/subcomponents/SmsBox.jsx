import { h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../../shared/components/TranslationContext';

export default function SmsBox() {
	const Translations = useContext( TranslationContext );
	return <div className="wmde-banner-sms-box">
		<label>
			<a href="sms:81190;?&body=WIKI" className="wmde-banner-sms-box-label">{ Translations[ 'sms-payment-message' ] }</a>
		</label>
		<span className="wmde-banner-sms-box-notice">{ Translations[ 'sms-info-message' ] }</span>
	</div>;
}
