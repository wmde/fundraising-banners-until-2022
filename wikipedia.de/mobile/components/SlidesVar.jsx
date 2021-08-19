import { h } from 'preact';

export default function Slides( { currentDayName, formattedGoalDonationSumNumeric, progressBar, visitorsVsDonorsSentence } ) {
	return <div className="navigation-wrapper">
		<div className="mini-banner-carousel">
			<div className="carousel-cell keen-slider__slide">
				<p className="goal-headline">Unser Spendenziel: { formattedGoalDonationSumNumeric } Millionen Euro</p>
				{ progressBar }
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>Liebe Leserinnen und Leser:</p>
				<p>{ visitorsVsDonorsSentence } Wenn alle, die das
					jetzt lesen, einen kleinen Beitrag leisten, wäre unsere Spendenkampagne am
					heutigen { currentDayName } vorbei.</p>
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>An diesem { currentDayName } sind Sie in Deutschland gefragt. Schon der Preis
					einer Tasse Kaffee würde genügen.</p>
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun.</p>
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>Wenn Sie Wikipedia nützlich finden, nehmen Sie sich an diesem { currentDayName } bitte
					eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück.</p>
			</div>
		</div>

		<div id="dots-navigation">
		</div>

	</div>;
}
