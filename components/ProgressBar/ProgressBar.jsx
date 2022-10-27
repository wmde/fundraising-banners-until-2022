import { h } from 'preact';
import { Component } from 'preact/compat';
import classNames from 'classnames';
import TranslationContext from '../../shared/components/TranslationContext';
import PropTypes from 'prop-types';

const PENDING = 0;
const STARTED = 1;
const ENDED = 2;

export const AmountToShowOnRight = Object.freeze( {
	TOTAL: Symbol( 'total' ),
	MISSING: Symbol( 'missing' )
} );

export default class ProgressBar extends Component {
	static contextType = TranslationContext;

	static defaultProps = {
		isLateProgress: false
	};

	static propTypes = {
		/** Locale 'EN' or 'DE', defaults to 'EN' */
		locale: PropTypes.string,

		/** How many days are left in the campaign */
		daysLeft: PropTypes.number.isRequired,

		/** How many donations have been collected up to this point in time */
		donationAmount: PropTypes.number.isRequired,

		/** overall donation goal */
		goalDonationSum: PropTypes.number.isRequired,

		/** Remaining donation goal (could be calculated from sum-amount) */
		missingAmount: PropTypes.number.isRequired,

		/**
		 * Function that receives the animation start function as a callback,
		 * to expose the startAnimation method from this component to parent components.
		 * See https://stackoverflow.com/a/45582558/130121
		 */
		setStartAnimation: PropTypes.func.isRequired,

		/** Callback when progress has finished animating */
		onEndProgress: PropTypes.func,

		/**
		 * If the progress bar should be animated. Default: true
		 * If it's not animated you can set setStartAnimation to an empty function like this: () => {}
		 */
		animate: PropTypes.bool,

		/**
		 * Show the total amount required or amount remaining on the right side
		 */
		amountToShowOnRight: PropTypes.string,

		/**
		 * Set the progress bar to late progress layout
		 */
		isLateProgress: PropTypes.bool
	};

	constructor( props ) {
		super( props );
		this.state = {
			width: 1,
			animation: PENDING
		};
		if ( props.animate === false ) {
			this.state = {
				width: this.calculateWidth(),
				animation: ENDED
			};
		}

		PropTypes.checkPropTypes( ProgressBar.propTypes, props, 'constructor', 'ProgressBar' );
	}

	componentDidMount() {
		this.props.setStartAnimation( this.startAnimation.bind( this ) );
	}

	// eslint-disable-next-line no-unused-vars
	progressAnimationEnded = ( e ) => {
		this.setState( { animation: ENDED } );
		if ( this.props.onEndProgress ) {
			this.props.onEndProgress();
		}
	};

	startAnimation() {
		if ( this.state.animation !== PENDING ) {
			return;
		}
		this.setState( {
			width: this.calculateWidth(),
			animation: STARTED
		} );
	}

	calculateWidth() {
		const max = Math.max( ( this.props.donationAmount * 100 ) / this.props.goalDonationSum, 20 );
		return Math.min( max, 100 );
	}

	render( props, state, context ) {
		const Translations = context;
		const getMillion = n => this.props.formatters.millionFormatter( n / 1000000 );
		const getDaysLeft = daysLeft => {
			return Translations[ 'prefix-days-left' ] +
				' ' + daysLeft + ' ' +
				( daysLeft === 1 ? Translations[ 'day-singular' ] : Translations[ 'day-plural' ] ) + ' ' +
				Translations[ 'suffix-days-left' ];
		};
		const rightText = () => {
			if ( props.amountToShowOnRight === AmountToShowOnRight.MISSING ) {
				return Translations[ 'amount-missing' ] + ' ' + getMillion( props.missingAmount );
			}
			return Translations[ 'amount-total' ] + ' ' + getMillion( props.goalDonationSum );
		};
		const leftText = () => {
			if ( props.isLateProgress ) {
				return getDaysLeft( props.daysLeft );
			}
			return getMillion( props.donationAmount );
		};
		const innerText = () => {
			return getMillion( props.donationAmount );
		};

		return <div className={ classNames( 'wmde-banner-progress-bar', {
			'wmde-banner-progress-bar--animating': state.animation === STARTED,
			'wmde-banner-progress-bar--finished': state.animation === ENDED,
			'wmde-banner-progress-bar--late-progress': props.isLateProgress
		} ) }>
			<div className="wmde-banner-progress-bar-text">
				<div className="wmde-banner-progress-bar-text-left">
					{ leftText() }
				</div>
				<div className="wmde-banner-progress-bar-text-right">
					{ rightText() }
				</div>
			</div>
			<div className="wmde-banner-progress-bar-fill-wrapper">
				<div className="wmde-banner-progress-bar-fill" style={ 'width:' + state.width + '%' } onTransitionEnd={ this.progressAnimationEnded }>
					<span className="wmde-banner-progress-bar-fill-text">
						{ innerText() }
					</span>
				</div>
			</div>
		</div>;
	}
}
