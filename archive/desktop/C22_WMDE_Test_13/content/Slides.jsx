import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = dynamicCampaignText;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-slider-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return [
		{ content: <div>
			<p className="headline">
				<InfoIcon/> <strong> An alle, die Wikipedia in Deutschland nutzen </strong>
			</p>
			<p>
				Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte
				nicht weg! Am heutigen { currentDayName } bitten
				wir Sie bescheiden, die Unabhängigkeit von Wikipedia zu sichern.</p>
		</div> },
		{ content: <div>
			<p>{ campaignDaySentence } Insgesamt spenden 99% nichts – sie übergehen
				diesen Aufruf. Wikipedia wird durch Spenden von durchschnittlich 22,66&nbsp;€ finanziert.</p>
		</div> },
		{ content: <div>
			<p>Doch schon mit einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft
				erfolgreich entwickeln. { animatedVisitorsVsDonorsSentence }</p>
		</div> },
		{ content: <div>
			<p>Die meisten Menschen spenden, weil sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in
				diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt? Dann nehmen Sie sich
				doch bitte eine Minute Zeit und geben Sie etwas zurück. Vielen Dank!</p>
		</div> }
	];
}
