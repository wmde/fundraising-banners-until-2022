import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = props.dynamicCampaignText;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return <div>
		<p>
			<strong><InfoIcon fill={ '#990a00' }/> An alle, die Wikipedia in Deutschland nutzen </strong>
		</p>
		<p>
			Falls wir gerade ungelegen kommen, <a href="#" onClick={props.onClose}>können Sie unseren
			Spendenaufruf später lesen</a>. Ansonsten kommen wir gleich zur Sache:
			Am heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia
			zu sichern. { campaignDaySentence } Wikipedia wird durch Spenden von
			durchschnittlich 22,66&nbsp;€ finanziert. Doch schon mit einer
			Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich
			entwickeln. { animatedVisitorsVsDonorsSentence } Die meisten Menschen spenden, weil
			sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse
			Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie
			etwas zurück. Vielen Dank!
		</p>
	</div>;
}
