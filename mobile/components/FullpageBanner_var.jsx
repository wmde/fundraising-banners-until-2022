import { h } from 'preact';
import classNames from 'classnames';

import Infobox from '../../shared/components/ui/Infobox';

export default function FullpageBanner( props ) {
	const DonationForm = props.donationForm;
	const trackingParams = `piwik_campaign=${ props.campaignName }&piwik_kwd=${ props.bannerName }_link`;

	return <div
		className={ classNames( 'fullpage-banner', { visible: props.isFullPageVisible && props.bannerVisible } ) }>
		<button className="close-button" onClick={ props.onClose }>schließen</button>
		<div className="fullpage-banner__info">
			<Infobox
				formatters={ props.formatters }
				campaignParameters={ props.campaignParameters }
				campaignProjection={ props.campaignProjection }
				bannerText={ props.bannerText }
				propsForText={ { onExpandFullpageText: props.onExpandFullpageText } }
			/>
		</div>
		<div className="call-to-action">
			Jetzt unterstützen
		</div>
		<DonationForm
			formItems={ props.formItems }
			bannerName={ props.bannerName }
			campaignName={ props.campaignName }
			formatters={ props.formatters }
			impressionCounts={ props.impressionCounts }
			customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder-short' ] }
			onSubmit={ props.onSubmit }
			trackingParams={ trackingParams }
			toggleFundsModal={ props.toggleFundsModal }
			showModal={ props.showModal }
		/>
	</div>;
}
