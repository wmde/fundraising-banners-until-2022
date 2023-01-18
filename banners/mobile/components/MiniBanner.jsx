import { h } from 'preact';
import * as PropTypes from 'prop-types';
import ProgressBar, { AmountToShowOnRight } from '../../../components/ProgressBar/ProgressBar';
import CloseIconMobile from '../../../components/Icons/CloseIconMobile';
import Slider from '../../../components/Slider/Slider';

export default function MiniBanner( props ) {
	const Slides = props.slides;
	const ProgressBarComponent = <ProgressBar
		formatters={ props.formatters }
		daysLeft={ props.campaignProjection.getRemainingDays() }
		donationAmount={ props.campaignProjection.getProjectedDonationSum() }
		goalDonationSum={ props.campaignProjection.goalDonationSum }
		missingAmount={ props.campaignProjection.getProjectedRemainingDonationSum() }
		setStartAnimation={ props.setStartAnimation }
		animate={ true }
		amountToShowOnRight={ AmountToShowOnRight.NONE }
		isLateProgress={ props.campaignParameters.isLateProgress }
	/>;

	return <div className="wmde-banner-mini">
		<div className="wmde-banner-mini-close">
			<button className="wmde-banner-mini-close-button t-main-banner-close" onClick={ props.onClose }><CloseIconMobile/></button>
		</div>

		<header className="wmde-banner-mini-headline">
			<div className="wmde-banner-mini-headline-background">
				<span className="wmde-banner-mini-headline-content">Ist Ihnen Wikipedia 5&nbsp;€ wert?</span>
			</div>
		</header>

		<div className="wmde-banner-mini-banner-slideshow">
			<Slider
				slides={ Slides( props.dynamicCampaignText, ProgressBarComponent ) }
				onSlideChange={ props.onSlideChange }
				registerAutoplay={ props.registerSliderAutoplayCallbacks }
				interval={ props.sliderAutoPlaySpeed }
				sliderOptions={ { loop: false } }
			/>
		</div>

		<button className="wmde-banner-mini-button" onClick={ props.onExpandFullpage }>
			Jetzt spenden
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
