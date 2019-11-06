import {Component, h, Fragment } from 'preact';
import DesktopBanner from './DesktopBanner';
import MobileBanner from './MobileBanner';
import TranslationContext from '../components/TranslationContext';

export default class Banner extends Component {
	constructor(props) {
		super(props);
		this.state = { bannerVisible: true }
	}

	componentDidMount() {
		if ( this.startAnimation ) {
			this.startAnimation();
		}
	}

	closeBanner = e => {
		this.props.trackingData.eventTracker.trackEvent( 'banner-closed', this.props.trackingData.bannerCloseTrackRatio );
		e.preventDefault();
		this.setState( { bannerVisible: false } )
	};

	setStartAnimation = ( startAnimation ) => {
		this.startAnimation = startAnimation;
	};

	render( props, state, context ) {
		return <Fragment>
			<TranslationContext.Provider value={props.translations}>
				<DesktopBanner { ...props} closeBanner={this.closeBanner} bannerVisible={this.state.bannerVisible} setStartAnimation={this.setStartAnimation} />
				<MobileBanner {...props} sliderAutoPlaySpeed={5000} closeBanner={this.closeBanner} bannerVisible={this.state.bannerVisible} />
			</TranslationContext.Provider>
		</Fragment>
	}

}

