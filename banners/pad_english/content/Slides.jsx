import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, currentDate } = dynamicCampaignText;

	return [
		{
			content: <div>
				<p className="headline">
					<InfoIcon fill={ '#990a00' }/> To all our readers in Germany,
				</p>
				<p>Please don't skip this 1 minute read. This { currentDayName } { currentDate }, we’re asking for your
					support. We are the nonprofit that collects donations on Wikipedia to support free knowledge. If you
					can this year, please join the 1% of readers who give.</p>
			</div>
		},
		{
			content: <div>
				<p>Now is the time we invite you to give €5 or whatever seems right. Wikipedia is different from other
					websites. No advertising, no subscription fees, no paywalls. Instead, our nonprofit relies on reader
					donations averaging €22.66.</p>
			</div>
		},
		{
			content: <div>
				<p>Online, Wikipedia is the closest thing we have to a public park or a library where everyone can
					go to learn. And that's priceless. <span className="wmde-banner-slider-text-animated-highlight">If
						Wikipedia has given you €5 worth of knowledge this year, please support the technology that
						makes our projects possible and advance the cause of free knowledge
						worldwide.</span> —<em>Wikimedia Fördergesellschaft</em></p>
			</div>
		}
	];
}
