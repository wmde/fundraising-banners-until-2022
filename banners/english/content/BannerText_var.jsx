import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function BannerText( props ) {
	const { currentDayName } = props.dynamicCampaignText;

	return <div>
		<p>
			<strong><InfoIcon/> To all our readers in Germany, </strong>
		</p>
		<p>
			This { currentDayName } your support is requested by the nonprofit that collects donations on Wikipedia
			to support free knowledge. If Wikipedia has given you €5 worth of knowledge this year, please join the
			readers who donate. Donations support the technology that makes our projects possible, and help us
			provide resources to the groups who build local communities of contributors to create our millions
			of articles and images. They also help us advocate for public policy to advance the cause of free knowledge
			worldwide and defend information access in countries
			struggling with censorship. <span className="wmde-banner-text-animated-highlight"> Today, we invite you to
			donate €5, €25, €50 or whatever seems right to you.</span> Show the world that free access
			to independent and unbiased information matters to you.
			Thank you for your help. — <i>Wikimedia Fördergesellschaft</i>
		</p>
	</div>;
}
