import { h } from 'preact';
import classNames from 'classnames';
import BannerText from '../BannerText';
import ProgressBar from '../../shared/components/ui/ProgressBar';

export default function FullpageBanner( props ) {
	const DonationForm = props.donationForm;
	const trackingParams = `piwik_campaign=${ props.campaignName }&piwik_kwd=${ props.bannerName }_link`;
	const campaignProjection = props.campaignProjection;

	return <div
		className={ classNames( 'fullpage-banner', { visible: props.isFullPageVisible && props.bannerVisible } ) }>
		<div className="fullpage-banner__close" onClick={ props.onClose }/>
		<div className="fullpage-banner__info">
			<div className="fullpage-banner__heading">
				The Wikimedia Fundraising Campaign
			</div>
			<BannerText dynamicCampaignText={ props.dynamicCampaignText }/>
			<ProgressBar
				formatters={props.formatters}
				daysLeft={ campaignProjection.getRemainingDays() }
				donationAmount={ campaignProjection.getProjectedDonationSum() }
				goalDonationSum={ campaignProjection.goalDonationSum}
				missingAmount={ campaignProjection.getProjectedRemainingDonationSum() }
				setStartAnimation={ props.setStartAnimation }
				animate={ true }
			/>
		</div>
		<div className="call-to-action">
			Now it's your turn.
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
		/>
	</div>;
}
