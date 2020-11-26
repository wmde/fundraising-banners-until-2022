// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { capitalizeFirstLetter } from '../../../shared/capitalize_first_letter';
import TextHighlight from '../../../shared/components/ui/TextHighlight';

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = props;

	return <div className="banner-text">
		<div className="banner-text-inner">

			<div className="banner-text-ctrl">
				<p className="text__headline">
					<img className="info-icon" src="https://upload.wikimedia.org/wikipedia/donate/9/99/RedInfoI.svg" alt="info_icon" width="16" height="16" />
					<span className="text__headline--bold"> Liebe Leserinnen und Leser,</span>
					<span> bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher kommen wir gleich zur Sache. </span>
					{capitalizeFirstLetter( weekdayPrepPhrase )} {currentDayName} sind Sie in Deutschland
					gefragt:
				</p>

				<p className="text__paragraph">
					{' '}{campaignDaySentence} Wikipedia wird durch Spenden von durchschnittlich 22,81&nbsp;€ finanziert, aber
					99&nbsp;% der Leserinnen und Leser spenden nicht.

					<span className="optional-text-highlight">
						<TextHighlight registerStartAnimation={ props.registerStartHighlight }>
							{' '}Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel bereits am heutigen { currentDayName } erreicht.{' '}
						</TextHighlight>
					</span>
					<span className="text__paragraph--bold">
						{' '}Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre
						unser Spendenziel bereits am heutigen { currentDayName } erreicht.{' '}
					</span>

					<span className='ab-test-text'>Menschen spenden aus einem einfachen Grund – weil Wikipedia nützlich ist. </span>

					<span>Schon der Preis einer Tasse Kaffee würde genügen. { visitorsVsDonorsSentence } </span>

					<span className="optional-text text-l">
						Wenn Wikipedia eine kommerzielle Seite sein würde, wäre das ein riesiger Verlust für die Welt. </span>

					<span>
						Sicher könnten wir mit Werbung eine Menge Geld verdienen. Aber dann wäre Wikipedia komplett anders.
						Wir könnten ihr nicht vertrauen.
						Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun. Wenn Sie Wikipedia nützlich
						finden, nehmen Sie sich an diesem Donnerstag bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück. </span>

					<span className="text__paragraph--italic">
						{' '}Vielen Dank! </span>

					<span className='ab-test-text hidden'>Menschen spenden aus einem einfachen Grund – weil Wikipedia nützlich ist.</span>
				</p>
			</div>
			<div className="banner-text-var">
				<p className="text__headline">
					<img className="info-icon" src="https://upload.wikimedia.org/wikipedia/donate/9/99/RedInfoI.svg" alt="info_icon" width="16" height="16" />
					<span className="text__headline--bold"> Liebe Leserinnen und Leser,</span>
					<span> bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher kommen wir gleich zur Sache. </span>
					{capitalizeFirstLetter( weekdayPrepPhrase )} {currentDayName} sind Sie in Deutschland
					gefragt:
				</p>

				<p className="text__paragraph">
					{' '}{campaignDaySentence} Wikipedia wird durch Spenden von durchschnittlich 22,81&nbsp;€ finanziert, aber
					99&nbsp;% der Leserinnen und Leser spenden nicht.

					<span className="optional-text-highlight">
						<TextHighlight registerStartAnimation={ props.registerStartHighlight }>
							{' '}Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel bereits am heutigen { currentDayName } erreicht.{' '}
						</TextHighlight>
					</span>
					<span className="text__paragraph--bold">
						{' '}Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre
						unser Spendenziel bereits am heutigen { currentDayName } erreicht.{' '}
					</span>

					<span className='ab-test-text'>Menschen spenden aus einem einfachen Grund – weil Wikipedia nützlich ist. </span>

					<span>Schon der Preis einer Tasse Kaffee würde genügen. { visitorsVsDonorsSentence } </span>

					<span className="optional-text text-l">
						Wenn Wikipedia eine kommerzielle Seite sein würde, wäre das ein riesiger Verlust für die Welt. </span>

					<span>
						Sicher könnten wir mit Werbung eine Menge Geld verdienen. Aber dann wäre Wikipedia komplett anders.
						Wir könnten ihr nicht vertrauen.
						Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun. Wenn Sie Wikipedia nützlich
						finden, nehmen Sie sich an diesem Donnerstag bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück. </span>

					<span className="text__paragraph--italic">
						{' '}Vielen Dank! </span>

					<span className='ab-test-text hidden'>Menschen spenden aus einem einfachen Grund – weil Wikipedia nützlich ist.</span>
				</p>
			</div>
		</div>
	</div>;
}
