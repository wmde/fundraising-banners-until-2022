// eslint-disable-next-line no-unused-vars
import { Component, Fragment, h } from 'preact';
import classNames from 'classnames';

import { Slider } from '../../shared/banner_slider';
import MobileBannerFullpage from './MobileBannerFullpage';
import ProgressBar from '../../shared/components/ui/ProgressBar';
import Infobox from '../../shared/components/ui/Infobox';


export default class MobileBanner extends Component {
	constructor( props ) {
		super( props );
		this.state = { isFullPageVisible: false };
		this.animateHighLight = null;
	}

	componentDidMount() {
		this.bannerSlider = new Slider( this.props.sliderAutoPlaySpeed );
		this.bannerSlider.initialize();
		this.bannerSlider.enableAutoplay();
	}

	// eslint-disable-next-line no-unused-vars
	showForm = e => {
		this.props.trackingData.eventTracker.trackEvent( 'mobile-mini-banner-expanded', this.props.trackingData.bannerClickTrackRatio );
		this.setState( { isFullPageVisible: true } );
		if ( this.animateHighLight ) {
			this.animateHighLight();
		}
	};

	setAnimateHighlight = cb => { this.animateHighLight = cb; };

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		return <Fragment>
			<div className={ classNames( 'mini-banner', { 'is-hidden': this.state.isFullPageVisible || !props.bannerVisible } ) }>
				<div className="mini-banner-box">
					<div className="mini-banner-content">
						<div className="mini-banner-headline">
							<div>
								<span>Die Wikimedia-Spendenkampagne</span>
							</div>
						</div>
						<div id="mini-banner-close-button" className="mini-banner-close-button" onClick={ props.closeBanner }></div>



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
									setStartAnimation={props.startAnimation}
									animate={false}
								/> )
							}}
						/>




						<div className="mini-banner__tab">
							<div className="mini-banner__tab-inner" onClick={ props.onExpandFullpage }>
								Jetzt spenden
							</div>
						</div>
					</div>
				</div>
			</div>

			<MobileBannerFullpage { ...props }
				isFullPageVisible={ this.state.isFullPageVisible }
				animateHighlightTrigger={ this.setAnimateHighlight }
			/>
		</Fragment>;
	}
}
