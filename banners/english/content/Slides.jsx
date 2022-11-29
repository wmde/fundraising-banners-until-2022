import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName } = dynamicCampaignText;

	return [
		{
			content: <div>
				<p className="headline"><InfoIcon/> <strong> To all our readers in Germany, </strong></p>
				<p>This { currentDayName } your support is requested by the nonprofit that collects donations on
					Wikipedia to support Free Knowledge. If you can comfortably afford it this year, please
					join the readers who donate.</p>
			</div>
		},
		{
			content: <div>
				<p>
					These donations support the technology that makes our projects possible, and help us provide
					resources to the groups who build local communities of contributors to create our millions of
					articles and images. They also help us advocate for public policy to advance the cause of free
					knowledge worldwide and defend information access in countries struggling with censorship.
				</p>
			</div>
		},
		{
			content: <div>
				<p><span className="wmde-banner-slider-text-animated-highlight">Today, we invite you to donate €5 or
					whatever seems right to you.</span> Show the world that free access to independent and unbiased
					information matters to you. Thank you for your help. — Wikimedia Fördergesellschaft</p>
			</div>
		}
	];
}
