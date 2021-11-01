import { h } from 'preact';

export default function Slides( { currentDayName, formattedGoalDonationSumNumeric, progressBar, visitorsVsDonorsSentence, campaignDaySentence, overallImpressionCount } ) {
	return <div className="navigation-wrapper">
		<div className="mini-banner-carousel">
			<div className="carousel-cell keen-slider__slide">
				<p className="goal-headline">Unser Spendenziel: { formattedGoalDonationSumNumeric } Millionen Euro</p>
				{ progressBar }
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>An alle, die Wikipedia in Deutschland nutzen:
					Zum { overallImpressionCount } Mal seit langem möchten wir Sie an
					diesem { currentDayName } bescheiden darum bitten, die Unabhängigkeit
					von Wikipedia zu sichern.</p>
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie
					jetzt bitte nicht weg! { campaignDaySentence }</p>
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>Insgesamt spenden 99% nichts - sie übergehen diesen Aufruf. Schon mit
					einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln.</p>
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>
					{ visitorsVsDonorsSentence } Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert.
				</p>
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>
					Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt? Dann
					nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. Vielen Dank.
				</p>
			</div>
		</div>

		<div id="dots-navigation">
		</div>

	</div>;
}
