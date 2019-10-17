import { Component, Fragment, h } from 'preact';
import classNames from 'classnames'

import style from './MobileBanner.pcss';
import { Slider } from '../../mobile/banner_slider';
import MobileBannerFullpage from './MobileBannerFullpage';

export default class MobileBanner extends Component {
	constructor(props) {
		super(props);
		this.state = { isFullPageVisible: false }
	}

	componentDidMount() {
		this.bannerSlider = new Slider( this.props.sliderAutoPlaySpeed );
		this.bannerSlider.initialize();
		this.bannerSlider.enableAutoplay();
	}

	showForm = e => {
		this.props.trackingData.eventTracker.trackEvent( 'mobile-mini-banner-expanded', this.props.trackingData.bannerClickTrackRatio );
		this.setState( { isFullPageVisible: true } )
	};

	render( props, state, context ) {
		return <Fragment>
			<div className={ classNames('mini-banner', { 'is-hidden': this.state.isFullPageVisible || !props.bannerVisible } ) }>
				<div className="mini-banner-box">
					<div className="mini-banner-content">
						<div className="mini-banner-headline">
							<div>
								<span>Die Wikimedia-Spendenkampagne</span>
							</div>
						</div>
						<div id="mini-banner-close-button" className="mini-banner-close-button"
							 onclick={props.closeBanner}></div>
						<div className="mini-banner-carousel">
							<div className="carousel-cell">
								<p>Liebe Leserinnen und Leser, an diesem {props.currentDayName} sind Sie in Deutschland
									gefragt:</p>
							</div>
							<div className="carousel-cell">
								<p>Über {props.amountBannerImpressionsInMillion} Millionen Mal wird unser Spendenaufruf
									täglich angezeigt, aber nur {props.numberOfDonors} Menschen haben bisher gespendet. Schon
									der Preis einer Tasse Kaffee würde genügen.</p>
							</div>
							<div className="carousel-cell">
								<p className="goal-headline">Unser Spendenziel: 8,1&nbsp;Millionen&nbsp;Euro</p>
							</div>
							<div className="carousel-cell">
								<p>Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel
									bereits am heutigen {props.currentDayName} erreicht.</p>
							</div>
							<div className="carousel-cell">
								<p>Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun.</p>
							</div>
							<div className="carousel-cell">
								<p>Wenn Sie Wikipedia nützlich finden, nehmen Sie sich an diesem {props.currentDayName} bitte
									eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück.</p>
							</div>
						</div>
						<div className="mini-banner-tab">
							<div className="mini-banner-tab-inner" onClick={this.showForm}>
								Jetzt spenden
							</div>
						</div>
					</div>
				</div>
			</div>
			<MobileBannerFullpage {...props} isFullPageVisible={this.state.isFullPageVisible}/>
		</Fragment>
	}

}