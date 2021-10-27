import { h } from 'preact';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = props;

	return <div className="banner-text">
		<p className="text__headline">
			<img className="info-icon" src="https://upload.wikimedia.org/wikipedia/donate/9/99/RedInfoI.svg" alt="info_icon" width="16" height="16" />
			An alle, die Wikipedia in Deutschland nutzen. Bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm,
			daher kommen wir gleich zur Sache. An diesem { currentDayName } sind Sie gefragt: </p>

		<p className="text__paragraph">
			{ campaignDaySentence } Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert, aber 99&nbsp;% der
			Lesenden spenden nicht. <strong>Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser
			Spendenziel bereits heute erreicht.</strong> Menschen spenden aus einem einfachen Grund – weil Wikipedia nützlich ist.
			Schon der Preis einer Tasse Kaffee würde genügen. { visitorsVsDonorsSentence } Wenn Wikipedia eine kommerzielle Seite
			sein würde, wäre das ein riesiger Verlust für die Welt. Sicher könnten wir mit Werbung eine Menge Geld verdienen.
			Aber dann wäre Wikipedia komplett anders. Wir könnten ihr nicht vertrauen. Es ist leicht, diese Nachricht zu ignorieren
			und die meisten werden das wohl tun. Wenn Sie Wikipedia nützlich finden, nehmen Sie sich an diesem { currentDayName } bitte
			eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück. <em>Vielen Dank!</em>
		</p>
	</div>;
}
