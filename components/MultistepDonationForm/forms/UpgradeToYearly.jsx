import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import useAlternative, { Alternatives } from '../../DonationForm/hooks/use_alternative';
import TranslationContext from '../../../shared/components/TranslationContext';
import ChevronLeftIcon from '../../Icons/ChevronLeftIcon';
import classNames from 'classnames';
import { propTypes } from './propTypes';
import { Intervals } from '../../../shared/components/ui/form/FormItemsBuilder';
import { validateRequired } from '../../DonationForm/utils';
import { isValid, isValidOrUnset } from '../../DonationForm/hooks/validation_states';

export default function UpgradeToYearly( props ) {
	const Translations = useContext( TranslationContext );
	const [ , setInterval, intervalValidity, setIntervalValidity ] = props.formModel.interval;
	const [ , , paymentMethodValidity, setPaymentMethodValidity ] = props.formModel.paymentMethod;
	const [ { amountValidity, customAmount, selectedAmount }, { setAmountValidity } ] = props.formModel.amount;
	const [ upgradeToYearly, setUpgradeToYearly, upgradeToYearlyValidity, setUpgradeToYearlyValidity ] = useAlternative( null );
	const [ secondPageAmount, setSecondPageAmount ] = useState( '0' );

	const onEntered = () => {
		props.trackBannerEvent( 'upgrade-to-yearly-form-page-shown' );
		setSecondPageAmount( customAmount ?? selectedAmount );
		setUpgradeToYearly( null );
	};

	useEffect( () => {
		if ( props.active ) {
			onEntered();
		}
	}, [ props.active ] );

	const onChooseUpgradeToYearly = e => {
		setUpgradeToYearly( e.target.value );

		if ( e.target.value === Alternatives.YES ) {
			setInterval( Intervals.YEARLY.value );
		}
	};

	// check with side effects
	const paymentDataIsValid = () => [
		[ intervalValidity, setIntervalValidity ],
		[ amountValidity, setAmountValidity ],
		[ paymentMethodValidity, setPaymentMethodValidity ],
		[ upgradeToYearlyValidity, setUpgradeToYearlyValidity ]
	].map( validateRequired ).every( isValid );

	const onSubmit = e => {
		e.preventDefault();
		if ( paymentDataIsValid() ) {
			props.onSubmit( props.step, { upgradeToYearly } );
		}
	};

	const onBack = e => {
		e.preventDefault();
		props.onBack( props.step );
	};

	const onNext = e => {
		e.preventDefault();
		props.onNext( props.step );
	};

	return <form onSubmit={ onSubmit } className="wmde-banner-sub-form wmde-banner-form-upgrade">

		<div className="wmde-banner-form-upgrade-title">
			<a tabIndex="-1" href="#" className="back" onClick={ onBack }>
				<ChevronLeftIcon/>
			</a>
			{ Translations[ 'form-step-2-header' ].replace( '{{amount}}', secondPageAmount ) }
		</div>
		<div className="wmde-banner-form-upgrade-notice">{ Translations[ 'form-step-2-copy' ] }</div>

		<div className="wmde-banner-form-upgrade-options">
			<div className={ classNames(
				'wmde-banner-select-group-container',
				{ 'wmde-banner-select-group-container--with-error': !isValidOrUnset( upgradeToYearlyValidity ) }
			) }>
				<div className="wmde-banner-select-group">
					<div className="wmde-banner-select-group-option wmde-banner-select-group-option-no">
						<label>
							<input
								tabIndex="-1"
								type="radio"
								onClick={ onChooseUpgradeToYearly }
								checked={ upgradeToYearly === Alternatives.NO }
								name="alternative"
								value={ Alternatives.NO }
								className="wmde-banner-select-group-input"/>
							<span className="wmde-banner-select-group-label">{ Translations[ 'form-step-2-no' ].replace( '{{amount}}', secondPageAmount ) }</span>
						</label>
					</div>
					<div className="wmde-banner-select-group-option wmde-banner-select-group-option-yes">
						<label>
							<input
								tabIndex="-1"
								type="radio"
								onClick={ onChooseUpgradeToYearly }
								checked={ upgradeToYearly === Alternatives.YES }
								name="alternative"
								value={ Alternatives.YES }
								className="wmde-banner-select-group-input"/>
							<span className="wmde-banner-select-group-label">{ Translations[ 'form-step-2-yes' ].replace( '{{amount}}', secondPageAmount ) }</span>
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

		<a tabIndex="-1" href="#" className="wmde-banner-form-upgrade-custom" onClick={ onNext }>
			{ Translations[ 'form-step-2-link' ] }
		</a>

		<div className="wmde-banner-form-button-container form-step-2-button">
			<button tabIndex="-1" className="wmde-banner-form-button" type="submit">
				{ Translations[ 'form-step-2-button' ] }
			</button>
		</div>

	</form>;
}

UpgradeToYearly.propTypes = propTypes;
