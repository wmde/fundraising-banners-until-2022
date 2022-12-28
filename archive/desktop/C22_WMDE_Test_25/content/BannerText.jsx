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
			Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg! Am
			heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia zu
			unterstützen. { campaignDaySentence } Wikipedia wird durch Spenden von durchschnittlich 22,66&nbsp;€
			finanziert. Doch bereits eine Spende von 5&nbsp;€ hilft uns weiter. { animatedVisitorsVsDonorsSentence } Die
			meisten Menschen spenden, weil sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr
			Wissen im Wert einer Tasse Kaffee geschenkt? Dann entscheiden Sie sich, eine der seltenen Ausnahmen
			zu sein, und geben Sie etwas zurück. Vielen Dank!
		</p>
	</div>;
}
