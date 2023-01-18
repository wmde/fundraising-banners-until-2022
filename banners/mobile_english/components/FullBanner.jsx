import { h } from 'preact';
import classNames from 'classnames';

import Footer from '../../../components/Footer/Footer';
import ProgressBar, { AmountToShowOnRight } from '../../../components/ProgressBar/ProgressBar';
import ButtonClose from '../../../components/ButtonClose/ButtonClose';
import CloseIconChunky from '../../../components/Icons/CloseIconChunky';

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
		<ButtonClose testLabel={'t-full-banner-close'} onClick={ props.onClose } icon={ <CloseIconChunky/> }/>

		<header className="wmde-banner-headline">
			<span className="wmde-banner-headline-content">the wikimedia fundraising campaign</span>
		</header>

		<div className="wmde-banner-full-info">
			<BannerText dynamicCampaignText={ props.dynamicCampaignText }/>

			<div>
				<ProgressBar
					formatters={ props.formatters }
					daysLeft={ props.campaignProjection.getRemainingDays() }
					donationAmount={ props.campaignProjection.getProjectedDonationSum() }
					goalDonationSum={ props.campaignProjection.goalDonationSum }
					missingAmount={ props.campaignProjection.getProjectedRemainingDonationSum() }
					setStartAnimation={ props.setStartAnimation }
					isLateProgress={ props.campaignParameters.isLateProgress }
					amountToShowOnRight={ AmountToShowOnRight.TOTAL }/>
			</div>
		</div>
		<div className="wmde-banner-full-call-to-action"></div>
		<DonationForm
			formItems={props.formItems}
			bannerName={props.bannerName}
			campaignName={props.campaignName}
			formatters={props.formatters}
			impressionCounts={props.impressionCounts}
			customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder-short' ] }
			onSubmit={props.onSubmit}
			toggleFundsModal={props.toggleFundsModal}
			scrollToFirstError={ scrollToFirstError }
			preselectedAmount={ props.preselectedAmount }
			formActionProps={ props.formActionProps }
		/>
		<Footer/>

		<div className="wmde-banner-footer-small-print">
			<a className="application-of-funds-link" href={`https://spenden.wikimedia.de/use-of-funds?${ props.trackingParams }`} onClick={ props.toggleFundsModal } >
				Where does my donation go?
			</a>
		</div>
	</div>;
}
