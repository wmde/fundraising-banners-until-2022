// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import { onMediaWiki } from '../../shared/mediawiki_checks';
import classNames from 'classnames';

import ExpandButton from './ExpandButton';
import ProgressBar from '../components/ProgressBar';
import BannerTransition from '../../shared/components/BannerTransition';
import TranslationContext from '../../shared/components/TranslationContext';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

export const BannerType = Object.freeze( {
	CTRL: Symbol( 'ctrl ' ),
	VAR: Symbol( 'var' )
} );

export class Banner extends Component {
	ref = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			displayState: PENDING,
			infoVisible: false,
			donationSkinId: '1'
		};
		this.infoVisibleChanged = false;
		this.numExpansions = 0;
	}

	componentDidMount() {
		window.addEventListener( 'resize', this.updateSkinId );
		this.props.registerDisplayBanner(
			() => {
				this.setState( { displayState: VISIBLE } );
				this.slideInBanner();
			}
		);
		this.props.registerResizeBanner( this.adjustSurroundingSpace.bind( this ) );
	}

	adjustSurroundingSpace() {
		const bannerElement = document.querySelector( '.wmde-banner .banner-position' );
		this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight );
	}

	onFinishedTransitioning = () => {
		this.props.onFinishedTransitioning();
		this.startProgressbar();
	}

	closeBanner = e => {
		e.preventDefault();
		this.setState( { displayState: CLOSED } );
		if ( onMediaWiki() ) {
			mw.centralNotice.customHideBanner( 'close', 1814400 );
		}
		this.props.onClose();
	};

	registerBannerTransition = ( cb ) => {
		this.slideInBanner = cb;
	}

	registerStartProgressbar = ( startPb ) => {
		this.startProgressbar = startPb;
	};

	updateSkinId = () => {
		const donationSkinId = window.innerWidth > 900 ? '1' : '0';
		this.setState( ( { donationSkinId } ) );
	};

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
		if ( this.numExpansions === 0 ) {
			this.props.trackingData.tracker.trackBannerEvent( 'mini-banner-expanded', 0, 0, this.props.trackingData.bannerClickTrackRatio );
		}
		this.numExpansions++;
		e.preventDefault();
		this.setState( { infoVisible } );
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const MoreInfo = props.moreInfo;
		const campaignProjection = props.campaignProjection;

		return <div
			className={classNames(
				state.infoVisible ? 'wmde-banner--expanded' : 'wmde-banner--collapsed',
				{ 'wmde-banner': true,
					'wmde-banner--hidden': state.displayState === CLOSED,
					'wmde-banner--visible': state.displayState === VISIBLE,
					'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
					'wmde-banner--var': props.bannerType === BannerType.VAR
				},
			)}
			ref={this.ref}>
			<BannerTransition
				fixed={ true }
				registerDisplayBanner={ this.registerBannerTransition }
				onFinish={ this.onFinishedTransitioning }
				skinAdjuster={ props.skinAdjuster }
				transitionSpeed={ 0 }
			>
				<TranslationContext.Provider value={props.translations}>
					<div className="banner-wrapper">
						<div className={'small-banner'}>
							<div className="small-banner__inner" onClick={ this.expandBanner }>
								<img className="info-icon"
									height="16" width="16"
									src="https://upload.wikimedia.org/wikipedia/commons/9/93/Info-icon-black-on-yellow.svg"
									alt="info_icon" />
								<div className="thankyou-message">Lesen Sie unsere Dankesbotschaft</div>
								<div className="small-banner__content">
									<ProgressBar
										goalDonationSum={ props.formatters.millionFormatter( campaignProjection.goalDonationSum / 1000000 ) }/>
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
				</TranslationContext.Provider>
			</BannerTransition>
		</div>;
	}

}
