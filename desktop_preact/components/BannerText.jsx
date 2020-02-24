// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

function capitalizeFirstLetter( message ) {
	return message.charAt( 0 ).toUpperCase() + message.slice( 1 );
}

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, numberOfDonors, campaignDaySentence, campaignParameters } = props;
	return <div className="banner-text">
		<p className="text__headline">
			<span className="text__headline--bold">Liebe Leserinnen und Leser,</span>
			<span> bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher kommen wir gleich zur Sache. </span>
			<span> { capitalizeFirstLetter( weekdayPrepPhrase ) }  { currentDayName }  sind Sie in Deutschland gefragt</span><span
				className="optional-text text-m">, um Wikipedias Unabhängigkeit zu sichern</span>:
		</p>
		<p className="text__paragraph">
			<span>{ campaignDaySentence.getSentence() } Wikipedia wird durch Spenden von durchschnittlich 23,83 € finanziert, aber 99 % der Leserinnen und Leser
				spenden nicht. </span>

			<span className="text__paragraph--bold">
        Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel bereits am heutigen { currentDayName }  erreicht. </span>

			<span>Schon der Preis einer Tasse Kaffee würde genügen. Über { campaignParameters.millionImpressionsPerDay } Millionen
			Mal wird unser Spendenaufruf täglich angezeigt,
			aber nur  { numberOfDonors } Menschen haben bisher gespendet. </span>
			<span className="optional-text text-m">
				Wenn Wikipedia eine kommerzielle Seite sein würde, wäre das ein riesiger Verlust für die Welt. </span>
			<span> Wikipedia ist ein Ort des Lernens – Werbung hat darin keinen Platz.
			Sicher könnten wir mit Werbung eine Menge Geld verdienen. Aber dann wäre Wikipedia komplett anders. Wir
				könnten ihr nicht vertrauen. </span>

			<span className="optional-text text-xl">
        Das Herzstück von Wikipedia ist die Gemeinschaft von Menschen, die uns unbegrenzten Zugang zu verlässlichen und neutralen Informationen geben. </span>

			<span>Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun. Wenn Sie Wikipedia
				nützlich finden, nehmen Sie sich { weekdayPrepPhrase } { currentDayName } bitte eine
				Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück</span>
			<span className="optional-text text-l">, damit Wikipedia weiter wachsen kann</span>.

			<span className="text__paragraph--italic"> Vielen Dank!</span>
		</p>
	</div>;
}
