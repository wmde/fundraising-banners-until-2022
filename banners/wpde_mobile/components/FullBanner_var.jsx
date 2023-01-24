import { h } from 'preact';
import classNames from 'classnames';

import CloseIconMobile from '../../../components/Icons/CloseIconMobile';
import Footer from '../../../components/Footer/Footer';
import ProgressBar, { AmountToShowOnRight } from '../../../components/ProgressBar/ProgressBar';

export default function FullBanner( props ) {
	const DonationForm = props.donationForm;
	const BannerText = props.bannerText;

	const scrollToFirstError = e => {
		e.preventDefault();
		document.getElementsByClassName( 'wmde-banner-select-group-container--with-error' )[ 0 ]?.scrollIntoView(
			{ behavior: 'smooth', block: 'center', inline: 'nearest' }
		);
	};

	return <div className={ classNames( 'wmde-banner-full', { visible: props.isFullPageVisible } ) }>
		<button className="wmde-banner-full-close t-close-full-banner" onClick={ props.onClose }><CloseIconMobile/></button>
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
			onSubmit={props.onSubmit}
			onPage2={ props.onPage2 }
			onSubmitRecurring={ props.onSubmitRecurring }
			onSubmitNonRecurring={ props.onSubmitNonRecurring }
			onChangeToYearly={ props.onChangeToYearly }
			formItems={props.formItems}
			formStep2={ props.donationFormStep2 }
			bannerName={props.bannerName}
			campaignName={props.campaignName}
			formatters={props.formatters}
			impressionCounts={props.impressionCounts}
			customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder-short' ] }
			toggleFundsModal={props.toggleFundsModal}
			scrollToFirstError={ scrollToFirstError }
			preselectedAmount={ props.preselectedAmount }
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
