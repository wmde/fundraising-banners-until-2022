import { h } from 'preact';
import * as PropTypes from 'prop-types';
import ProgressBar, { AmountToShowOnRight } from '../../../components/ProgressBar/ProgressBar';
import Slider from '../../../components/Slider/Slider';
import CloseIconChunky from '../../../components/Icons/CloseIconChunky';
import ButtonClose from '../../../components/ButtonClose/ButtonClose';

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
		<ButtonClose onClick={ props.onClose } icon={ <CloseIconChunky/> }/>

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
