import { h } from 'preact';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = dynamicCampaignText;
	const Icon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="8" cy="8" r="8" fill="#2B6DA0"/>
		<path d="M8.80003 5.73332V11.7173H10.2667V13.0667H5.96937V11.7173H7.33337V7.19999H5.8667V5.73332H8.80003ZM7.33337 2.79999H8.80003V4.26665H7.33337V2.79999Z" fill="white"/>
	</svg>;

	return [
		{ content: <div>
			<p className="headline">
				{ Icon } An alle, die Wikipedia in Deutschland nutzen
			</p>
			<p>Bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher kommen wir gleich zur Sache.
				An diesem { currentDayName } sind Sie gefragt. { campaignDaySentence }</p>
		</div> },
		{ content: <div>
			<p>Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert, aber 99&nbsp;% der Lesenden spenden
				nicht. <strong>Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel
				bereits heute erreicht.</strong></p>
		</div> },
		{ content: <div>
			<p>
				Menschen spenden aus einem einfachen Grund – weil Wikipedia nützlich ist. Schon der Preis einer Tasse
				Kaffee würde genügen. { visitorsVsDonorsSentence }
			</p>
		</div> },
		{ content: <div>
			<p>Wenn Wikipedia eine kommerzielle Seite sein würde, wäre das ein riesiger Verlust für die Welt. Sicher könnten
				wir mit Werbung eine Menge Geld verdienen. Aber dann wäre Wikipedia komplett anders. Wir könnten ihr nicht vertrauen.</p>
		</div> },
		{ content: <div>
			<p>Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun. Wenn Sie Wikipedia nützlich finden,
				nehmen Sie sich an diesem { currentDayName } bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas
				zurück. Vielen Dank!</p>
		</div> }
	];
}
