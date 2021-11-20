import { h } from 'preact';
import ProgressBar, { AmountToShowOnRight } from '../../shared/components/ui/ProgressBar';
import * as PropTypes from 'prop-types';
import CloseIcon from './ui/CloseIcon';
import Slider from '../../shared/components/Slider';
import Slides from './Slides';

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
				<div className="banner__close">
					<button className="close-button" onClick={ props.onClose }><CloseIcon/></button>
				</div>

				<header className="headline">
					<div className="headline__container">
						<span className="headline__content">{ props.sliderHeading }</span>
					</div>
				</header>

				<div className="banner__slideshow">
					<Slider
						slides={ Slides( props.dynamicCampaignText, ProgressBarComponent ) }
						onSlideChange={ props.onSlideChange }
						registerAutoplay={ props.registerSliderAutoplayCallbacks }
						interval={ props.sliderAutoPlaySpeed }
						sliderOptions={ { loop: false } }
					/>
				</div>

				<div className="mini-banner__tab">
					<button className="mini-banner__tab-inner mini-banner__button" onClick={props.onExpandFullpage}>
						Jetzt spenden
					</button>
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
