import { h } from 'preact';
import Infobox from '../../shared/components/ui/Infobox';
import ProgressBar, { AmountToShowOnRight } from '../../shared/components/ui/ProgressBar';
import * as PropTypes from 'prop-types';
import ClockIcon from './ui/ClockIcon';
import CloseIcon from './ui/CloseIcon';

export default function MiniBanner( props ) {
	const campaignProjection = props.campaignProjection;
	return <div className="mini-banner">
		<div className="mini-banner__box">
			<div className="mini-banner__content">
				<div className="banner__close">
					<a className="minimise-link" onClick={ props.onMinimise }>
						<ClockIcon/> <span className="minimise-link-text">{ props.translations[ 'minimise-button' ] }</span>
					</a>
					<button className="close-button" onClick={ props.onClose }><CloseIcon/></button>
				</div>

				<header className="headline">
					<div className="headline__container">
						<span className="headline__content">{ props.sliderHeading }</span>
					</div>
				</header>

				<Infobox
					campaignParameters={props.campaignParameters}
					campaignProjection={campaignProjection}
					formatters={props.formatters}
					bannerText={props.slides}
					propsForText={{
						formattedGoalDonationSumNumeric: props.formatters.millionFormatterNumeric( campaignProjection.goalDonationSum ),
						progressBar: ( <ProgressBar
							formatters={props.formatters}
							daysLeft={campaignProjection.getRemainingDays()}
							donationAmount={campaignProjection.getProjectedDonationSum()}
							goalDonationSum={campaignProjection.goalDonationSum}
							missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
							setStartAnimation={props.setStartAnimation}
							animate={true}
							amountToShowOnRight={AmountToShowOnRight.MISSING}
						/> )
					}}
				/>

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
