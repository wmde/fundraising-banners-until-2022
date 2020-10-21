// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import TextHighlight from '../../../shared/components/ui/TextHighlight';
import { capitalizeFirstLetter } from '../../../shared/capitalize_first_letter';

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, campaignDaySentence } = props;
	return <div className="banner-text">
		<p className="text__headline">
			<span>Liebe Leserinnen und Leser, bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher kommen wir
				gleich zur Sache. </span>
			<span> { capitalizeFirstLetter( weekdayPrepPhrase ) } { currentDayName } sind Sie in Deutschland
				gefragt:</span>
		</p>
		<p>
			<span>{ campaignDaySentence } Wikipedia wird durch Spenden von durchschnittlich 22,81&nbsp;€ finanziert. </span>
			<TextHighlight registerStartAnimation={ props.registerStartHighlight }>
				Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten,
				wäre unser Spendenziel bereits am heutigen { currentDayName } erreicht.
			</TextHighlight>

			Millionen Menschen nutzen Wikipedia, aber 99 % der
			Leserinnen und Leser spenden nicht. Wenn Wikipedia eine kommerzielle Seite sein würde,
			wäre das ein riesiger Verlust für die Welt. Sicher könnten wir mit Werbung eine Menge Geld verdienen.
			Aber dann wäre Wikipedia komplett anders. Wir könnten ihr nicht vertrauen.
			Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun.
			Schon der Preis einer Tasse Kaffee würde genügen.
			Wenn Sie Wikipedia nützlich finden, nehmen Sie
			sich <span>{ weekdayPrepPhrase } { currentDayName } </span>
			bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück.
			<span className="text--italic"> Vielen Dank!</span>
		</p>
	</div>;
}
