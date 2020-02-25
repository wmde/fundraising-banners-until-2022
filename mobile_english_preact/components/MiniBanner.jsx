// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import Infobox from '../../shared/components/ui/Infobox';
import ProgressBar from '../../shared/components/ui/ProgressBar';
import * as PropTypes from 'prop-types';

export default function MiniBanner( props ) {
	const campaignProjection = props.campaignProjection;
	return <div className="mini-banner">
		<div className="mini-banner__box">
			<div className="mini-banner__content">
				<header className="headline">
					<div className="headline__container">
						<span className="headline__content">the wikimedia fundraising campaign</span>
					</div>
				</header>
				<div className="close-button" onClick={props.onClose}/>

				<Infobox
					campaignParameters={props.campaignParameters}
					campaignProjection={campaignProjection}
					formatters={props.formatters}
					bannerText={props.slides}
					propsForText={{
						formattedGoalDonationSumNumeric: props.formatters.millionFormatterNumericOnly( campaignProjection.goalDonationSum / 1000000 ),
						progressBar: ( <ProgressBar
							formatters={props.formatters}
							daysLeft={campaignProjection.getRemainingDays()}
							donationAmount={campaignProjection.getProjectedDonationSum()}
							goalDonationSum={campaignProjection.goalDonationSum}
							missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
							setStartAnimation={props.startAnimation}
							animate={false}
						/> )
					}}
				/>

				<div className="mini-banner__tab">
					<div className="mini-banner__tab-inner" onClick={props.onExpandFullpage}>
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
