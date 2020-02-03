// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function Slides( props ) {
	const { weekdayPrepPhrase, currentDayName, numberOfDonors, formattedGoalDonationSum, campaignParameters, progressBar } = props;
	return <div className="mini-banner-carousel">

		<div className="carousel-cell">
			<p className="goal-headline">Unser Spendenziel: { formattedGoalDonationSum }</p>
			{ progressBar }
		</div>

		<div className="carousel-cell">
			<p>Liebe Leserinnen und Leser:</p>
			<p>Über { campaignParameters.millionImpressionsPerDay } Millionen Mal wird unser Spendenaufruf täglich angezeigt,
				aber nur { numberOfDonors } Menschen haben bisher gespendet.
				Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten,
				wäre unsere Spendenkampagne am heutigen { currentDayName } vorbei.</p>

		</div>

		<div className="carousel-cell">
			<p className="text--capitalize-first-letter">{ weekdayPrepPhrase } { currentDayName } sind Sie in Deutschland gefragt.
				Schon der Preis einer Tasse Kaffee würde genügen.</p>
		</div>

		<div className="carousel-cell">
			<p>Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun.</p>
		</div>

		<div className="carousel-cell">
			<p>Wenn Sie Wikipedia nützlich finden, nehmen Sie sich an diesem { currentDayName } bitte
				eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück.</p>
		</div>
	</div>;
}
