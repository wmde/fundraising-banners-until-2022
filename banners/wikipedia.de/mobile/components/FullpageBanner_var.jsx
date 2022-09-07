import { h, Component } from 'preact';
import classNames from 'classnames';

import ProgressBar from '../../../../shared/components/ui/ProgressBar';
import BannerText from './BannerText';

export default class FullpageBanner extends Component {
	render( props ) {
		const campaignProjection = props.campaignProjection;
		const DonationForm = props.donationForm;
		const trackingParams = `piwik_campaign=${props.campaignName}&piwik_kwd=${props.bannerName}_link`;

		return <div className={ classNames( 'fullpage-banner', { visible: props.isFullPageVisible && props.bannerVisible } ) }>

			<div className="fullpage-banner__close" onClick={props.onClose}>
				{ props.setCookie ? <img src="https://bruce.wikipedia.de/close-banner?c=fundraising" alt="" height="0" width="0"/> : '' }
			</div>
			<div className="fullpage-banner__info">
				<div className="fullpage-banner__heading">
					Jetzt spenden
				</div>
				<div className="infobox">
					<BannerText dynamicCampaignText={ props.dynamicCampaignText }/>
				</div>
				<ProgressBar
					formatters={props.formatters}
					daysLeft={campaignProjection.getRemainingDays()}
					donationAmount={campaignProjection.getProjectedDonationSum()}
					goalDonationSum={campaignProjection.goalDonationSum}
					missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
					setStartAnimation={props.setStartAnimation}
					animate={true}
				/>
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
				trackingParams={trackingParams}
				toggleFundsModal={props.toggleFundsModal}
			/>
		</div>;
	}
}
