import { h } from 'preact';
import classNames from 'classnames';

import CloseIcon from './ui/CloseIcon';
import BannerText from './BannerText';
import ProgressBar, { AmountToShowOnRight } from '../../shared/components/ui/ProgressBar';

export default function FullPageBanner( props ) {
	const DonationForm = props.donationForm;

	return <div className={ classNames( 'fullpage-banner', { visible: props.isFullPageVisible && props.bannerVisible } ) }>
		<button className="fullpage-banner__close" onClick={ props.onClose }><CloseIcon/></button>
		<div className="fullpage-banner__info">
			<div className="fullpage-banner__heading">
				Jetzt spenden
			</div>
			<BannerText dynamicCampaignText={ props.dynamicCampaignText }/>
			<ProgressBar
				formatters={props.formatters}
				daysLeft={props.campaignProjection.getRemainingDays()}
				donationAmount={props.campaignProjection.getProjectedDonationSum()}
				goalDonationSum={props.campaignProjection.goalDonationSum}
				missingAmount={props.campaignProjection.getProjectedRemainingDonationSum()}
				setStartAnimation={props.setStartAnimation}
				animate={true}
				amountToShowOnRight={AmountToShowOnRight.MISSING}
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
			toggleFundsModal={props.toggleFundsModal}
		/>
	</div>;
}
