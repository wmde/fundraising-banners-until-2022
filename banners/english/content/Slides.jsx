import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = dynamicCampaignText;

	return [
		{
			content: <div>
				<p className="headline"><InfoIcon/> <strong> To all our readers in Germany, </strong></p>
				<p>It might be a little awkward, so we'll get straight to the point. This { currentDayName } we
					humbly ask you to defend Wikipedia's independence.</p>
			</div>
		},
		{
			content: <div>
				<p>
					{ campaignDaySentence } 99% of our readers don't give; they simply look the other way. We
					depend on donations averaging about €22.66. { visitorsVsDonorsSentence }
				</p>
			</div>
		},
		{
			content: <div>
				<p>If you donate just €5, Wikipedia could keep thriving for years. If Wikipedia has given you
					€5 worth of knowledge this year, take a minute to donate. Thank you.</p>
			</div>
		}
	];
}
