import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import useAlternative, { Alternatives } from '../../DonationForm/hooks/use_alternative';
import TranslationContext from '../../../shared/components/TranslationContext';
import ChevronLeftIcon from '../../Icons/ChevronLeftIcon';
import { propTypes } from './propTypes';
import { Intervals } from '../../../shared/components/ui/form/FormItemsBuilder';
import { validateRequired } from '../../DonationForm/utils';
import { isValid } from '../../DonationForm/hooks/validation_states';

export default function UpgradeToYearlyButtons( props ) {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ props.active ] );

	// check with side effects
	const paymentDataIsValid = () => [
		[ intervalValidity, setIntervalValidity ],
		[ amountValidity, setAmountValidity ],
		[ paymentMethodValidity, setPaymentMethodValidity ],
		[ upgradeToYearlyValidity, setUpgradeToYearlyValidity ]
	].map( validateRequired ).every( isValid );

	// 1. The button clicks update the value of alternative.
	// 2. We watch the value of alternative for changes
	// 3. If the value is not null we know the user clicked a button so we submit the form
	useEffect( () => {
		if ( upgradeToYearly !== null ) {
			if ( paymentDataIsValid() ) {
				if ( upgradeToYearly === Alternatives.YES ) {
					props.trackBannerEvent( 'upgraded-to-yearly' );
				} else {
					props.trackBannerEvent( 'not-upgraded-to-yearly' );
				}
				props.onSubmit( props.step, { upgradeToYearly } );
			}
		}
	}, [ upgradeToYearly ] );

	const onChooseUpgradeToYearly = e => {
		e.preventDefault();
		if ( e.target.value === Alternatives.YES ) {
			setInterval( Intervals.YEARLY.value );
		}

		setUpgradeToYearly( e.target.value );
	};

	const onBack = e => {
		e.preventDefault();
		props.onBack( props.step );
	};

	const onNext = e => {
		e.preventDefault();
		props.trackBannerEvent( 'changed-to-yearly' );
		props.onNext( props.step );
	};

	return <form className="wmde-banner-sub-form wmde-banner-form-upgrade">

		<a tabIndex="-1" href="#" className="wmde-banner-form-upgrade-back" onClick={ onBack }>
			<ChevronLeftIcon/> { Translations[ 'back-button' ] }
		</a>

		<div className="wmde-banner-form-upgrade-title">
			{ Translations[ 'form-step-2-header' ].replace( '{{amount}}', secondPageAmount ) }
		</div>

		<div className="wmde-banner-form-upgrade-notice">
			{ Translations[ 'form-step-2-copy' ] }
		</div>

		<div className="wmde-banner-form-upgrade-buttons">
			<button tabIndex="-1" className="wmde-banner-form-button t-annual-upgrade-no" onClick={ onChooseUpgradeToYearly } value={ Alternatives.NO }>
				{ Translations[ 'form-step-2-no' ].replace( '{{amount}}', secondPageAmount ) }
			</button>

			<button tabIndex="-1" className="wmde-banner-form-button t-annual-upgrade-yes" onClick={ onChooseUpgradeToYearly } value={ Alternatives.YES }>
				{ Translations[ 'form-step-2-yes' ].replace( '{{amount}}', secondPageAmount ) }
			</button>

			<a tabIndex="-1" href="#" className="wmde-banner-form-upgrade-custom t-annual-upgrade-yes-custom" onClick={ onNext }>
				{ Translations[ 'form-step-2-link' ] }
			</a>
		</div>

	</form>;
}

UpgradeToYearlyButtons.propTypes = propTypes;
