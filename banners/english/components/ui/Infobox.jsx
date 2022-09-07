import { h } from 'preact';

export default function Infobox( { bannerText, dynamicCampaignText } ) {
	const BannerText = bannerText;
	return <div className="banner-infobox">
		<BannerText
			dynamicCampaignText={ dynamicCampaignText }
		/>
	</div>;
}
