import { h } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import { Alternatives } from './hooks/use_alternative';
import TranslationContext from '../../shared/components/TranslationContext';
import ChevronLeftIcon from '../Icons/ChevronLeftIcon';

export default function BegYearlyRecurringDonationFormStep2( props ) {
	const Translations = useContext( TranslationContext );

	// 1. The button clicks update the value of alternative.
	// 2. We watch the value of alternative for changes
	// 3. If the value is not null we know the user clicked a button so we submit the form
	useEffect( () => {
		if ( props.upgradeToYearly !== null ) {
			props.onSubmit();
			props.formRef.current.submit();
		}
	}, [ props.upgradeToYearly ] );

	const onClickAlternativeButton = e => {
		e.preventDefault();
		props.onChooseUpgradeToYearly( e );
	};

	return <div className="wmde-banner-form-step-2">
		<div className="wmde-banner-form-step-2-content">
			<a href="#" className="wmde-banner-form-step-2-back" onClick={ props.onFormBack }>
				<ChevronLeftIcon/> { Translations[ 'back-button' ] }
			</a>
			<div className="wmde-banner-form-step-2-title">
				{ Translations[ 'form-step-2-header' ].replace( '{{amount}}', props.secondPageAmount ) }
			</div>
			<div className="wmde-banner-form-step-2-notice">{ Translations[ 'form-step-2-copy' ] }</div>

			<div className="wmde-banner-form-step-2-buttons">
				<button className="wmde-banner-form-button" onClick={ onClickAlternativeButton } value={ Alternatives.NO }>
					{ Translations[ 'form-step-2-no' ].replace( '{{amount}}', props.secondPageAmount ) }
				</button>

				<button className="wmde-banner-form-button" onClick={ onClickAlternativeButton } value={ Alternatives.YES }>
					{ Translations[ 'form-step-2-yes' ].replace( '{{amount}}', props.secondPageAmount ) }
				</button>

				<a href="#" className="wmde-banner-form-step-2-custom" onClick={ props.onFormBackToYearly }>
					{ Translations[ 'form-step-2-link' ] }
				</a>
			</div>
		</div>
	</div>;
}
