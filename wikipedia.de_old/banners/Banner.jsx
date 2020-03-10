// eslint-disable-next-line no-unused-vars
import { Component, h, Fragment } from 'preact';
import DesktopBanner from './DesktopBanner';
import MobileBanner from './MobileBanner';
import TranslationContext from '../../shared/components/TranslationContext';

export default class Banner extends Component {
	constructor( props ) {
		super( props );
		this.state = { bannerVisible: true };
	}

	closeBanner = e => {
		this.props.trackingData.eventTracker.trackEvent( 'banner-closed', this.props.trackingData.bannerCloseTrackRatio );
		e.preventDefault();
		this.setState( { bannerVisible: false } );
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		return <Fragment>
			<TranslationContext.Provider value={props.translations}>
				<DesktopBanner { ...props} closeBanner={this.closeBanner} bannerVisible={this.state.bannerVisible} />
				<MobileBanner {...props} sliderAutoPlaySpeed={5000} closeBanner={this.closeBanner} bannerVisible={this.state.bannerVisible} />
			</TranslationContext.Provider>
		</Fragment>;
	}

}
