// eslint-disable-next-line no-unused-vars
import { h, Component } from 'preact';
import classNames from 'classnames';

import DonationFormWithHeaders from '../../shared/components/ui/form/DonationForm';
import ProgressBar from '../../shared/components/ui/ProgressBar';
import Infobox from '../../shared/components/ui/Infobox';

export default class FullpageBanner extends Component {
	render( props ) {
		const campaignProjection = props.campaignProjection;
		const trackingParams = `piwik_campaign=${props.campaignName}&piwik_kwd=${props.bannerName}_link`;
		return <div className={ classNames( 'frbanner', { visible: props.isFullPageVisible && props.bannerVisible } ) }>
			<div className="frbanner-window">
				<header className="headline">
					<div className="headline__container">
						<span className="headline__content">the wikimedia fundraising campaign</span>
					</div>
				</header>
				<div className="close-button" onClick={props.onClose}/>
				<Infobox
					formatters={props.formatters}
					campaignParameters={props.campaignParameters}
					campaignProjection={props.campaignProjection}
					bannerText={props.bannerText}
					propsForText={ { registerStartHighlight: props.registerStartHighlight } }
				/>

				<div>
					<ProgressBar
						animate={false}
						formatters={props.formatters}
						daysLeft={campaignProjection.getRemainingDays()}
						donationAmount={campaignProjection.getProjectedDonationSum()}
						goalDonationSum={campaignProjection.goalDonationSum}
						missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
						setStartAnimation={() => {}}
					/>
				</div>
			</div>
			<DonationFormWithHeaders
				formItems={props.formItems}
				bannerName={props.bannerName}
				campaignName={props.campaignName}
				formatters={props.formatters}
				impressionCounts={props.impressionCounts}
			/>
			<div className="smallprint">
				Please note that the next steps of the donation process are in German.
			</div>
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
					<a href={`https://spenden.wikimedia.de/use-of-funds?${ trackingParams }`} target="_blank">Where does my donation go?</a>
				</span>
			</div>
		</div>;
	}
}
