import { h } from 'preact';
import getEnglishOrdinalSuffixOf from '../../../shared/english_ordinal';
import ChevronLeftIcon from './ui/ChevronLeftIcon';
import ChevronRightIcon from './ui/ChevronRightIcon';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, bannerSliderNext, bannerSliderPrevious, overallImpressionCount } = props;

	return <div className="banner-text">
		<a href="banners/pad_english/components/BannerText#" className="banner-slider-previous" onClick={ bannerSliderPrevious }><ChevronLeftIcon/></a>

		<div className="navigation-wrapper">
			<div className="mini-banner-carousel">
				<p>
					<img className="info-icon" src="https://upload.wikimedia.org/wikipedia/donate/9/99/RedInfoI.svg" alt="info_icon" width="16" height="16" />
					<span className="text__headline--italic">To all our readers in Germany,</span>
					<span>It might be a little awkward, but please don't scroll past
				this. {campaignDaySentence} This {currentDayName}, for
				the {getEnglishOrdinalSuffixOf( overallImpressionCount )} time
				recently, we humbly ask you to defend Wikipedia's independence.
			99% of our readers don't give; they simply look the other way.</span>
				</p>
				<p>If you are an exceptional reader who has already donated, we
			sincerely thank you. We depend on donations averaging
			about €21.60. {visitorsVsDonorsSentence}</p>
				<p>If you donate just € 5, Wikipedia could keep thriving for years.
			If Wikipedia has given you € 5 worth of knowledge this year, take a
			minute to donate. Show the volunteers who bring you reliable,
			neutral information that their work matters. Thank you.</p>
			</div>
			<div id="dots-navigation"></div>

		</div>
		<a href="banners/pad_english/components/BannerText#" className="banner-slider-next" onClick={ bannerSliderNext }><ChevronRightIcon/></a>
	</div>;
}
