// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = props;

	return <div className="banner-text">
		<div className="banner-text-inner">

			<div className="banner-text-ctrl">
				<p>
					<img className="info-icon" height="16" width="16" src="https://upload.wikimedia.org/wikipedia/commons/9/93/Info-icon-black-on-yellow.svg" alt="info_icon" />
					<strong> To all our readers in Germany,</strong>
				</p>
				<p>
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
					<span> Please take a minute to help us keep Wikipedia growing.</span>
					<span> Thank you! </span>
				</p>
			</div>

			<div className="banner-text-var">
				<p>
					<img className="info-icon" height="16" width="16" src="https://upload.wikimedia.org/wikipedia/commons/9/93/Info-icon-black-on-yellow.svg" alt="info_icon" />
					<strong> To all our readers in Germany,</strong>
				</p>
				<p>
					It might be awkward, but please don't scroll past this. { campaignDaySentence } This { currentDayName }, for the 1st time
					recently, we humbly ask you to defend Wikipedia's independence. 99% of our readers don't give;
					they simply look the other way. If you are an exceptional reader who has already donated,
					we sincerely thank you. We depend on donations averaging about € 22.81.{ ' ' }
					{ visitorsVsDonorsSentence }
					<strong> If you donate just € 5, Wikipedia could keep thriving for years. </strong>
					Most people donate because Wikipedia is useful.
					If Wikipedia has given you <span className="no-wrap">€ 5</span> worth of knowledge this year,
					take a minute to donate. Show the volunteers who bring you reliable,
					neutral information that their work matters. Thank you.
				</p>
			</div>

		</div>
	</div>;
}
