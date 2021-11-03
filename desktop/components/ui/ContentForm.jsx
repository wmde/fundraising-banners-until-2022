import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import Infobox from '../../../shared/components/ui/Infobox';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../../shared/components/TranslationContext';

export default forwardRef( function ContentForm( props, ref ) {
	const Translations = useContext( TranslationContext );
	const DonationForm = props.donationForm;

	return <div className="content__form" ref={ref}>
		<div className="banner__infobox">
			<Infobox
				formatters={ props.formatters }
				campaignParameters={ props.campaignParameters }
				campaignProjection={ props.campaignProjection }
				bannerText={ props.bannerText }
				propsForText={ props.propsForText }/>
		</div>
		<div className="banner__form">
			<DonationForm
				formItems={ props.formItems }
				bannerName={ props.bannerName }
				campaignName={ props.campaignName }
				formatters={ props.formatters }
				impressionCounts={ props.impressionCounts }
				onFormInteraction={ props.onFormInteraction }
				onSubmit={ props.onSubmit }
				customAmountPlaceholder={ Translations[ 'custom-amount-placeholder' ] }
				buttonText={ props.buttonText }
				errorPosition={ props.errorPosition }
			/>
		</div>
	</div>;
} );
