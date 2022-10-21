import { h } from 'preact';
import * as PropTypes from 'prop-types';
import Slider from '../../../components/Slider/Slider';
import ProgressBar, { AmountToShowOnRight } from '../../../components/ProgressBar/LegacyProgressBar';
import CloseIconChunky from '../../../components/Icons/CloseIconChunky';
import ButtonClose from '../../../components/ButtonClose/ButtonClose';

export default function MiniBanner( props ) {
	const Slides = props.slides;
	const campaignProjection = props.campaignProjection;
	const ProgressBarComponent = <ProgressBar
		formatters={props.formatters}
		daysLeft={campaignProjection.getRemainingDays()}
		donationAmount={campaignProjection.getProjectedDonationSum()}
		goalDonationSum={campaignProjection.goalDonationSum}
		missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
		setStartAnimation={props.setStartAnimation}
		animate={true}
		amountToShowOnRight={AmountToShowOnRight.MISSING}
	/>;

	return <div className="wmde-banner-mini">
		<ButtonClose onClick={ props.onClose } icon={ <CloseIconChunky/> }/>

		<header className="wmde-banner-headline">
			<span className="wmde-banner-headline-content">the wikimedia fundraising campaign</span>
		</header>

		<div className="wmde-banner-mini-slideshow">
			<Slider
				slides={ Slides( props.dynamicCampaignText, ProgressBarComponent ) }
				onSlideChange={ props.onSlideChange }
				registerAutoplay={ props.registerSliderAutoplayCallbacks }
				interval={ props.sliderAutoPlaySpeed }
				sliderOptions={ { loop: false } }
			/>
		</div>

		<button className="wmde-banner-mini-button" onClick={ props.onExpandFullpage }>
			Donate now
		</button>
	</div>;
}

MiniBanner.propTypes = {
	slides: PropTypes.element,
	onClose: PropTypes.func,
	formatters: PropTypes.object,
	campaignProjection: PropTypes.any,
	campaignParameters: PropTypes.object,
	startAnimation: PropTypes.func,
	onExpandFullpage: PropTypes.func
};
