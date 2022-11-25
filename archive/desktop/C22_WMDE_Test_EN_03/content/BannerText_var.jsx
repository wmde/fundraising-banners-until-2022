import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function BannerText( props ) {
	const { currentDayName } = props.dynamicCampaignText;

	return <div>
		<p>
			<strong><InfoIcon/> To all our readers in Germany, </strong>
		</p>
		<p>
			This { currentDayName } we interrupt your reading to humbly ask you to support Wikipedia’s independence.
			Only 1% of our readers give. Many think they’ll give later, but then forget. If you donate just €5, or
			whatever you can this { currentDayName }, Wikipedia could keep thriving for years. We don't run ads, and
			we never have. We rely on our readers for support. <span className="wmde-banner-text-animated-highlight">We
			serve millions of people, but we run on a fraction of what other top sites spend.</span> Wikipedia is
			special. It is like a library or a public park where we can all go to learn. If Wikipedia has given you
			€5 worth of knowledge this year, take a minute to donate. Show the world that access to neutral information
			matters to you. Thank you.
		</p>
	</div>;
}
