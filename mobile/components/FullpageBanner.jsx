// eslint-disable-next-line no-unused-vars
import { h, Component } from 'preact';
import classNames from 'classnames';

import DonationFormWithHeaders from './ui/form/DonationFormWithHeaders';
import ProgressBar from '../../shared/components/ui/ProgressBar';
import Infobox from '../../shared/components/ui/Infobox';

export default class FullpageBanner extends Component {
	render( props ) {
		const campaignProjection = props.campaignProjection;
		const trackingParams = `piwik_campaign=${props.campaignName}&piwik_kwd=${props.bannerName}_link`;
		return <div className={ classNames( 'fullpage-banner', { visible: props.isFullPageVisible && props.bannerVisible } ) }>
			<div className="fullpage-banner__info">
				<div className="close" onClick={ props.onClose }/>
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
				<div className="call-to-action">
					Jetzt sind Sie <span className="call-to-action__optional-text">in Deutschland</span> gefragt.
				</div>
			</div>
			<DonationFormWithHeaders
				formItems={props.formItems}
				bannerName={props.bannerName}
				campaignName={props.campaignName}
				formatters={props.formatters}
				impressionCounts={props.impressionCounts}
				customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder-short' ] }
				onSubmit={props.onSubmit}
			/>
			<div className="smallprint">
				<span>
					<a href={`https://spenden.wikimedia.de/spenden/Impressum?${ trackingParams }`} target="_blank">Impressum</a>
				</span>
				<span className="separator"> | </span>
				<span>
					<a href={`https://spenden.wikimedia.de/spenden/Datenschutz?${ trackingParams }`} target="_blank">Datenschutz</a>
				</span>
				<span className="separator"> | </span>
				<span>
					<a href={`https://spenden.wikimedia.de/use-of-funds?${ trackingParams }`} target="_blank">Wohin geht meine Spende?</a>
				</span>
			</div>
		</div>;
	}
}
