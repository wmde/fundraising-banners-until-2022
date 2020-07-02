// eslint-disable-next-line no-unused-vars
import { Component, Fragment, h } from 'preact';
import classNames from 'classnames';
import formatNumber from 'format-number';

import { Slider } from '../../shared/banner_slider';
import MobileBannerFullpage from './MobileBannerFullpage';
import ProgressBar from '../components/ProgressBar';

const millionFormatter = formatNumber( {
	decimal: ',',
	round: 1
} );

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
		this.props.trackingData.eventTracker.trackBannerEvent(
			'mobile-mini-banner-expanded',
			0,
			0,
			this.props.trackingData.bannerClickTrackRatio
		);
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
						<div className="mini-banner-carousel">
							<div className="carousel-cell">
								<p>Liebe Leserinnen und Leser, <br /> Millionen von Menschen nutzen Wikipedia, aber nur
									ein Bruchteil spendet. Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten,
									wäre unsere Spendenkampagne am heutigen { props.currentDayName } vorbei.</p>
							</div>
							<div className="carousel-cell">
								<p>An diesem { props.currentDayName } sind Sie in Deutschland gefragt. Schon der Preis
									einer Tasse Kaffee würde genügen.</p>
							</div>
							<div className="carousel-cell">
								<p className="goal-headline">Unser Spendenziel: { millionFormatter( campaignProjection.goalDonationSum / 1000000 ) }&nbsp;Millionen&nbsp;Euro</p>
								<ProgressBar
									locale={ props.locale }
									daysLeft={ campaignProjection.getRemainingDays() }
									donationAmount={ campaignProjection.getProjectedDonationSum() }
									goalDonationSum={ campaignProjection.goalDonationSum }
									missingAmount={ campaignProjection.getProjectedRemainingDonationSum() }
									setStartAnimation={ ()=>{} }
									animate={ false }
								/>
							</div>
							<div className="carousel-cell">
								<p>Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun.</p>
							</div>
							<div className="carousel-cell">
								<p>Wenn Sie Wikipedia nützlich finden, nehmen Sie sich an diesem { props.currentDayName } bitte
									eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück.</p>
							</div>
						</div>
						<div className="mini-banner-tab">
							<div className="mini-banner-tab-inner" onClick={ this.showForm }>
								Jetzt spenden
							</div>
						</div>
					</div>
				</div>
			</div>
			<MobileBannerFullpage { ...props } isFullPageVisible={ this.state.isFullPageVisible } animateHighlightTrigger={ this.setAnimateHighlight }/>
		</Fragment>;
	}
}
