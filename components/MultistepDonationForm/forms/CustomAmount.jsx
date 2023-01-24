import { h } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import ChevronLeftIcon from '../../Icons/ChevronLeftIcon';
import TranslationContext from '../../../shared/components/TranslationContext';
import classNames from 'classnames';
import { propTypes } from './propTypes';
import { validateRequired } from '../../DonationForm/utils';
import { isValid, isValidOrUnset, UNSET } from '../../DonationForm/hooks/validation_states';

export default function CustomAmount( props ) {
	const Translations = useContext( TranslationContext );
	const [ , , intervalValidity, setIntervalValidity ] = props.formModel.interval;
	const [ , , paymentMethodValidity, setPaymentMethodValidity ] = props.formModel.paymentMethod;
	const [ { numericAmount, amountValidity }, { setAmountValidity } ] = props.formModel.amount;
	const [ customAmount, numericCustomAmount, setCustomAmount, customAmountValidity, setCustomAmountValidity ] = props.formModel.customAmount;

	const onEntered = () => {
		props.trackBannerEvent( 'custom-amount-form-page-shown' );
	};

	const onExited = () => {
		setCustomAmount( '' );
		setCustomAmountValidity( UNSET );
	};

	useEffect( () => {
		if ( props.active ) {
			onEntered();
		} else {
			onExited();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ props.active ] );

	const paymentDataIsValid = () => [
		[ intervalValidity, setIntervalValidity ],
		[ amountValidity, setAmountValidity ],
		[ paymentMethodValidity, setPaymentMethodValidity ],
		[ customAmountValidity, setCustomAmountValidity ]
	].map( validateRequired ).every( isValid );

	const onSubmit = e => {
		e.preventDefault();
		if ( paymentDataIsValid() ) {
			const amountFloat = parseFloat( numericAmount );
			const customAmountFloat = parseFloat( numericCustomAmount );
			if ( amountFloat > customAmountFloat ) {
				props.trackBannerEvent( 'decreased-amount' );
			} else if ( amountFloat < customAmountFloat ) {
				props.trackBannerEvent( 'increased-amount' );
			}

			props.onSubmit( props.step );
		}
	};

	const onInput = ( e ) => {
		setCustomAmount( e.target.value );
	};

	const onBlur = () => {
		setCustomAmount( props.formatters.customAmountInputFormatter( numericCustomAmount ) );
	};

	const onBack = ( e ) => {
		e.preventDefault();
		props.onBack( props.step );
	};

	return <form onSubmit={ onSubmit } className="wmde-banner-sub-form">

		<div className="wmde-banner-form-custom-title">
			<a tabIndex="-1" href="#" className="back" onClick={ onBack }>
				<ChevronLeftIcon/>
			</a>
		</div>

		<div className={ classNames(
			'wmde-banner-form-custom-content',
			{ 'wmde-banner-select-group-container--with-error': !isValidOrUnset( customAmountValidity ) }
		) }>
			<p className="wmde-banner-form-custom-header">
				{ Translations[ 'form-step-3-header' ] }
			</p>
			<p className="wmde-banner-form-custom-notice">
				{ Translations[ 'form-step-3-copy' ] }
			</p>
			<div className="wmde-banner-select-custom-amount-input-container wmde-banner-form-custom-input-container">
				<span className="wmde-banner-select-custom-amount-euro-symbol">&euro;</span>
				<input type="text"
					tabIndex="-1"
					value={ customAmount || '' }
					onInput={ onInput }
					onBlur={ onBlur }
					size="3"
					maxLength="8"
					autoComplete="off"
					className="wmde-banner-select-custom-amount-input t-custom-amount-annual-upgrade"/>
			</div>
			<span className="wmde-banner-select-group-error-message">
				<span className="wmde-banner-error-icon">
					{ Translations[ 'form-step-3-error' ] }
				</span>
			</span>
		</div>

		<div className="wmde-banner-form-button-container wmde-banner-form-custom-button">
			<button tabIndex="-1" className="wmde-banner-form-button t-submit-custom-amount" type="submit">
				{ numericThirdPageAmount > 0 ?
					Translations[ 'form-step-3-button' ].replace( '{{amount}}', thirdPageAmount ) :
					Translations[ 'form-step-3-button-blank' ] }
			</button>
		</div>
	</form>;
}

CustomAmount.propTypes = propTypes;
