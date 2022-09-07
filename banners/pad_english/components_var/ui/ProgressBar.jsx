import { h } from 'preact';
import { Component } from 'preact/compat';
import classNames from 'classnames';
import TranslationContext from '../../../../shared/components/TranslationContext';
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
			if ( props.daysLeft > 14 ) {
				return '';
			}
			return Translations[ 'prefix-days-left' ] +
				' ' + daysLeft + ' ' +
				( daysLeft === 1 ? Translations[ 'day-singular' ] : Translations[ 'day-plural' ] ) + ' ' +
				Translations[ 'suffix-days-left' ];
		};
		return <div className={ classNames( 'progress_bar', {
			'progress_bar--finished': state.animation === ENDED,
			'progress_bar--animating': state.animation === STARTED
		} ) }>
			<div className="progress_bar__wrapper">
				<div className="progress_bar__donation_fill" style={ 'width:' + state.width + '%' } onTransitionEnd={ this.progressAnimationEnded }>
					<span className="progress_bar__days_left">{ getDaysLeft( props.daysLeft ) }</span>
					<span className="progress_bar__donation_text">{ getMillion( props.donationAmount ) }</span>
				</div>
				<div className="progress_bar__donation_remaining">
					{ getMillion( props.goalDonationSum ) }
				</div>
			</div>
		</div>;
	}
}
