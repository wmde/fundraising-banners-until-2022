// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { capitalizeFirstLetter } from '../../shared/capitalize_first_letter';

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, campaignDaySentence } = props;
	return <div className="banner-text">
		<p>
			<img className="info-icon" height="16" width="16" src="https://upload.wikimedia.org/wikipedia/commons/9/93/Info-icon-black-on-yellow.svg" alt="info_icon" />
			<strong> Liebe Leserinnen und Leser,</strong> bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher
			kommen wir gleich zur Sache. { capitalizeFirstLetter( weekdayPrepPhrase ) } { currentDayName } sind Sie in Deutschland gefragt
			<span className="optional-text text-m">, um Wikipedias Unabhängigkeit zu sichern</span>:
		</p>
		<p>
			{ campaignDaySentence + ' ' } Wikipedia wird durch Spenden von durchschnittlich 22,81 € finanziert. <strong>Wenn alle, die das jetzt
			lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel bereits am heutigen { currentDayName + ' ' }
			erreicht.</strong> Millionen Menschen nutzen Wikipedia, aber 99 % der Leserinnen und Leser spenden nicht.{ ' ' }
			<span className="optional-text text-m">Wenn Wikipedia eine kommerzielle Seite sein würde, wäre das ein riesiger Verlust für die Welt. </span>
			Sicher könnten wir mit Werbung eine Menge Geld verdienen. Aber dann wäre Wikipedia komplett anders.
			Wir könnten ihr nicht vertrauen.
			Doch obwohl die meisten das nicht wollen, spenden sie nicht. Schon der Preis einer Tasse Kaffee würde genügen. Wenn Sie Wikipedia nützlich finden,
			nehmen Sie sich an diesem { currentDayName } bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende
			etwas zurück<span className="optional-text text-l">, damit Wikipedia weiter wachsen kann</span>. <em>Vielen Dank!</em>
		</p>
	</div>;
}
