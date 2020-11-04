// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { capitalizeFirstLetter } from '../../shared/capitalize_first_letter';

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = props;

	return <div className="banner-text">
		<p className="text__headline text__headline--bold">
			<img className="info-icon" src="https://upload.wikimedia.org/wikipedia/donate/9/99/RedInfoI.svg" alt="info_icon" width="16" height="16" />
			<span className="text__headline--italic"> Liebe Leserinnen und Leser, </span>
			<span>verzeihen Sie die Störung. <span> { capitalizeFirstLetter( weekdayPrepPhrase ) } { currentDayName } sind Sie in Deutschland gefragt:</span></span>
		</p>

		<p className="text__paragraph text__paragraph--bold">
			<span>{ campaignDaySentence } Wikipedia wird durch Spenden von durchschnittlich 22,81&nbsp;€ finanziert, aber
				99&nbsp;% der Leserinnen und Leser spenden nicht. </span>

			<span className="text__highlight">Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre
				unser Spendenziel bereits am heutigen { currentDayName } erreicht.</span>

			<span> Schon der Preis einer Tasse Kaffee würde genügen. Über { visitorsVsDonorsSentence } Sicher
				könnten wir mit Werbung eine Menge Geld verdienen. Aber dann wäre Wikipedia komplett anders. Wir könnten ihr nicht vertrauen.
				Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun. Wenn Sie Wikipedia nützlich finden, nehmen
				Sie sich an diesem { currentDayName } bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück.</span>

			<span className="text__paragraph--italic"> Vielen Dank!</span>
		</p>
	</div>;
}
