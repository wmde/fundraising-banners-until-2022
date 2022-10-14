import { h } from 'preact';
import classNames from 'classnames';

import Footer from '../../../components/Footer/Footer';
import ProgressBar from '../../../components/ProgressBar/LegacyProgressBar';

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

		<button className="wmde-banner-close" onClick={ props.onClose }></button>

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
					animate={ true }
				/>
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
		/>
		<Footer/>

		<div className="wmde-banner-footer-small-print">
			<a href={`https://spenden.wikimedia.de/spenden/Impressum?${ props.trackingParams }`} target="_blank">
				Legal Details
			</a>
			<span className="separator"> | </span>
			<a href={`https://spenden.wikimedia.de/spenden/Datenschutz?${ props.trackingParams }`} target="_blank">
				Privacy Policy
			</a>
			<span className="separator"> | </span>
			<a className="application-of-funds-link" href={`https://spenden.wikimedia.de/use-of-funds?${ props.trackingParams }`} onClick={ props.toggleFundsModal } >
				Where does my donation go?
			</a>
		</div>
	</div>;
}
