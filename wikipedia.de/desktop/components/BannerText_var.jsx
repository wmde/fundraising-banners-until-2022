import { h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../../shared/components/TranslationContext';

export default function BannerText( props ) {
	const Translations = useContext( TranslationContext );
	const { dynamicCampaignText, toggleFundsModal } = props;

	return <div className="banner-text">
		<p>
			<strong>An alle unsere Leserinnen und Leser in Deutschland. </strong>
		</p>
		<p>
			Bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher kommen wir gleich zur Sache.
			An diesem { dynamicCampaignText.currentDayName } sind Sie in Deutschland gefragt. { dynamicCampaignText.campaignDaySentence + ' ' }
			Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert, aber 99&nbsp;% der Leserinnen und Leser
			spenden nicht. <strong>Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel
			bereits am heutigen { dynamicCampaignText.currentDayName } erreicht.</strong> Menschen spenden aus einem einfachen Grund
			– weil Wikipedia nützlich ist. Schon der Preis einer Tasse Kaffee würde genügen. { dynamicCampaignText.visitorsVsDonorsSentence } Wenn
			Wikipedia eine kommerzielle Seite sein würde, wäre das ein riesiger Verlust für die Welt. Sicher könnten wir mit Werbung eine Menge
			Geld verdienen. Aber dann wäre Wikipedia komplett anders. Wir könnten ihr nicht vertrauen. Es ist leicht, diese Nachricht zu
			ignorieren und die meisten werden das wohl tun. Wenn Sie Wikipedia nützlich finden, nehmen Sie sich an diesem { ' ' }
			{ dynamicCampaignText.currentDayName } bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück. Vielen Dank!
		</p>
		<p>
			<a onClick={ toggleFundsModal }>
				{ Translations[ 'use-of-funds-link' ] }
			</a>
		</p>
	</div>;
}
