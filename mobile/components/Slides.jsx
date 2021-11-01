import { h } from 'preact';

export default function Slides( dynamicCampaignText, progressBar ) {
	const { currentDayName, visitorsVsDonorsSentence } = dynamicCampaignText;

	return [
		{
			content: <div className="carousel-cell-first">
				<p>Liebe Leserinnen und Leser in Deutschland: Zum ersten Mal seit langem möchten wir Sie an diesem{ ' ' }
					{ currentDayName } bescheiden darum bitten, die Unabhängigkeit von Wikipedia zu sichern.</p>
				{ progressBar }
			</div>
		},
		{
			content: <div>
				<p>Vielleicht kommen wir gerade ungelegen, aber dennoch: Bitte klicken Sie jetzt nicht weg!</p>
			</div>
		},
		{
			content: <div>
				<p>Insgesamt spenden 99% unserer Leserinnen und Leser nichts - sie übergehen diesen Aufruf. <span className="text-highlight">Doch
					schon mit einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln.</span></p>
			</div>
		},
		{
			content: <div>
				<p>Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert.{ ' ' }
					<span className="text-highlight">{ visitorsVsDonorsSentence }</span></p>
			</div>
		},
		{
			content: <div>
				<p>Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt?
					<span className="text-highlight"> Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück.</span></p>
			</div>
		}
	];
}
