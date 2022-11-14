import { h } from 'preact';
import { useContext } from 'preact/hooks';
import ChevronLeftIcon from '../Icons/ChevronLeftIcon';
import TranslationContext from '../../shared/components/TranslationContext';
import classNames from 'classnames';

export default function BegYearlyRecurringDonationFormStep3CustomAmount( props ) {
	const Translations = useContext( TranslationContext );

	const onInput = ( e ) => {
		props.setAmount( e.target.value );
	};

	const onBlur = () => {
		props.setAmount( props.formatter( props.numericAmount ) );
	};

	return <div className="wmde-banner-form-step-3">

		<div className="wmde-banner-form-step-3-title">
			<a tabIndex="-1" href="banners/wikipedia.de/desktop/components/MultiStepDonationForm#" className="back"
				onClick={ props.onFormBack }>
				<ChevronLeftIcon/>
			</a>
		</div>

		<div className={ classNames( 'wmde-banner-form-step-3-content', { 'wmde-banner-select-group-container--with-error': !props.isValid } ) }>
			<p className="wmde-banner-form-step-3-header">
				{ Translations[ 'form-step-3-header' ] }
			</p>
			<p className="wmde-banner-form-step-3-notice">
				{ Translations[ 'form-step-3-copy' ] }
			</p>
			<div className="wmde-banner-select-custom-amount-input-container wmde-banner-form-step-3-input-container">
				<span className="wmde-banner-select-custom-amount-euro-symbol">&euro;</span>
				<input type="text"
					tabIndex="-1"
					value={ props.amount || '' }
					onInput={ onInput }
					onBlur={ onBlur }
					size="3"
					maxLength="8"
					autoComplete="off"
					className="wmde-banner-select-custom-amount-input"/>
			</div>
			<span className="wmde-banner-select-group-error-message">
				<span className="wmde-banner-error-icon">
					{ Translations[ 'form-step-3-error' ] }
				</span>
			</span>
		</div>

		<div className="wmde-banner-form-button-container form-step-3-button">
			<button tabIndex="-1" className="wmde-banner-form-button" type="submit">
				{ props.numericAmount > 0 ?
					Translations[ 'form-step-3-button' ].replace( '{{amount}}', props.amount ) :
					Translations[ 'form-step-3-button-blank' ] }
			</button>
		</div>
	</div>;
}
