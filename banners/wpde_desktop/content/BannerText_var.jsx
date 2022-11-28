import { h } from 'preact';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = props.dynamicCampaignText;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return <div className="banner-text">
		<p className="text__headline">
			<img className="info-icon" src="https://upload.wikimedia.org/wikipedia/donate/9/99/RedInfoI.svg" alt="info_icon" width="16" height="16" />
			An alle, die Wikipedia in Deutschland nutzen
		</p>
		<p className="text__paragraph">
			Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg!
			Am heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia
			zu sichern. { campaignDaySentence } Wikipedia wird durch Spenden von
			durchschnittlich 22,66&nbsp;€ finanziert. Doch schon mit einer
			Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich
			entwickeln. { animatedVisitorsVsDonorsSentence } Die meisten Menschen spenden, weil
			sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse
			Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie
			etwas zurück. Vielen Dank!
			<span className="text__hidden">. Bitte verzeihen Sie die Störung. Es ist
				ein bisschen unangenehm, daher kommen wir gleich zur Sache. An diesem Donnerstag sind Sie gefragt: </span>
			<span className="text__hidden"> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
				eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
				At vero eos et accusam et justo duo dolores</span>
		</p>
	</div>;
}
