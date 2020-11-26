// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = props;

	return <div className="banner-text">

		<div className="banner-text-inner">

			<div className="banner-text-ctrl">
				<p>
					<span className="banner-headline">
						<img className="info-icon" height="16" width="16" src="https://upload.wikimedia.org/wikipedia/commons/9/93/Info-icon-black-on-yellow.svg" alt="info_icon" />
						<strong> To all our readers in Germany, </strong>
					</span>
					It's a little awkward, so we'll get straight to the point:
					<span> { weekdayPrepPhrase } { currentDayName } we humbly ask you to protect Wikipedia's independence.
						{ campaignDaySentence } We depend on donations averaging about €&nbsp;22.81, but 99% of our readers
				don't give. { visitorsVsDonorsSentence }
					</span>

					<span className="text__highlight text__headline--bold"> If everyone reading this gave a small
				amount, we could keep Wikipedia thriving for years to come. </span>

					<span>The price of your { currentDayName } coffee is all we need.
				When we made Wikipedia a non-profit, people warned us we'd regret it.
				But if Wikipedia became commercial, it would be a great loss to the world.
				Wikipedia is a place to learn, not a place for advertising.
				It unites all of us who love knowledge: contributors, readers and the donors who keep us thriving.
				The heart and soul of Wikipedia is a community of people working to bring you unlimited access
				to reliable, neutral information.</span>
					<span> If Wikipedia gave you €&nbsp;5 worth of knowledge this year,
				take a minute to donate and help us to keep Wikipedia growing.</span>
					<span> Thank you! </span>
				</p>
			</div>

			<div className="banner-text-var">
				<p>
					<span className="banner-headline">
						<img className="info-icon" height="16" width="16" src="https://upload.wikimedia.org/wikipedia/commons/9/93/Info-icon-black-on-yellow.svg" alt="info_icon" />
						<strong> To all our readers in Germany, </strong>
					</span>
					It's a little awkward, so we'll get straight to the point:
					<span> { weekdayPrepPhrase } { currentDayName } we humbly ask you to protect Wikipedia's independence.
						{ campaignDaySentence } We depend on donations averaging about €&nbsp;22.81, but 99% of our readers
				don't give. { visitorsVsDonorsSentence }
					</span>

					<span className="text__highlight text__headline--bold"> If everyone reading this gave a small
				amount, we could keep Wikipedia thriving for years to come. </span>

					<span>The price of your { currentDayName } coffee is all we need.
				When we made Wikipedia a non-profit, people warned us we'd regret it.
				But if Wikipedia became commercial, it would be a great loss to the world.
				Wikipedia is a place to learn, not a place for advertising.
				It unites all of us who love knowledge: contributors, readers and the donors who keep us thriving.
				The heart and soul of Wikipedia is a community of people working to bring you unlimited access
				to reliable, neutral information.</span>
					<span> Please take a minute to donate and help us keep Wikipedia growing.</span>
					<span> Thank you! </span>
				</p>
			</div>
		</div>

	</div>;
}
