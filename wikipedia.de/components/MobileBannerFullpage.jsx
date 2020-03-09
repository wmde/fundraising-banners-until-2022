// eslint-disable-next-line no-unused-vars
import { h, Component } from 'preact';
import classNames from 'classnames';

import DonationForm from '../../shared/components/ui/form/DonationForm';
import Infobox from '../../shared/components/ui/Infobox';
import ProgressBar from '../../shared/components/ui/ProgressBar';

export default class MobileBannerFullpage extends Component {
	render( props ) {
		const campaignProjection = props.campaignProjection;
		const trackingParams = `piwik_campaign=${props.campaignName}&piwik_kwd=${props.bannerName}_link`;
		return <div id="frbanner" className={ classNames( 'frbanner', { visible: props.isFullPageVisible && props.bannerVisible } ) }>
			<div id="frbanner-window" className="frbanner-window">
				<div id="modal-signup" className="cf">
					<div className="infobox">
						<div className="close">
							<button className="close__link" onClick={ props.closeBanner }>&#x2715;</button>
						</div>
						<Infobox
							formatters={props.formatters}
							campaignParameters={props.campaignParameters}
							campaignProjection={props.campaignProjection}
							bannerText={props.bannerText}
							propsForText={ { registerStartHighlight: props.registerStartHighlight } }
						/>
						<div>
							<ProgressBar
								locale={ props.locale }
								daysLeft={ campaignProjection.getRemainingDays() }
								donationAmount={ campaignProjection.getProjectedDonationSum() }
								goalDonationSum={ campaignProjection.goalDonationSum }
								missingAmount={ campaignProjection.getProjectedRemainingDonationSum() }
								setStartAnimation={ ()=>{} }
								animate={ false }
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
						/>
						<div className="smallprint" id="frbanner-smallprint">
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
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
}
