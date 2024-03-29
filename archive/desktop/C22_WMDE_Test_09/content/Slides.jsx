import { h } from 'preact';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = dynamicCampaignText;
	const Icon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="8" cy="8" r="8" fill="#2B6DA0"/>
		<path d="M8.80003 5.73332V11.7173H10.2667V13.0667H5.96937V11.7173H7.33337V7.19999H5.8667V5.73332H8.80003ZM7.33337 2.79999H8.80003V4.26665H7.33337V2.79999Z" fill="white"/>
	</svg>;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-slider-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return [
		{ content: <div>
			<p className="headline">
				{ Icon } <strong> An alle, die Wikipedia in Deutschland nutzen </strong>
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
