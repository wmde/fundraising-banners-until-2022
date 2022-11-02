import { h } from 'preact';

export default function Slides( dynamicCampaignText, progressBar ) {
	const { currentDayName, goalDonationSum, campaignDaySentence, visitorsVsDonorsSentence } = dynamicCampaignText;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-slider-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return [
		{
			content: <div className="wmde-banner-slide-content-first">
				<p>Unser Spendenziel: { goalDonationSum } Millionen Euro</p>
				{ progressBar }
			</div>
		},
		{
			content: <div>
				<p>An alle, die Wikipedia in Deutschland nutzen: Vielleicht kommen wir gerade ungelegen,
					aber dennoch: Klicken Sie jetzt bitte nicht weg! Am heutigen { currentDayName } bitten
					wir Sie bescheiden, die Unabhängigkeit von Wikipedia zu sichern.</p>
			</div>
		},
		{
			content: <div>
				<p>{ campaignDaySentence } Insgesamt spenden 99% nichts – sie übergehen diesen Aufruf.
					Wikipedia wird durch Spenden von durchschnittlich 22,66&nbsp;€ finanziert.</p>
			</div>
		},
		{
			content: <div>
				<p>Doch schon mit einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft
					erfolgreich entwickeln. { animatedVisitorsVsDonorsSentence }</p>
			</div>
		},
		{
			content: <div>
				<p>Die meisten Menschen spenden, weil sie Wikipedia nützlich finden. Hat Wikipedia
					Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt? <strong>Dann nehmen
					Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. Vielen Dank!</strong></p>
			</div>
		}
	];
}
