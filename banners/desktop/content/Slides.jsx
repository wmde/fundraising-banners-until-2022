import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = dynamicCampaignText;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-slider-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return [
		{ content: <div>
			<p className="headline">
				<InfoIcon fill={ '#990a00' }/> <strong> An alle, die Wikipedia in Deutschland nutzen </strong>
			</p>
			<p>
				Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg!
				Am heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia
				zu unterstützen. { campaignDaySentence }</p>
		</div> },
		{ content: <div>
			<p>{ animatedVisitorsVsDonorsSentence } Die meisten Menschen spenden, weil sie Wikipedia nützlich finden.
				Die durchschnittliche Spende beträgt 22,66 €, doch bereits eine Spende von 5 € hilft uns weiter.</p>
		</div> },
		{ content: <div>
			<p>Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt? Dann entscheiden
				Sie sich, eine der seltenen Ausnahmen zu sein, und geben Sie etwas zurück. Vielen Dank!</p>
		</div> }
	];
}
