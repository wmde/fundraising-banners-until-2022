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

/**
 * When set to true, the "late progress" design will be used
 *
 * @type {boolean}
 */
const IS_LATE_PROGRESS = false;

export default class ProgressBar extends Component {
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

		/**
		 * If the progress bar should be animated. Default: true
		 * If it's not animated you can set setStartAnimation to an empty function like this: () => {}
		 */
		animate: PropTypes.bool,

		/**
		 * Show the total amount required or amount remaining on the right side
		 */
		amountToShowOnRight: PropTypes.string
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
		let width = ( this.props.donationAmount * 100 ) / this.props.goalDonationSum;
		if ( width < 0 ) {
			width = 0;
		}
		if ( width > 100 ) {
			width = 100;
		}
		return width;
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
				return <div>
					<span className="wmde-banner-legacy-progress-bar-right-text">{ Translations[ 'amount-missing' ] }</span>
					{ ' ' } { getMillion( props.missingAmount ) }
				</div>;
			}
			return <div>
				<span className="wmde-banner-legacy-progress-bar-right-text">{ Translations[ 'amount-total' ] }</span>
				{ ' ' } { getMillion( props.goalDonationSum ) }
			</div>;
		};
		return <div className={ classNames(
			'wmde-banner-legacy-progress-bar',
			{
				'wmde-banner-legacy-progress-bar--finished': state.animation === ENDED,
				'wmde-banner-legacy-progress-bar--animating': state.animation === STARTED,
				'wmde-banner-legacy-progress-bar--lateprogress': IS_LATE_PROGRESS
			}
		) }>
			<div className="wmde-banner-legacy-progress-bar-wrapper">
				<div className="wmde-banner-legacy-progress-bar-donation-fill" style={ 'width:' + state.width + '%' } onTransitionEnd={ this.progressAnimationEnded }>
					<div className="wmde-banner-legacy-progress-bar-days-left">
						{ getDaysLeft( props.daysLeft ) }
					</div>
					<div className="wmde-banner-legacy-progress-bar-donation-text">{ getMillion( props.donationAmount ) }</div>
				</div>
				<div className="wmde-banner-legacy-progress-bar-donation-remaining wmde-banner-legacy-progress-bar-donation-remaining-inner">
					{ rightText() }
				</div>
			</div>
			<div className="wmde-banner-legacy-progress-bar-donation-remaining wmde-banner-legacy-progress-bar-donation-remaining-outer">
				{ rightText() }
			</div>
		</div>;
	}
}

ProgressBar.contextType = TranslationContext;
