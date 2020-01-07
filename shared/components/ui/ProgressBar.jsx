// eslint-disable-next-line no-unused-vars
import { Component } from 'preact/compat';
import { h } from 'preact';
import classNames from 'classnames';
import { useContext } from 'preact/hooks';
import formatNumber from 'format-number';
import TranslationContext from '../TranslationContext';
import PropTypes from 'prop-types';

const PENDING = 0;
const STARTED = 1;
const ENDED = 2;

/**
 * When set to true, the "late progress" design will be used
 * @type {boolean}
 */
const IS_LATE_PROGRESS = true;

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
		animate: PropTypes.bool
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
		this.millionFormatter = formatNumber( { round: 1, prefix: '€ ', suffix: 'M', padRight: 1 } );
		if ( this.props.locale === 'de' ) {
			this.millionFormatter = formatNumber( { round: 1, decimal: ',', suffix: ' Mio. €', padRight: 1 } );
		}
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
		return ( this.props.donationAmount * 100 ) / this.props.goalDonationSum;
	}

	render( props, state ) {
		const Translations = useContext( TranslationContext );
		const getMillion = n => this.millionFormatter( n / 1000000 );
		const getDaysLeft = daysLeft => {
			return Translations[ 'prefix-days-left' ] +
				' ' + daysLeft + ' ' +
				( daysLeft > 1 ? Translations[ 'day-plural' ] : Translations[ 'day-singular' ] ) + ' ' +
				Translations[ 'suffix-days-left' ];
		};
		return <div className={ classNames( 'progress_bar', {
			'progress_bar--finished': state.animation === ENDED,
			'progress_bar--animating': state.animation === STARTED,
			'progress_bar--lateprogress': IS_LATE_PROGRESS
		} ) }>
			<div className="progress_bar__wrapper">
				<div className="progress_bar__donation_fill" style={ 'width:' + state.width + '%' } onTransitionEnd={ this.progressAnimationEnded }>
					<div className="progress_bar__days_left">
						{ getDaysLeft( props.daysLeft ) }
					</div>
					<div className="progress_bar__donation_text">{ getMillion( props.donationAmount ) }</div>
				</div>
				<div
					className="progress_bar__donation_remaining progress_bar__donation_remaining--inner">
					{ Translations[ 'amount-missing' ] }{ ' ' }
					{ getMillion( props.missingAmount ) }
				</div>
			</div>
			<div className="progress_bar__donation_remaining progress_bar__donation_remaining--outer">
				<div className="progress_bar__pointer_tip"></div>
				<hr className="progress_bar__pointer_line" />
				{ Translations[ 'amount-missing' ] }{ ' ' }
				{ getMillion( props.missingAmount ) }
			</div>
		</div>;
	}
}
