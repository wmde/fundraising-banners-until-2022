// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import TextHighlight from '../../shared/components/ui/TextHighlight';

function capitalizeFirstLetter( message ) {
	return message.charAt( 0 ).toUpperCase() + message.slice( 1 );
}

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, numberOfDonors, campaignDaySentence, campaignParameters } = props;
	return <div className="banner-text">
		<p className="text__headline">
			<span>Liebe Leserinnen und Leser, bitte verzeihen Sie die Störung. Es ist ein wenig unangenehm, daher kommen wir
				gleich zur Sache. </span>
			<span>{ capitalizeFirstLetter( weekdayPrepPhrase ) } { currentDayName } sind Sie in Deutschland gefragt:</span>
		</p>
		<p>
			<span>{ campaignDaySentence } Wikipedia wird durch Spenden von durchschnittlich 23,83&nbsp;€ finanziert, aber
				99&nbsp;% der Leserinnen und Leser spenden nicht. </span>
			<TextHighlight registerStartAnimation={ props.registerStartHighlight }>
				Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten,
				wäre unser Spendenziel bereits am heutigen {{ currentDayName }} erreicht.
			</TextHighlight>

			Schon der Preis einer Tasse Kaffee würde genügen.
			Über { campaignParameters.millionImpressionsPerDay } Millionen Mal wird unser Spendenaufruf täglich angezeigt, aber
			nur { numberOfDonors } Menschen haben bisher gespendet.
			Sicher könnten wir mit Werbung eine Menge Geld verdienen.
			Aber dann wäre Wikipedia komplett anders. Wir könnten ihr nicht vertrauen.
			Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun.
			Wenn Sie Wikipedia nützlich finden, nehmen Sie
			sich <span>{ weekdayPrepPhrase } { currentDayName } </span>
			bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück.
			<span className="text--italic"> Vielen Dank!</span>
		</p>
	</div>;
}
