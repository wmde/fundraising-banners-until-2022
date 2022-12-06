import { h } from 'preact';

export default function BannerText( props ) {
	const { currentDayName } = props.dynamicCampaignText;

	return <div className="banner-text">
		<p className="banner-text-title">
			To all our readers in Germany,
		</p>
		<p>
			This { currentDayName } your support is requested by the nonprofit that collects donations on Wikipedia
			to support free knowledge. Each year, thanks to the 1% of readers who give to support our nonprofit
			mission, we can expand the reach of free knowledge to
			new corners of the world. <span className="wmde-banner-text-animated-highlight">If Wikipedia matters
			and is useful to you too, please join them and donate €5 today.</span> Give only what you can comfortably
			give: what matters is your support, not the size of your gift. Together, let's preserve this special
			space on the internet. Online, Wikipedia is the closest thing we have to a public park or a library
			where everyone can go to learn. And that's priceless. Thank you.
		</p>
		<i>— Wikimedia Fördergesellschaft</i>
	</div>;
}
