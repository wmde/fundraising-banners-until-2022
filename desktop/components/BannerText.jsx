// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { capitalizeFirstLetter } from '../../shared/capitalize_first_letter';

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, campaignDaySentence } = props;
	return <div className="banner-text">
		<div className="banner-text-inner">
			<div className="banner-text-ctrl">
				<p>
					Liebe Leserinnen und Leser, bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher
					kommen wir gleich zur Sache. { capitalizeFirstLetter( weekdayPrepPhrase ) } { currentDayName } sind Sie in Deutschland gefragt
					<span className="optional-text text-m">, um Wikipedias Unabhängigkeit zu sichern</span>:
				</p>
				<p>
					{ campaignDaySentence + ' ' }<strong>Wikipedia wird durch Spenden von durchschnittlich 22,81 € finanziert. Wenn alle, die das jetzt
						lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel bereits am heutigen { currentDayName + ' ' }
						erreicht. Millionen Menschen nutzen Wikipedia, aber 99 % der Leserinnen und Leser spenden nicht. </strong>
					<span className="optional-text text-m">Wenn Wikipedia eine kommerzielle Seite sein würde, wäre das ein riesiger Verlust für die Welt. </span>
					Sicher könnten wir mit Werbung eine Menge Geld verdienen. Aber dann wäre Wikipedia komplett anders.
					Wir könnten ihr nicht vertrauen.
					<span className="optional-text text-xl"> Das Herzstück von Wikipedia ist die Gemeinschaft von Menschen,
						die uns unbegrenzten Zugang zu verlässlichen und neutralen Informationen geben. </span>
					Es ist leicht, diese Nachricht zu ignorieren und die meisten werden
					das wohl tun. <strong>Schon der Preis einer Tasse Kaffee würde genügen.</strong> Wenn Sie Wikipedia nützlich finden,
					nehmen Sie sich an diesem { currentDayName } bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende
					etwas zurück<span className="optional-text text-l">, damit Wikipedia weiter wachsen kann</span>. <em>Vielen Dank!</em>
				</p>
			</div>
			<div className="banner-text-var">
				<p>
					Liebe Leserinnen und Leser, bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher
					kommen wir gleich zur Sache. { capitalizeFirstLetter( weekdayPrepPhrase ) } { currentDayName } sind Sie in Deutschland gefragt
					<span className="optional-text text-m">, um Wikipedias Unabhängigkeit zu sichern</span>:
				</p>

				<ul>
					<li>
						<strong>Wikipedia wird durch Spenden von durchschnittlich 22,81 € finanziert.</strong>
					</li>
					<li>
						<strong>Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel bereits am
							heutigen { currentDayName } erreicht.</strong>
					</li>
					<li>
						<strong>Millionen Menschen nutzen Wikipedia, aber 99 % der Leserinnen und Leser spenden nicht.</strong>
					</li>
				</ul>

				<p>
					<span className="optional-text text-m">Wenn Wikipedia eine kommerzielle Seite sein würde, wäre das ein riesiger Verlust für die Welt. </span>
					Sicher könnten wir mit Werbung eine Menge Geld verdienen. Aber dann wäre Wikipedia komplett anders.
					Wir könnten ihr nicht vertrauen.
					<span className="optional-text text-xl"> Das Herzstück von Wikipedia ist die Gemeinschaft von Menschen,
						die uns unbegrenzten Zugang zu verlässlichen und neutralen Informationen geben. </span>
					Es ist leicht, diese Nachricht zu ignorieren und die meisten werden
					das wohl tun. <strong>Schon der Preis einer Tasse Kaffee würde genügen.</strong> Wenn Sie Wikipedia nützlich finden,
					nehmen Sie sich an diesem { currentDayName } bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende
					etwas zurück<span className="optional-text text-l">, damit Wikipedia weiter wachsen kann</span>. <em>Vielen Dank!</em>
				</p>
			</div>
		</div>
	</div>;
}
