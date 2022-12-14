import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, currentDate } = dynamicCampaignText;

	return [
		{
			content: <div>
				<p className="headline"><InfoIcon/> <strong> To all our readers in Germany, </strong></p>
				<p>This { currentDayName } { currentDate }, with only a few days before 2022 comes to an end, we
					humbly ask for your support. We are the nonprofit that collects donations on Wikipedia to
					support free knowledge. If you can, please join the 1% of readers who give.</p>
			</div>
		},
		{
			content: <div>
				<p>
					<span className="wmde-banner-slider-text-animated-highlight">If everyone reading this right now
						gave just €5, we'd hit our annual goal in a couple of hours.</span> The price of a cup of
					coffee is all we ask. It's easy to ignore our messages, but we hope you'll take one minute to
					think about how useful Wikipedia is in your life.
				</p>
			</div>
		},
		{
			content: <div>
				<p>Online, Wikipedia is the closest thing we have to a public park or a library where everyone can
					go to learn. If Wikipedia has given you €5 worth of knowledge this year, please support the
					technology that makes our projects possible and advance the cause of free knowledge
					worldwide. — <i>Wikimedia Fördergesellschaft</i></p>
			</div>
		}
	];
}
