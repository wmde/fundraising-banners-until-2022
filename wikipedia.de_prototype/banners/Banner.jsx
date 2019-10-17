import {Component, h, Fragment } from 'preact';
import DesktopBanner from './DesktopBanner';
import MobileBanner from './MobileBanner';

export default class Banner extends Component {

	closeBanner = () => {
		console.log('TODO: set closed state')
	};

	render( props, state, context ) {
		return <Fragment>
			<DesktopBanner { ...props} closeBanner={this.closeBanner} />
			<MobileBanner {...props} sliderAutoPlaySpeed={5000} closeBanner={this.closeBanner} />
		</Fragment>
	}

}

