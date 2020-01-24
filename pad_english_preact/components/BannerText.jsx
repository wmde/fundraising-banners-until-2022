// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, numberOfDonors, campaignDaySentence, campaignParamters } = props;
	return <div className="banner-text">

		<p className="text__headline text__headline--bold">
			To all our readers in Germany.
		</p>

		<p className="text__paragraph text__paragraph--bold">
			<span> It's a little awkward, so we'll get straight to the point:</span>
			<span> { weekdayPrepPhrase } { currentDayName } we humbly ask you to protect Wikipedia's independence.
				{ campaignDaySentence } We depend on donations averaging about €&nbsp;23.83, but 99% of our readers
				don't give. Our fundraising appeal is displayed over { campaignParamters.millionImpressionsPerDay } million times a day,
				but currently only { numberOfDonors } people have donated. </span>

			<span className="text__highlight text__headline--bold">If everyone reading this gave a small amount, we could keep Wikipedia thriving for years to come.</span>

			<span> The price of your { currentDayName } coffee is all we need.
			When we made Wikipedia a non-profit, people warned us we'd regret it.
			But if Wikipedia became commercial, it would be a great loss to the world.
			Wikipedia is a place to learn, not a place for advertising.
			It unites all of us who love knowledge: contributors, readers and the donors who keep us thriving.
			The heart and soul of Wikipedia is a community of people working to bring you unlimited access to reliable,
			neutral information.
				Please take a minute to help us keep Wikipedia growing. Thank you!</span>
		</p>

	</div>;
}