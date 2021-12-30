import { h } from 'preact';
import ImageWithCopyright from './ImageWithCopyright';
import { integerFormatter } from '../../shared/number_formatter/en';

export default function MembershipMoreInfo( props ) {
	const numberOfDonors = integerFormatter( props.campaignParameters.donationProjection.donorsBase );
	const MoreInfoCallToAction = props.moreInfoCallToAction;
	const addTrackingParams = url =>
		`${url}piwik_campaign=${props.campaignName}&piwik_kwd=${props.bannerName}&bImpCount=
		${props.impressionCounts.bannerCount}`;
	const formAction = 'https://spenden.wikimedia.de/apply-for-membership?';
	const formParams = {
		bImpCount: props.impressionCounts.bannerCount,
		piwik_campaign: props.campaignName,
		piwik_kwd: props.bannerName,
		type: 'sustaining',
		locale: 'en_GB'
	};

	return <div className="more-info__wrapper">
		<div className="more-info__intro">
			<p>We got there! But it was a really close call.</p>
		</div>
		<div className="more-info__text">
			<ImageWithCopyright/>
			<p> {numberOfDonors} wonderful people have reacted to our fundraising appeal over the past weeks and
				showed their appreciation of this project. I would like to thank every single one of you with all my
				heart! To be frank, though, this time it was considerably more difficult than usual. We only reached
				our fundraising target in the final days of the campaign. This makes me pause and reflect.
			</p>

			<p>
				We are going through challenging times: Almost two years of the Covid-19 pandemic have left me
				exhausted, and I imagine many others feel the same. In discussions, facts are becoming increasingly
				less important. At the same time, trust in the power of institutions to provide orientation is dwindling.
				This is a climate that also impacts on the willingness to give money to Wikipedia.
			</p>

			<p>
				And yet, Wikipedia as the largest independent knowledge platform is one of the most trustworthy
				institutions on the internet – with a strong commitment to solid and well-documented knowledge.
				At the same time, it is an open and transparent space for debate where sources, forms of representation
				and expression are discussed. Nowadays, it is more valuable than ever that people have controversial
				conversations at all.
			</p>

			<p>
				Wikipedia ranks among the top 10 websites worldwide, the only one in this league that is non-profit.
				It is free of advertising, does not sell any personal data – and most notably, its use is free of charge.
				The success of our annual fundraising campaign is vitally important for Wikipedia’s existence and its
				future. This year, a successful outcome remained uncertain for a very long time!
			</p>

			<p>
				Which makes it all the more important that many more people support us on a regular basis. In Germany,
				around 90,000 people currently show their commitment to Wikipedia with a supporting membership and an
				average contribution of TBD euros – which are still not that many considering how popular Wikipedia is
				and how much it contributes to general knowledge. You can change this today: I invite you to join this
				circle of extraordinary people as a new supporting member. You can take part with a contribution of just
				2 euros per month. Please help us to strengthen the institution that is Wikipedia and secure its ongoing
				development in the long term.
			</p>

			<p>
				<strong>Join us as a supporting member – and support Wikipedia right now!</strong>
			</p>
		</div>

		<div className="call-to-action">
			<ul className="call-to-action__item">
				<li>Membership fees are tax-deductible</li>
				<li>A donation receipt is issued automatically</li>
				<li>No risk: You can cancel your donation at any time without notice</li>
				<li>At your request: Our exclusive Wikipedia tote bag</li>
			</ul>
			<div className="call-to-action__item">
				<MoreInfoCallToAction
					formAction={formAction}
					defaultFormParams={formParams}
					onSubmit={props.onSubmit}
				/>
			</div>
		</div>
		<p>
			<a className="more-info__link"
				href={ addTrackingParams( 'https://www.wikimedia.de/mitglieder/?' ) }>
				For more information, please visit our website
			</a>
		</p>
	</div>;
}
