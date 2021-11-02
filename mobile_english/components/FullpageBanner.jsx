import { h, Component } from 'preact';
import classNames from 'classnames';

import ProgressBar from '../../shared/components/ui/ProgressBar';
import Footer from '../../shared/components/ui/Footer';
import BannerText from '../BannerText';

// eslint-disable-next-line react/prefer-stateless-function
export default class FullpageBanner extends Component {
	render( props ) {
		const DonationForm = props.donationForm;
		const campaignProjection = props.campaignProjection;
		const trackingParams = `piwik_campaign=${props.campaignName}&piwik_kwd=${props.bannerName}_link`;
		return <div className={ classNames( 'fullpage-banner', { visible: props.isFullPageVisible && props.bannerVisible } ) }>
			<div className="fullpage-banner__info">
				<header className="headline">
					<div className="headline__container">
						<span className="headline__content">the wikimedia fundraising campaign</span>
					</div>
				</header>
				<div className="close-button" onClick={props.onClose}/>

				<BannerText dynamicCampaignText={ props.dynamicCampaignText }/>

				<div>
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
			</div>
			<DonationForm
				formItems={props.formItems}
				bannerName={props.bannerName}
				campaignName={props.campaignName}
				formatters={props.formatters}
				impressionCounts={props.impressionCounts}
				customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder-short' ] }
				onSubmit={props.onSubmit}
			/>
			<div className="smallprint language-info">
				Please note that the next steps of the donation process are in German.
			</div>

			<Footer/>

			<div className="smallprint">
				<span>
					<a href={`https://spenden.wikimedia.de/spenden/Impressum?${ trackingParams }`} target="_blank">Legal Details</a>
				</span>
				<span className="separator"> | </span>
				<span>
					<a href={`https://spenden.wikimedia.de/spenden/Datenschutz?${ trackingParams }`} target="_blank">Privacy Policy</a>
				</span>
				<span className="separator"> | </span>
				<span>
					<a className="application-of-funds-link"
						href={`https://spenden.wikimedia.de/use-of-funds?${ trackingParams }`}
						onClick={ props.toggleFundsModal } >Where does my donation go?</a>
				</span>
			</div>
		</div>;
	}
}
