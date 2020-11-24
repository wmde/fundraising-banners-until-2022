// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function Slides( { formattedGoalDonationSumNumeric, campaignDaySentence, currentDayName, progressBar, visitorsVsDonorsSentence } ) {

	return <div><div className="mini-banner-carousel">
		<div className="carousel-cell">
			<p className="goal-headline">Unser Spendenziel: { formattedGoalDonationSumNumeric } Millionen Euro</p>
			{ progressBar }
		</div>
		<div className="carousel-cell">
			<p>An alle unsere Leserinnen und Leser in Deutschland. Vielleicht kommen wir gerade ungelegen,
				aber dennoch: Bitte klicken Sie jetzt nicht weg! { campaignDaySentence }</p>
		</div>
		<div className="carousel-cell">
			<p>Zum ersten Mal seit langem möchten wir Sie an diesem { currentDayName } bescheiden darum bitten,
				die Unabhängigkeit von Wikipedia zu verteidigen. <span className="text-highlight">{ visitorsVsDonorsSentence }</span></p>
		</div>
		<div className="carousel-cell">
			<p>Wikipedia wird durch Spenden von durchschnittlich 22,81&nbsp;€ finanziert. <span className="text-highlight">Doch schon mit einer
				Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln.</span></p>
		</div>
		<div className="carousel-cell">
			<p>Insgesamt spenden 99% unserer Leserinnen und Leser nichts – sie
				übergehen diesen Aufruf. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert von 5 € geschenkt?
			<span className="text-highlight"> Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück.</span>
			</p>
		</div>
	</div>
	</div>;
}
