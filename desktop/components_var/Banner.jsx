// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../../shared/components/BannerTransition';
import FundsDistributionInfo from '../../shared/components/ui/use_of_funds/FundsDistributionInfo';
import FundsModal from '../../shared/components/ui/use_of_funds/FundsModal';
import TranslationContext from '../../shared/components/TranslationContext';
import Close from './ui/Close';
import Infobox from './ui/Infobox';
import ChevronLeft from './ui/ChevronLeft';
import { PAGE_1, PAGE_2, PAGE_3, PAGE_4 } from './Content';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

export const BannerContentState = Object.freeze( {
	HOME: Symbol.for( 'HOME' ),
	PAGE_1: Symbol.for( 'PAGE_1' ),
	PAGE_2: Symbol.for( 'PAGE_2' ),
	PAGE_3: Symbol.for( 'PAGE_3' ),
	PAGE_4: Symbol.for( 'PAGE_4' )
} );

export const BannerType = Object.freeze( {
	CTRL: Symbol( 'ctrl' ),
	VAR: Symbol( 'var' )
} );

export class Banner extends Component {

	static propTypes = {
		/** callback when banner closes */
		onClose: PropTypes.func,
		/** */
		registerDisplayBanner: PropTypes.func.isRequired
	}

	ref = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			displayState: PENDING,
			contentState: BannerContentState.HOME,
			pagesViewed: 0,
			isFundsModalVisible: false
		};
		this.slideInBanner = () => {};
	}

	componentDidMount() {
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
	}

	closeBanner = e => {
		e.preventDefault();
		this.setState( { displayState: CLOSED } );
		this.props.onClose();
	};

	registerBannerTransition = ( cb ) => {
		this.slideInBanner = cb;
	}

	bannerContentStateToInt = contentState => {
		switch ( contentState ) {
			case BannerContentState.PAGE_1:
				return 1;
			case BannerContentState.PAGE_2:
				return 2;
			case BannerContentState.PAGE_3:
				return 3;
			case BannerContentState.PAGE_4:
				return 4;
			default:
				return 0;
		}
	}

	trackBannerEvent = name => {
		this.props.trackingData.tracker.trackBannerEvent(
			name,
			this.state.pagesViewed,
			this.bannerContentStateToInt( this.state.contentState ),
			this.props.trackingData.bannerClickTrackRatio
		);
	}

	toggleFundsModal = () => {
		if ( !this.state.isFundsModalVisible ) {
			this.trackBannerEvent( 'application-of-funds-shown' );
		}
		this.setState( { isFundsModalVisible: !this.state.isFundsModalVisible } );
	};

	fundsModalDonate = () => {
		this.trackBannerEvent( 'funds-modal-donate-clicked' );
		this.setState( { isFundsModalVisible: false } );
	};

	onChangePage = ( bannerContentState ) => {
		this.setState( { contentState: BannerContentState[ bannerContentState ] } );
		if ( bannerContentState !== 'HOME' ) {
			this.setState( { pagesViewed: this.state.pagesViewed + 1 } );
		}
	}

	onDonate = () => {
		this.trackBannerEvent( 'banner-donate-clicked' );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const formActionParams = {
			piwik_campaign: props.campaignName,
			piwik_kwd: props.bannerName
		};

		const queryString = Object.keys( formActionParams )
			.map( key => `${key}=${formActionParams[ key ]}` )
			.join( '&' );

		const formAction = 'https://spenden.wikimedia.de/donation/new?' + queryString;

		return <div
			className={ classNames(
				'wmde-banner',
				{
					'wmde-banner--hidden': state.displayState === CLOSED,
					'wmde-banner--visible': state.displayState === VISIBLE,
					'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
					'wmde-banner--var': props.bannerType === BannerType.VAR
				}
			) }
			ref={this.ref}>
			<BannerTransition
				fixed={ true }
				registerDisplayBanner={ this.registerBannerTransition }
				onFinish={ this.onFinishedTransitioning }
				skinAdjuster={ props.skinAdjuster }
				transitionSpeed={ 1000 }
			>
				<TranslationContext.Provider value={props.translations}>
					<div className="banner__wrapper">
						{ state.contentState !== BannerContentState.HOME && <div className="back">
							<a className="back__link" onClick={ () => this.onChangePage( Symbol.keyFor( BannerContentState.HOME ) ) }>
								<ChevronLeft/>
							</a>
						</div> }
						<div className="close">
							<a className="close__link" onClick={ this.closeBanner }>
								<Close/>
							</a>
						</div>
						<div className="content-home">
							<div className="content-container">
								<p className="content-home-headline">Was schätzen Sie, wie häufig nutzen Sie Wikipedia?</p>

								<div className="content-home-choices">
									<div className="content-home-choice">
										<figure className="content-home-choice-image">
											<svg width="83" height="72" viewBox="0 0 83 72" fill="none" xmlns="http://www.w3.org/2000/svg">
												<circle cx="45.5" cy="5.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="36.5" cy="22.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="54.5" cy="21.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="5.5" cy="66.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="23.5" cy="66.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="41.5" cy="66.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="59.5" cy="66.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="77.5" cy="66.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="16.5" cy="52.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="34.5" cy="52.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="52.5" cy="52.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="70.5" cy="52.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="27.5" cy="38.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="45.5" cy="38.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="63.5" cy="38.5" r="5.5" fill="#FFD4D4"/>
											</svg>
										</figure>
										<button
											className="content-home-choice-select"
											onClick={ () => this.onChangePage( Symbol.keyFor( BannerContentState.PAGE_1 ) ) }>Sehr oft</button>
									</div>
									<div className="content-home-choice">
										<figure className="content-home-choice-image">
											<svg width="47" height="41" viewBox="0 0 47 41" fill="none" xmlns="http://www.w3.org/2000/svg">
												<circle cx="5.5" cy="35.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="23.5" cy="35.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="23.5" cy="5.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="41.5" cy="35.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="15.5" cy="21.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="33.5" cy="20.5" r="5.5" fill="#FFD4D4"/>
											</svg>
										</figure>
										<button
											className="content-home-choice-select"
											onClick={ () => this.onChangePage( Symbol.keyFor( BannerContentState.PAGE_2 ) ) }>Häufig</button>
									</div>
									<div className="content-home-choice">
										<figure className="content-home-choice-image">
											<svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
												<circle cx="23.5" cy="22.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="5.5" cy="22.5" r="5.5" fill="#FFD4D4"/>
												<circle cx="15.5" cy="5.5" r="5.5" fill="#FFD4D4"/>
											</svg>
										</figure>
										<button
											className="content-home-choice-select"
											onClick={ () => this.onChangePage( Symbol.keyFor( BannerContentState.PAGE_3 ) ) }>Ab und zu</button>
									</div>
									<div className="content-home-choice">
										<figure className="content-home-choice-image">
											<svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
												<circle cx="5.5" cy="5.5" r="5.5" fill="#FFD4D4"/>
											</svg>
										</figure>
										<button
											className="content-home-choice-select"
											onClick={ () => this.onChangePage( Symbol.keyFor( BannerContentState.PAGE_4 ) ) }>Eher selten</button>
									</div>
								</div>
							</div>

						</div>

						<Infobox
							isVisible={ state.contentState === BannerContentState.PAGE_1 }
							image={ PAGE_1.image }
							heading={ PAGE_1.heading }
							content={ PAGE_1.content }
							formAction={ formAction }
							onDonate={ this.onDonate }
							onShowUseOfFundsModal={ this.toggleFundsModal }
						/>
						<Infobox
							isVisible={ state.contentState === BannerContentState.PAGE_2 }
							image={ PAGE_2.image }
							heading={ PAGE_2.heading }
							content={ PAGE_2.content }
							formAction={ formAction }
							onDonate={ this.onDonate }
							onShowUseOfFundsModal={ this.toggleFundsModal }
						/>
						<Infobox
							isVisible={ state.contentState === BannerContentState.PAGE_3 }
							image={ PAGE_3.image }
							heading={ PAGE_3.heading }
							content={ PAGE_3.content }
							formAction={ formAction }
							onDonate={ this.onDonate }
							onShowUseOfFundsModal={ this.toggleFundsModal }
						/>
						<Infobox
							isVisible={ state.contentState === BannerContentState.PAGE_4 }
							image={ PAGE_4.image }
							heading={ PAGE_4.heading }
							content={ PAGE_4.content }
							formAction={ formAction }
							onDonate={ this.onDonate }
							onShowUseOfFundsModal={ this.toggleFundsModal }
						/>

					</div>
				</TranslationContext.Provider>
			</BannerTransition>
			<FundsModal
				toggleFundsModal={ this.toggleFundsModal }
				onCallToAction={ this.fundsModalDonate }
				isFundsModalVisible={ this.state.isFundsModalVisible }
				useOfFundsText={ props.useOfFundsText }
				locale='de'>
				<FundsDistributionInfo
					applicationOfFundsData={ props.useOfFundsText.applicationOfFundsData }
				/>
			</FundsModal>
		</div>;
	}

}
