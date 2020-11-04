// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function Slides( { formattedGoalDonationSumNumeric, currentDayName, visitorsVsDonorsSentence, progressBar } ) {
	return <div className="mini-banner-carousel">
		<div className="carousel-cell">
			<p className="goal-headline">Our donation target: { formattedGoalDonationSumNumeric } million Euros</p>
			{ progressBar }
		</div>
		<div className="carousel-cell">
			<p>To all our readers in Germany. We will get straight to the point:
				This { currentDayName } we ask you to protect Wikipedia's independence.</p>
		</div>
		<div className="carousel-cell">
			<p>{ visitorsVsDonorsSentence } The price of a coffee is all we need.</p>
		</div>
		<div className="carousel-cell">
			<p>If everyone reading this gave a small amount, we could keep Wikipedia thriving for years to come.</p>
		</div>
		<div className="carousel-cell">
			<p>Most people ignore this message. But we hope you’ll think about how useful
				it is to have unlimited access to reliable, neutral information.</p>
		</div>
		<div className="carousel-cell">
			<p>Please take one minute to help us keep Wikipedia growing. Thank you.</p>
		</div>
	</div>;
}
