// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function Slides( { formattedGoalDonationSumNumeric, currentDayName, progressBar, visitorsVsDonorsSentence } ) {
	return <div className="mini-banner-carousel">
		<div className="carousel-cell">
			<p className="goal-headline">Unser Spendenziel: { formattedGoalDonationSumNumeric } Millionen Euro</p>
			{ progressBar }
		</div>
		<div className="carousel-cell">
			<p>Liebe Leserinnen und Leser:</p>
			<p><span className="text-highlight">{ visitorsVsDonorsSentence }</span>. Wenn alle, die das
				jetzt lesen, einen kleinen Beitrag leisten, wäre unsere Spendenkampagne am
				heutigen { currentDayName } vorbei.</p>
		</div>
		<div className="carousel-cell">
			<p>An diesem { currentDayName } sind Sie in Deutschland gefragt. <span className="text-highlight">Schon der Preis
				einer Tasse Kaffee würde genügen</span>.</p>
		</div>
		<div className="carousel-cell">
			<p>Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun.</p>
		</div>
		<div className="carousel-cell">
			<p>Wenn Sie Wikipedia nützlich finden, nehmen Sie sich an diesem { currentDayName } bitte
				eine Minute Zeit und <span className="text-highlight">geben Wikipedia mit Ihrer Spende etwas zurück</span>.</p>
		</div>
	</div>;
}
