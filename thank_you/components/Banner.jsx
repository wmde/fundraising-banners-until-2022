import { Component, h, createRef } from 'preact';
import { onMediaWiki } from '../../shared/mediawiki_checks';
import classNames from 'classnames';

import ExpandButton from './ExpandButton';
import ProgressBar from './ProgressBar';
import TranslationContext from '../../shared/components/TranslationContext';
import InfoIcon from './InfoIcon';

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
			topPosition: 0
		};
		this.infoVisibleChanged = false;
		this.numExpansions = 0;
	}

	componentDidMount() {
		this.props.registerDisplayBanner(
			() => {
				this.setState(
					{ displayState: VISIBLE, topPosition: 0 },
					() => this.adjustSurroundingSpace()
				);
			}
		);
		this.props.registerResizeBanner( this.onResizePage.bind( this ) );
		this.props.onFinishedTransitioning();
		this.onResizePage();
	}

	onResizePage() {
		this.setTopPosition();
		this.adjustSurroundingSpace();
	}

	setTopPosition() {
		const isMobile = this.props.skinAdjuster.getName() === 'minerva';
		let topState = { topPosition: 0 };

		if (
			// Banner is not visible - pull outside viewport
			( this.state.displayState !== VISIBLE && this.ref.current ) ||
			// Expanded mobile banner positioned absolute (instead of fixed), inside pushed-down content and needs to be pulled up
			( isMobile && this.state.infoVisible && this.ref.current )
		) {
			topState = { topPosition: this.ref.current.offsetHeight * -1 };
		}

		this.setState( topState );
	}

	adjustSurroundingSpace() {
		const isMobile = this.props.skinAdjuster.getName() === 'minerva';
		if ( this.state.displayState !== VISIBLE || !this.ref.current ) {
			return;
		}
		// Expanded mobile banner is no longer fixed and should push content down
		if ( isMobile && this.state.infoVisible ) {
			this.props.skinAdjuster.removeSpace();
		}
		this.props.skinAdjuster.addSpaceInstantly( this.ref.current.offsetHeight );
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

	registerStartProgressbar = ( startPb ) => {
		this.startProgressbar = startPb;
	};

	// eslint-disable-next-line no-unused-vars
	componentWillUpdate( nextProps, nextState, nextContext ) {
		this.infoVisibleChanged = nextState.infoVisible !== this.state.infoVisible;
	}

	componentDidUpdate() {
		if ( this.infoVisibleChanged ) {
			this.adjustSurroundingSpace();
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
		this.setState( { infoVisible }, () => {
			this.setTopPosition();
		} );
	};

	onSubmit = ( formId, e ) => {
		const eventName = formId === 'banner-membership-form-with-amount' ? 'submit-amount' : 'submit';
		this.props.trackingData.tracker.trackBannerEvent( eventName, this.props.impressionCounts.bannerCount, 0, 1 );
		this.props.onSubmit( e );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		const Translations = props.translations;
		const MembershipMoreInfo = props.moreInfo;

		return <div
			className={classNames(
				state.infoVisible ? 'wmde-banner--expanded' : 'wmde-banner--collapsed',
				{ 'wmde-banner': true,
					'wmde-banner--hidden': state.displayState === CLOSED,
					'wmde-banner--visible': state.displayState === VISIBLE,
					'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
					'wmde-banner--var': props.bannerType === BannerType.VAR
				},
			)}>
			<div className="banner-position" style={ { top: state.topPosition + 'px' } } ref={this.ref}>
				<TranslationContext.Provider value={props.translations}>
					<div className="banner-wrapper">
						<div className={'small-banner'}>
							<div className="small-banner__inner" onClick={ this.expandBanner }>
								<InfoIcon/>
								<div className="thankyou-message">{Translations[ 'thank-you-main-message' ]}</div>
								<div className="small-banner__content">
									<ProgressBar
										goalDonationSum={ props.formatters.millionFormatter( campaignProjection.goalDonationSum / 1000000 ) }/>
								</div>
							</div>
							<div className="close" onClick={this.closeBanner}>
								<span className="close__icon">✕</span>
							</div>
						</div>

						<div className={classNames( 'expand-wrapper', state.infoVisible ? 'expand-wrapper--expanded' : 'expand-wrapper--collapsed' )}>
							<ExpandButton
								expanded={state.infoVisible}
								expandText={props.expandText}
								toggleExpansion={ e => this.expandBanner( e ) }
							/>
						</div>
						<div className={classNames( 'more-info', state.infoVisible ? 'more-info--expanded' : 'more-info--collapsed', 'more-info--' + props.bannerVariant )}>
							<MembershipMoreInfo {...props} onSubmit={this.onSubmit} />
						</div>
						<div className={classNames( 'secondary-expand-wrapper', state.infoVisible ? 'secondary-expand-wrapper--expanded' : 'secondary-expand-wrapper--collapsed' )}>
							<ExpandButton
								expanded={state.infoVisible}
								toggleExpansion={ e => this.expandBanner( e ) }
							/>
						</div>
					</div>
				</TranslationContext.Provider>
			</div>
		</div>;
	}

}
