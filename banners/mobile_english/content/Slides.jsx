import { h } from 'preact';

export default function Slides( dynamicCampaignText, progressBar ) {
	const { currentDayName, goalDonationSum } = dynamicCampaignText;
	return [
		{
			content: <div>
				<p><strong>Our donation target: €{ goalDonationSum } million</strong></p>
				{ progressBar }
			</div>
		},
		{
			content: <div className="carousel-cell-first">
				<p><strong>To all our readers in Germany: </strong></p>
				<p>This { currentDayName } your support is requested by the nonprofit that collects donations on Wikipedia to support free knowledge.</p>
			</div>
		},
		{
			content: <div>
				<p>Each year, thanks to the 1% of readers who give to support our nonprofit mission, we
					can expand the reach of free knowledge to new corners of the world.</p>
			</div>
		},
		{
			content: <div>
				<p>
					<span className="wmde-banner-slider-text-animated-highlight">If Wikipedia matters and is
						useful to you too, please join them and donate €5 today.</span> Give
					only what you can comfortably give: what matters is your support, not the size of your gift.</p>
			</div>
		},
		{
			content: <div>
				<p>Online, Wikipedia is the closest thing we have to a public park or a library where everyone
					can go to learn. And that's priceless. Thank you.
				</p>
				<div>
					<i> — Wikimedia Fördergesellschaft</i>
				</div>
			</div>
		}
	];
}
