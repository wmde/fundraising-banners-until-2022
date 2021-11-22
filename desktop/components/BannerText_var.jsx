import { h } from 'preact';
import InfoIcon from './ui/InfoIcon';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, overallImpressionCount } = props.dynamicCampaignText;

	return <div className="banner-text">
		<p>
			<strong><InfoIcon/> An alle unsere Leserinnen und Leser in Deutschland </strong>
		</p>
		<p>
			Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg!
			Dies ist der { overallImpressionCount }. Spendenaufruf, den wir Ihnen zeigen. Am
			heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia
			zu sichern. { campaignDaySentence } Insgesamt
			spenden 99% nichts – sie übergehen diesen Aufruf. Sollten Sie zu dem kleinen Kreis gehören, die
			bereits gespendet haben, danken wir Ihnen sehr herzlich. Wikipedia wird durch Spenden von
			durchschnittlich 21,60&nbsp;€ finanziert. Doch schon mit einer Spende von 5&nbsp;€ kann Wikipedia sich auch
			in Zukunft erfolgreich entwickeln. { visitorsVsDonorsSentence } Die meisten Menschen spenden, weil
			sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse
			Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie
			etwas zurück. Vielen Dank
		</p>
	</div>;
}
