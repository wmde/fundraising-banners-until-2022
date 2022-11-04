import { Component, h, createRef } from 'preact';
import { onMediaWiki } from '../../../shared/mediawiki_checks';
import classNames from 'classnames';

import ExpandButton from './ExpandButton';
import ProgressBar from './ProgressBar';
import TranslationContext from '../../../shared/components/TranslationContext';
import InfoIcon from '../../../components/Icons/InfoIcon';
import ButtonClose from '../../../components/ButtonClose/ButtonClose';
import CloseIconThankYou from './CloseIconThankYou';
import { BannerType } from '../../../shared/BannerType';

export const BannerVisibilityState = Object.freeze( {
	PENDING: Symbol( 'pending' ),
	VISIBLE: Symbol( 'visible' ),
	CLOSED: Symbol( 'closed' )
} );

export class Banner extends Component {
	ref = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			bannerVisibilityState: BannerVisibilityState.PENDING,
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
					{ bannerVisibilityState: BannerVisibilityState.VISIBLE, topPosition: 0 },
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
			( this.state.bannerVisibilityState !== BannerVisibilityState.VISIBLE && this.ref.current ) ||
			// Expanded mobile banner positioned absolute (instead of fixed), inside pushed-down content and needs to be pulled up
			( isMobile && this.state.infoVisible && this.ref.current )
		) {
			topState = { topPosition: this.ref.current.offsetHeight * -1 };
		}

		this.setState( topState );
	}

	adjustSurroundingSpace() {
		const isMobile = this.props.skinAdjuster.getName() === 'minerva';
		if ( this.state.bannerVisibilityState !== BannerVisibilityState.VISIBLE || !this.ref.current ) {
			return;
		}
		// Expanded mobile banner is no longer fixed and should push content down
		if ( isMobile && this.state.infoVisible ) {
			this.props.skinAdjuster.removeSpaceInstantly();
		}
		this.props.skinAdjuster.addSpaceInstantly( this.ref.current.offsetHeight );
	}

	onFinishedTransitioning = () => {
		this.props.onFinishedTransitioning();
		this.startProgressbar();
	};

	closeBanner = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
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

	onSubmit = ( formId ) => {
		const eventName = formId === 'banner-membership-form-with-amount' ? 'submit-amount' : 'submit';
		this.props.onSubmit( eventName );
	};

	onSubmitSubscriptionForm = () => {
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		if ( onMediaWiki() ) {
			mw.centralNotice.customHideBanner( 'close', 1814400 );
		}
		this.props.onClose( 'subscription-form-submitted' );
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		const Translations = props.translations;
		const MembershipMoreInfo = props.moreInfo;

		return <div
			className={ classNames( 'wmde-banner',
				{
					'wmde-banner--expanded': state.infoVisible,
					'wmde-banner--collapsed': !state.infoVisible,
					'wmde-banner--hidden': state.bannerVisibilityState === BannerVisibilityState.CLOSED,
					'wmde-banner--visible': state.bannerVisibilityState === BannerVisibilityState.VISIBLE,
					'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
					'wmde-banner--var': props.bannerType === BannerType.VAR
				},
			)}>
			<div className="banner-position" style={ { top: state.topPosition + 'px' } } ref={ this.ref }>
				<TranslationContext.Provider value={ props.translations }>
					<div className="wmde-banner-wrapper">
						<div className="wmde-banner-small">
							<ButtonClose className="t-close-main-banner" onClick={ this.closeBanner } icon={ <CloseIconThankYou/> }/>
							<div className="wmde-banner-small-inner" onClick={ this.expandBanner }>
								<button className="wmde-banner-info-button"><InfoIcon/></button>
								<div className="wmde-banner-headline">{Translations[ 'thank-you-main-message' ]}</div>
								<ProgressBar goalDonationSum={ props.formatters.millionFormatter( campaignProjection.goalDonationSum / 1000000 ) }/>
								<div className="wmde-banner-firework wmde-banner-firework-lefter"></div>
								<div className="wmde-banner-firework wmde-banner-firework-left"></div>
								<div className="wmde-banner-firework wmde-banner-firework-center"></div>
								<div className="wmde-banner-firework wmde-banner-firework-right"></div>
								<div className="wmde-banner-firework wmde-banner-firework-righter"></div>
							</div>
						</div>

						<div className="wmde-banner-expand-button">
							<ExpandButton
								expanded={state.infoVisible}
								expandText={props.expandText}
								toggleExpansion={ e => this.expandBanner( e ) }
							/>
						</div>
						<div className="wmde-banner-more-info">
							<MembershipMoreInfo
								{ ...props }
								onSubmit={ this.onSubmit }
								onSubmitSubscriptionForm={ this.onSubmitSubscriptionForm }
							/>
						</div>
						<div className="wmde-banner-secondary-expand-button">
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
