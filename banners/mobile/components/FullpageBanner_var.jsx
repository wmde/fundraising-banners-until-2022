import { h } from 'preact';
import classNames from 'classnames';

import BannerText from './BannerText';

export default function FullPageBanner( props ) {
	const DonationForm = props.donationForm;

	return <div className={ classNames( 'fullpage-banner', { visible: props.isFullPageVisible } ) }>
		<div className="fullpage-banner__close">
			<button className="close-button" onClick={ props.onMaybeLater }>schließen</button>
		</div>
		<div className="fullpage-banner__info">
			<BannerText dynamicCampaignText={ props.dynamicCampaignText }/>
		</div>
		<div className="call-to-action">
			Jetzt sind Sie <span className="call-to-action__optional-text">in Deutschland</span> gefragt.
		</div>
		<DonationForm
			formItems={props.formItems}
			bannerName={props.bannerName}
			campaignName={props.campaignName}
			formatters={props.formatters}
			impressionCounts={props.impressionCounts}
			customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder-short' ] }
			onSubmit={props.onSubmit}
			toggleFundsModal={props.toggleFundsModal}
		/>
	</div>;
}
