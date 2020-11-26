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
					<span> Liebe Leserinnen und Leser,</span>
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

					<span className='ab-test-text'>Menschen spenden aus einem einfachen Grund – weil Wikipedia
						nützlich ist. Schon der Preis einer Tasse Kaffee würde genügen. { visitorsVsDonorsSentence } </span>

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
					<span> Liebe Leserin, lieber Leser, Hand aufs Herz: Wie oft nutzen
						Sie Wikipedia - ein paar Mal im Monat, ein paar Mal in der Woche oder sogar mehrmals am Tag? </span>
				</p>
				<p className="text__paragraph">
					Damit Sie Wikipedia auch weiterhin nutzen können, sind wir am
					heutigen {currentDayName} auf Ihre Mithilfe angewiesen: Die operativen Kosten und Investitionen
					in die Weiterentwicklung von Wikipedia werden durch Spenden ihrer Nutzerinnen und Nutzer
					finanziert. Die durchschnittliche Spende beträgt 22,81&nbsp;€, doch schon der Preis einer
					Tasse Kaffee würde genügen. Aus vielen kleinen Beiträgen wird eine wirkungsvolle Summe. Millionen
					Menschen sehen dieses Banner, während sie Wikipedia nutzen. Dennoch spenden sie nicht. Wir
					sind deshalb auf den kleinen Kreis von weniger als 1&nbsp;% unser Nutzerinnen und Nutzer angewiesen,
					die sich freiwillig an der Finanzierung der Wikipedia
					beteiligen.
					<span className="text__paragraph--bold">
						{' '}Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre
						unser Spendenziel bereits am heutigen { currentDayName } erreicht.{' '}
					</span>
					Wenn Sie Wikipedia regelmäßig nutzen, dann nehmen Sie sich an diesem {currentDayName} bitte
					eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück.
					<span className="text__paragraph--italic">
						{' '}Vielen Dank!
					</span>

				</p>

			</div>
		</div>
	</div>;
}
