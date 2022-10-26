import { h } from 'preact';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = props.dynamicCampaignText;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return <div className="banner-text">
		<p className="banner-text-title">
			<strong>An alle, die Wikipedia in Deutschland nutzen:</strong>
		</p>
		<p>Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg! Am
			heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia zu
			sichern. { campaignDaySentence } Insgesamt spenden 99% nichts – sie übergehen diesen Aufruf.
			Wikipedia wird durch Spenden von durchschnittlich 22,66&nbsp;€ finanziert. Doch schon mit
			einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich
			entwickeln. { animatedVisitorsVsDonorsSentence } Wenn alle, die das jetzt lesen, einen kleinen
			Beitrag leisten, wäre unser Spendenziel bereits in wenigen Stunden erreicht. Die meisten
			Menschen spenden, weil sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr
			Wissen im Wert einer Tasse Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine Minute
			Zeit und geben Sie etwas zurück. <em>Vielen Dank!</em>
		</p>
	</div>;
}
