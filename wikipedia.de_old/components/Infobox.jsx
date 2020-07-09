// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import TextHighlight from './TextHighlight';
import { capitalizeFirstLetter } from '../../shared/capitalize_first_letter';

export default function Infobox( props ) {
	const { weekdayPrepPhrase, currentDayName, amountBannerImpressionsInMillion, numberOfDonors, campaignDaySentence, animateHighlightTrigger } = props;
	return <div className="infobox__text">
		<p className="text__headline">
			<span className="text__headline--bold">Liebe Leserinnen und Leser,</span>
			<span> bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher kommen wir gleich zur Sache. </span>
			{capitalizeFirstLetter( weekdayPrepPhrase )} {currentDayName} sind Sie in Deutschland
			gefragt<span className="optional-text text-l">, um Wikipedias Unabhängigkeit zu sichern</span>:
		</p>

		<p className="text__paragraph">
			{' '}{campaignDaySentence} Wikipedia wird durch Spenden von durchschnittlich 23,83&nbsp;€ finanziert, aber
			99&nbsp;% der Leserinnen und Leser spenden nicht.

			<TextHighlight animateHighlightTrigger={animateHighlightTrigger}>
				{' '}Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel bereits am heutigen { currentDayName } erreicht.{' '}
			</TextHighlight>

			<span className='ab-test-text'>Menschen spenden aus einem einfachen Grund – weil Wikipedia nützlich ist. </span>

			<span>Schon der Preis einer Tasse Kaffee würde genügen.
				Über {amountBannerImpressionsInMillion} Millionen Mal wird unser Spendenaufruf täglich angezeigt, aber nur {numberOfDonors} Menschen haben bisher gespendet. </span>

			<span className="optional-text text-l">
				Wenn Wikipedia eine kommerzielle Seite sein würde, wäre das ein riesiger Verlust für die Welt.
				Wikipedia ist ein Ort des Lernens – Werbung hat darin keinen Platz. </span>

			<span>
				Sicher könnten wir mit Werbung eine Menge Geld verdienen. Aber dann wäre Wikipedia komplett anders.
				Wir könnten ihr nicht vertrauen. </span>

			<span className="optional-text text-xl">
				Wikipedia bringt uns alle, die Wissen lieben, zusammen: Beitragende, Lesende und die Spendenden, die uns finanzieren. </span>
			<span className="optional-text text-xxl">
				Das Herzstück von Wikipedia ist die Gemeinschaft von Menschen, die uns unbegrenzten Zugang zu verlässlichen und neutralen Informationen geben. </span>

			<span>
				Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun. </span>

			<span className="optional-text text-max-xl">
				Wenn Sie Wikipedia nützlich finden, nehmen Sie sich {weekdayPrepPhrase} {currentDayName} bitte
				eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück. </span>

			<span className="optional-text text-xl">
				Wenn Sie Wikipedia nützlich finden, nehmen Sie sich {weekdayPrepPhrase} {currentDayName} bitte eine Minute Zeit.
				Geben Sie mit Ihrer Spende etwas zurück, damit Wikipedia weiter wachsen kann. </span>

			<span className="text__paragraph--italic">
				Vielen Dank! </span>

			<span className='ab-test-text hidden'>Menschen spenden aus einem einfachen Grund – weil Wikipedia nützlich ist.</span>
		</p>
	</div>;
}