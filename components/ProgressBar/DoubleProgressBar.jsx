import { h } from 'preact';
import PropTypes from 'prop-types';
import { useEffect, useState, useContext } from 'preact/hooks';
import TranslationContext from '../../shared/components/TranslationContext';
import classNames from 'classnames';

export default function ProgressBar( props ) {
	const Translations = useContext( TranslationContext );
	const [ amountWidth, setAmountWidth ] = useState( 0 );
	const [ timeWidth, setTimeWidth ] = useState( 0 );
	const [ finished, setFinished ] = useState( false );

	useEffect( () => {
		if ( props.animate ) {
			setAmountWidth( Math.min( ( props.donationAmount * 100 ) / props.goalDonationSum, 100 ) );

			// TODO: Remove the + 10 from here as it's for sampling only

			setTimeWidth( 100 - Math.min( ( props.daysLeft * 100 ) / 60, 100 ) + 10 );
		}
	}, [ props.animate ] );

	const getMillion = n => props.formatters.millionFormatter( n / 1000000 );
	const getDaysLeft = daysLeft => {
		return Translations[ 'prefix-days-left' ] +
			' ' + daysLeft + ' ' +
			( daysLeft === 1 ? Translations[ 'day-singular' ] : Translations[ 'day-plural' ] ) + ' ' +
			Translations[ 'suffix-days-left' ];
	};

	const progressAnimationEnded = () => {
		setFinished( true );

		if ( props.onEndProgress ) {
			props.onEndProgress();
		}
	};

	return <div className={ classNames( 'wmde-banner-double-progress', {
		'wmde-banner-double-progress--animating': props.startProgressBar,
		'wmde-banner-double-progress--finished': finished
	} ) }>
		<div className="wmde-banner-double-progress-amount">
			<div className="wmde-banner-double-progress-amount-fill" style={ 'width:' + amountWidth + '%' }>
				<div>
					{ Translations[ 'amount-missing' ] + ' ' + getMillion( props.missingAmount ) }
				</div>
				<div>
					{ getMillion( props.donationAmount ) }
				</div>
			</div>
			<div className="wmde-banner-double-progress-amount-difference" style={ 'width:' + timeWidth + '%' }>!</div>
		</div>
		<div className="wmde-banner-double-progress-time">
			<div
				className="wmde-banner-double-progress-time-fill"
				style={ 'width:' + timeWidth + '%' }
				onTransitionEnd={ progressAnimationEnded }
			>
				<div>
					{ Translations[ 'double-progress-close' ] }
				</div>
				<div>
					{ getDaysLeft( props.daysLeft ) }
				</div>
			</div>
		</div>
	</div>;
}

ProgressBar.propTypes = {
	/** How many days are left in the campaign */
	daysLeft: PropTypes.number.isRequired,
	/** How many donations have been collected up to this point in time */
	donationAmount: PropTypes.number.isRequired,
	/** overall donation goal */
	goalDonationSum: PropTypes.number.isRequired,
	/** Remaining donation goal (could be calculated from sum-amount) */
	missingAmount: PropTypes.number.isRequired,
	formatters: PropTypes.object.isRequired,
	animate: PropTypes.bool.isRequired
};
