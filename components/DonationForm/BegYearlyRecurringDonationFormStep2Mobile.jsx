import { h } from 'preact';
import { useContext } from 'preact/hooks';
import CloseIcon from '../Icons/CloseIconMobile';
import { Alternatives } from './hooks/use_alternative';
import TranslationContext from '../../shared/components/TranslationContext';

export default function BegYearlyRecurringDonationFormStep2( props ) {
	const Translations = useContext( TranslationContext );

	const onClickAlternativeButton = e => {
		e.preventDefault();
		props.onChangeAlternative( e );
		// setTimeout is used to wait one tick before submitting
		// the form to ensure the value in submitValues gets set
		setTimeout( () => e.target.form.submit() );
	};

	return <div className="wmde-banner-form-step-2">
		<div className="wmde-banner-form-step-2-content">
			<a href="#" className="wmde-banner-form-step-2-back" onClick={ props.onFormBack }>
				<CloseIcon/>
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
