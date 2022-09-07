import { h } from 'preact';
import ProgressBar, { AmountToShowOnRight } from '../../../shared/components/ui/ProgressBar';
import * as PropTypes from 'prop-types';
import Slides from './Slides';
import Slider from '../../../shared/components/Slider';

export default function MiniBanner( props ) {
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

	return <div className="mini-banner">
		<div className="mini-banner__box">
			<div className="mini-banner__content">
				<header className="headline">
					<div className="headline__container">
						<span className="headline__content">the wikimedia fundraising campaign</span>
					</div>
				</header>
				<div className="close-button" onClick={props.onClose}/>

				<Slider
					slides={ Slides( props.dynamicCampaignText, ProgressBarComponent ) }
					onSlideChange={ props.onSlideChange }
					registerAutoplay={ props.registerSliderAutoplayCallbacks }
					interval={ props.sliderAutoPlaySpeed }
					sliderOptions={ { loop: false } }
				/>

				<div className="mini-banner__tab">
					<div className="mini-banner__tab-inner" onClick={ props.onExpandFullpage }>
						Donate now
					</div>
				</div>
			</div>
		</div>
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