import { h } from 'preact';
import classNames from 'classnames';

import CloseIconMobile from '../../../components/Icons/CloseIconMobile';
import Footer from '../../../components/Footer/Footer';
import ProgressBar, { AmountToShowOnRight } from '../../../components/ProgressBar/ProgressBar';

export default function FullBanner( props ) {
	const DonationForm = props.donationForm;
	const BannerText = props.bannerText;

	return <div className={ classNames( 'wmde-banner-full', { visible: props.isFullPageVisible } ) }>
		<button className="wmde-banner-full-close t-full-banner-close" onClick={ props.onClose }><CloseIconMobile/></button>
		<div className="wmde-banner-full-info">
			<BannerText dynamicCampaignText={ props.dynamicCampaignText }/>
			<ProgressBar
				formatters={ props.formatters }
				daysLeft={ props.campaignProjection.getRemainingDays() }
				donationAmount={ props.campaignProjection.getProjectedDonationSum() }
				goalDonationSum={ props.campaignProjection.goalDonationSum }
				missingAmount={ props.campaignProjection.getProjectedRemainingDonationSum() }
				setStartAnimation={ props.setStartAnimation }
				animate={ true }
				amountToShowOnRight={ AmountToShowOnRight.TOTAL }
				isLateProgress={ props.campaignParameters.isLateProgress }
			/>
		</div>
		<div className="wmde-banner-full-call-to-action">
			Jetzt sind Sie <span className="wmde-banner-full-call-to-action-optional-text">in Deutschland</span> gefragt.
		</div>
		<DonationForm
			onSubmit={ props.onSubmit }
			formItems={props.formItems}
			bannerName={props.bannerName}
			campaignName={props.campaignName}
			formatters={props.formatters}
			impressionCounts={props.impressionCounts}
			onFormInteraction={this.onFormInteraction}
			buttonText={ props.buttonText }
			errorPosition={ props.errorPosition }
			bannerType={ props.bannerType }
			formActionProps={ props.formActionProps }
			donationForms={ props.donationForms }
			createFormController={ props.createFormController }
			trackBannerEvent={ ( eventName ) => props.trackBannerEvent( eventName ) }
		/>
		<div className="wmde-banner-full-small-print">
			<span>
				<a className="application-of-funds-link"
					href={`https://spenden.wikimedia.de/use-of-funds?${ props.trackingParams }`}
					onClick={ props.toggleFundsModal } >Wohin geht meine Spende?</a>
			</span>
		</div>

		<Footer/>

	</div>;
}
