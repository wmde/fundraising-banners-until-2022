import { h } from 'preact';
import InfoIcon from './ui/InfoIcon';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, overallImpressionCount } = dynamicCampaignText;

	return [
		{ content: <div>
			<p className="headline">
				<InfoIcon/> An alle, die Wikipedia in Deutschland nutzen
			</p>
			<p>Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg! Dies ist der { overallImpressionCount }.
				Spendenaufruf, den wir Ihnen zeigen. Am heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia zu
				sichern.</p>
		</div> },
		{ content: <div>
			<p>{ campaignDaySentence } Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert. Insgesamt spenden 99% nichts
				- sie übergehen diesen Aufruf. Sollten Sie zu dem kleinen Kreis gehören, die bereits gespendet haben, danken wir Ihnen sehr herzlich.
			</p>
		</div> },
		{ content: <div>
			<p>{ visitorsVsDonorsSentence } Die meisten Menschen spenden, weil Sie Wikipedia nützlich finden. Schon mit einer Spende
				von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln.
			</p>
		</div> },
		{ content: <div>
			<p>Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt?
				Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. Vielen Dank.</p>
		</div> }
	];
}
