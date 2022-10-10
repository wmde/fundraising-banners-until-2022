import { h } from 'preact';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = dynamicCampaignText;
	const Icon = <img className="info-icon" src="https://upload.wikimedia.org/wikipedia/donate/9/99/RedInfoI.svg" alt="info_icon" width="16" height="16" />;

	return [
		{ content: <div>
			<p className="headline">
				{ Icon } <strong> An alle, die Wikipedia in Deutschland nutzen </strong>
			</p>
			<p>
				Bitte verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher kommen wir gleich zur
				Sache. An diesem { currentDayName } sind Sie gefragt: { campaignDaySentence }</p>
		</div> },
		{ content: <div>
			<p>Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert, aber 99&nbsp;% der
				Lesenden spenden nicht. <strong>Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser
					Spendenziel bereits heute erreicht.</strong></p>
		</div> },
		{ content: <div>
			<p>
				Menschen spenden aus einem einfachen Grund – weil Wikipedia nützlich ist.
				Schon der Preis einer Tasse Kaffee würde genügen. { visitorsVsDonorsSentence }
			</p>
		</div> },
		{ content: <div>
			<p>Wenn Wikipedia eine kommerzielle Seite
				sein würde, wäre das ein riesiger Verlust für die Welt. Sicher könnten wir mit Werbung eine Menge Geld verdienen.
				Aber dann wäre Wikipedia komplett anders. Wir könnten ihr nicht vertrauen.</p>
		</div> },
		{ content: <div>
			<p>Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun. Wenn Sie Wikipedia
				nützlich finden, nehmen Sie sich an diesem { currentDayName } bitte
				eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück. <em>Vielen Dank!</em></p>
		</div> }
	];
}
