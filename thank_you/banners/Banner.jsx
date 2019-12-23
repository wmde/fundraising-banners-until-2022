// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import { onMediaWiki } from '../../shared/mediawiki_checks';
import classNames from 'classnames';

import ExpandButton from '../components/ExpandButton';
import ProgressBar from '../components/ProgressBar';

export default class Banner extends Component {
	ref = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			bannerVisible: true,
			infoVisible: false,
			donationSkinId: '1'
		};
		this.infoVisibleChanged = false;
	}

	closeBanner = e => {
		this.props.trackingData.eventTracker.trackBannerEvent( 'banner-closed', 0, 0, this.props.trackingData.bannerCloseTrackRatio );
		e.preventDefault();
		this.setState( { bannerVisible: false } );
		if ( onMediaWiki() ) {
			mw.centralNotice.hideBanner();
		}
		this.props.onClose();
	};

	updateSkinId = () => {
		const donationSkinId = window.innerWidth > 900 ? '1' : '0';
		this.setState( ( { donationSkinId } ) );
	};

	componentDidMount() {
		window.addEventListener( 'resize', this.updateSkinId );
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.updateSkinId );
	}

	// eslint-disable-next-line no-unused-vars
	componentWillUpdate( nextProps, nextState, nextContext ) {
		this.infoVisibleChanged = nextState.infoVisible !== this.state.infoVisible;
	}

	componentDidUpdate() {
		if ( this.infoVisibleChanged ) {
			this.props.skinFunctions.addSpaceInstantly( this.ref.current.offsetHeight );
			if ( this.state.infoVisible ) {
				window.scrollTo( 0, 0 );
			}
		}
	}

	expandBanner = e => {
		const infoVisible = !this.state.infoVisible;
		this.props.trackingData.eventTracker.trackBannerEvent( 'mini-banner-expanded', 0, 0, this.props.trackingData.bannerClickTrackRatio );
		e.preventDefault();
		this.setState( { infoVisible } );
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const MoreInfo = props.moreInfo;

		return <div
			className={classNames(
				'wmde-banner',
				state.infoVisible ? 'wmde-banner--expanded' : 'wmde-banner--collapsed',
				state.bannerVisible ? '' : 'wmde-banner--hidden'
			)}
			ref={this.ref}>
			<div className="banner-wrapper">
				<div className={'small-banner'}>
					<div className="small-banner__inner" onClick={ this.expandBanner }>
						<div className="info-icon"><span className="info-icon__i">i</span></div>
						<div className="thankyou-message">Lesen Sie unsere Dankesbotschaft</div>
						<div className="small-banner__content">
							<ProgressBar goalDonationSum={props.goalDonationSum} />
							<div className="thankyou-image"/>
						</div>
					</div>
					<div className="close" onClick={this.closeBanner}>
						<span className="close__icon">✕</span>
					</div>
				</div>

				<div className={classNames( 'expand-wrapper', state.infoVisible ? 'expand-wrapper--expanded' : 'expand-wrapper--collapsed' )}>
					<ExpandButton expanded={state.infoVisible} expandText={props.expandText} toggleExpansion={ e => this.expandBanner( e ) }/>
				</div>
				<div className={classNames( 'more-info', state.infoVisible ? 'more-info--expanded' : 'more-info--collapsed', 'more-info--' + props.bannerVariant )}>
					<MoreInfo {...props} donationSkinId={ state.donationSkinId } />
				</div>
				<div className={classNames( 'secondary-expand-wrapper', state.infoVisible ? 'secondary-expand-wrapper--expanded' : 'secondary-expand-wrapper--collapsed' )}>
					<ExpandButton expanded={state.infoVisible} expandText={props.expandText} toggleExpansion={ e => this.expandBanner( e ) }/>
				</div>
			</div>
		</div>;
	}

}
