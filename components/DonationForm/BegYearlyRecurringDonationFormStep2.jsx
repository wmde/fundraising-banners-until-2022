import { h } from 'preact';
import { useContext } from 'preact/hooks';
import ChevronLeftIcon from '../Icons/ChevronLeftIcon';
import classNames from 'classnames';
import { Alternatives } from './hooks/use_alternative';
import TranslationContext from '../../shared/components/TranslationContext';

export default function BegYearlyRecurringDonationFormStep2( props ) {
	const Translations = useContext( TranslationContext );

	return <div className="wmde-banner-form-step-2">

		<div className="wmde-banner-form-step-2-title">
			<a href="banners/wikipedia.de/desktop/components/MultiStepDonationForm#" className="back" onClick={ props.onFormBack }>
				<ChevronLeftIcon/>
			</a>
			{ Translations[ 'form-step-2-header' ].replace( '{{amount}}', props.secondPageAmount ) }
		</div>
		<div className="wmde-banner-form-step-2-notice">{ Translations[ 'form-step-2-copy' ] }</div>

		<div className="wmde-banner-form-step-2-options">
			<div className={ classNames(
				'wmde-banner-select-group-container',
				{ 'wmde-banner-select-group-container--with-error': !props.isValid }
			) }>
				<div className="wmde-banner-select-group">
					<div className="wmde-banner-select-group-option wmde-banner-select-group-option-no">
						<label>
							<input
								type="radio"
								onClick={ props.onChooseUpgradeToYearly }
								checked={ props.upgradeToYearly === Alternatives.NO }
								name="alternative"
								value={ Alternatives.NO }
								className="wmde-banner-select-group-input"/>
							<span className="wmde-banner-select-group-label">{ Translations[ 'form-step-2-no' ].replace( '{{amount}}', props.secondPageAmount ) }</span>
						</label>
					</div>
					<div className="wmde-banner-select-group-option wmde-banner-select-group-option-yes">
						<label>
							<input
								type="radio"
								onClick={ props.onChooseUpgradeToYearly }
								checked={ props.upgradeToYearly === Alternatives.YES }
								name="alternative"
								value={ Alternatives.YES }
								className="wmde-banner-select-group-input"/>
							<span className="wmde-banner-select-group-label">{ Translations[ 'form-step-2-yes' ].replace( '{{amount}}', props.secondPageAmount ) }</span>
						</label>
					</div>
				</div>
				<span className="wmde-banner-select-group-error-message">
					<span className="wmde-banner-error-icon">
						{ Translations[ 'form-step-2-error' ] }
					</span>
				</span>
			</div>
		</div>

		<a
			href="banners/wikipedia.de/desktop/components/MultiStepDonationForm#"
			className="wmde-banner-form-step-2-custom"
			onClick={ props.onFormBackToYearly }>
			{ Translations[ 'form-step-2-link' ] }
		</a>

		<div className="wmde-banner-form-button-container form-step-2-button">
			<button className="wmde-banner-form-button" type="submit">
				{ Translations[ 'form-step-2-button' ] }
			</button>
		</div>

	</div>;
}
