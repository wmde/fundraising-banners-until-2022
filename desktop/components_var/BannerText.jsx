// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../shared/components/TranslationContext';

export default function BannerText( props ) {
	const Translations = useContext( TranslationContext );
	const { campaignDaySentence, visitorsVsDonorsSentence, toggleFundsModal } = props;

	return <div className="banner-text">
		<p>
			<strong>An alle unsere Leserinnen und Leser in Deutschland. </strong>
		</p>
		<p>
			{ campaignDaySentence } Zum ersten Mal seit langem möchten wir Sie an diesem day of the week bescheiden
			darum bitten, die Unabhängigkeit von Wikipedia zu verteidigen. Insgesamt spenden 99% unserer Leserinnen
			und Leser nichts – sie übergehen diesen Aufruf. Sollten Sie zu dem kleinen Kreis gehören, die bereits
			gespendet haben, danken wir Ihnen sehr herzlich. Wikipedia wird durch Spenden von durchschnittlich 22,81&nbsp;€
			finanziert. Doch schon mit einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich
			entwickeln. { visitorsVsDonorsSentence } Die meisten Menschen spenden, weil sie Wikipedia nützlich finden.
			Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert von 5&nbsp;€ geschenkt? Dann nehmen Sie sich doch bitte
			eine Minute Zeit und geben Sie etwas zurück.
		</p>
		<p>
			<a onClick={ toggleFundsModal }>
				{ Translations[ 'use-of-funds-link' ] }
			</a>
		</p>
	</div>;
}
