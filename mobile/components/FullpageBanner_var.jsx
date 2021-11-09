import { h } from 'preact';
import classNames from 'classnames';

import CloseIcon from './ui/CloseIcon';
import ClockIcon from './ui/ClockIcon';
import BannerText from './BannerText';
import ProgressBar, { AmountToShowOnRight } from '../../shared/components/ui/ProgressBar';

export default function FullPageBanner( props ) {
	const DonationForm = props.donationForm;

	return <div className={ classNames( 'fullpage-banner', { visible: props.isFullPageVisible && props.bannerVisible } ) }>
		<div className="fullpage-banner__close">
			<a className="minimise-link" onClick={ props.onMinimise }>
				<ClockIcon/> <span className="minimise-link-text">{ props.translations[ 'minimise-button' ] }</span>
			</a>
			<button className="close-button" onClick={ props.onClose }><CloseIcon/></button>
		</div>
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
