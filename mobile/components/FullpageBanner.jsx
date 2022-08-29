import { h } from 'preact';
import classNames from 'classnames';

import CloseIcon from './ui/CloseIcon';

export default function FullPageBanner( props ) {
	const DonationForm = props.donationForm;
	const BannerText = props.bannerText;

	return <div className={ classNames( 'fullpage-banner', { visible: props.isFullPageVisible } ) }>
		<button className="fullpage-banner__close" onClick={ props.onMaybeLater }><CloseIcon/></button>
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
