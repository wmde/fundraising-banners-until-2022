import { h } from 'preact';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName } = dynamicCampaignText;

	return [
		{
			content: <div>
				<p>An alle, die Wikipedia in Deutschland nutzen. Vielleicht kommen wir gerade ungelegen,
					aber dennoch: Klicken Sie jetzt bitte nicht weg!</p>
			</div>
		},
		{
			content: <div>
				<p>Am heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia zu sichern.</p>
			</div>
		},
		{
			content: <div>
				<p>Wikipedia wird durch Spenden von durchschnittlich 22,66&nbsp;€ finanziert. <strong>Doch schon mit einer
					Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln.</strong></p>
			</div>
		},
		{
			content: <div>
				<p><strong>Millionen Menschen nutzen Wikipedia, aber 99&nbsp;% spenden nicht – sie übergehen diesen
					Aufruf.</strong> Die meisten Menschen spenden, weil sie Wikipedia nützlich finden.</p>
			</div>
		},
		{
			content: <div>
				<p>Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt? <strong>Dann nehmen
					Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. Vielen Dank!</strong></p>
			</div>
		}
	];
}
