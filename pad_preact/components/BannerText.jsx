// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

function capitalizeFirstLetter( message ) {
	return message.charAt( 0 ).toUpperCase() + message.slice( 1 );
}

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, numberOfDonors, campaignDaySentence, campaignParameters } = props;
	return <div className="banner-text">
		<p className="text__headline text__headline--bold">
			<span className="text__headline--italic">Liebe Leserinnen und Leser, </span>
			<span>verzeihen Sie die Störung. <span> { capitalizeFirstLetter( weekdayPrepPhrase ) } { currentDayName } sind Sie in Deutschland gefragt:</span></span>
		</p>

		<p className="text__paragraph text__paragraph--bold">
			<span>{ campaignDaySentence.getSentence() } Wikipedia wird durch Spenden von durchschnittlich 23,83&nbsp;€ finanziert, aber
				99&nbsp;% der Leserinnen und Leser spenden nicht. </span>

			<span className="text__highlight">Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre
				unser Spendenziel bereits am heutigen { currentDayName } erreicht.</span>

			<span> Schon der Preis einer Tasse Kaffee würde genügen.
			Über { campaignParameters.millionImpressionsPerDay } Millionen Mal wird unser Spendenaufruf täglich angezeigt, aber
			nur { numberOfDonors } Menschen haben bisher gespendet.
			Sicher könnten wir mit Werbung eine Menge Geld verdienen. Aber dann wäre Wikipedia komplett anders. Wir
			könnten ihr nicht vertrauen.
			Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun.
			Wenn Sie Wikipedia nützlich finden, nehmen Sie sich an diesem { currentDayName } bitte eine Minute Zeit
				und geben Wikipedia mit Ihrer Spende etwas zurück.</span>

			<span className="text__paragraph--italic"> Vielen Dank!</span>
		</p>
	</div>;
}
