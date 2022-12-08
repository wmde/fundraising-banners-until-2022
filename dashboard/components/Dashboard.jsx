import { h } from 'preact';
import BannerActions from './BannerActions';
import IconShutterbug from './IconShutterbug';
import IconGit from './IconGit';
import IconRefresh from './IconRefresh';
import IconCog from './IconCog';
import IconCommand from './IconCommand';

export default function Dashboard( props ) {
	const gitFailurePrefix = /^UNKNOWN -/;

	const onDoScreenshots = ( campaignName, e ) => {
		e.preventDefault();
		navigator.clipboard.writeText( `ssh -t funweb3-deploy "queue_screenshots ${campaignName}"` )
			.then( () => {
				// TODO indicate the the copying was successful by making something flash
			} );
	};

	let branchInfo = props.gitBranch;
	if ( props.gitBranch.match( gitFailurePrefix ) ) {
		branchInfo = props.gitBranch.replace( gitFailurePrefix, '' );
	}

	const refresh = e => {
		e.preventDefault();
		window.location.reload();
	};

	return <div>
		<header className="header">
			<div className="header-left">
				<h1>FUN Forge</h1> <a className="header-link header-git" target="_blank" href="https://github.com/wmde/fundraising-banners"><IconGit/> { branchInfo }</a>
			</div>
			<div className="header-right">
				<a href="https://meta.wikimedia.org/w/index.php?title=Special:CentralNotice" className="header-link">CN</a>
				<a href="https://meta.wikimedia.org/wiki/Special:CentralNoticeBanners" className="header-link">CN Banners</a>
				<a href="#" onClick={ refresh } className="header-link header-link-refresh"><IconRefresh/></a>
			</div>
		</header>

		<section className="content">
			<div className="campaigns">
				{ Object.entries( props.campaigns ).map( ( [ campaignName, campaign ], index ) => {
					const isWPDE = campaign.banners.ctrl.pagename.includes( 'WPDE' );
					return <div key={ campaignName } className="campaign" style={ '--index: ' + index }>
						<div className="campaign-title">
							<span>{ campaignName }</span>
							{ !isWPDE && (
								<a href={ `https://shutterbug.wikimedia.de/#/slides/${ campaign.campaign_tracking }` }
									className="link-icon link-icon-large"
									data-tooltip="View Central Notice Settings">
									<IconCog/>
								</a>
							) }
							<a href={ `https://shutterbug.wikimedia.de/#/slides/${ campaign.campaign_tracking }` }
								className="link-icon link-icon-large"
								data-tooltip="View in Shutterbug">
								<IconShutterbug/>
							</a>
							<a href="#"
								className="link-icon link-icon-large"
								data-tooltip="Copy Shutterbug Command"
								onClick={ ( e ) => onDoScreenshots( campaignName, e ) }>
								<IconCommand/>
							</a>
						</div>
						<div className="campaign-banners">
							<div className="campaign-banner">
								<BannerActions campaign={ campaign } banner={ campaign.banners.ctrl } isWPDE={ isWPDE }/>
							</div>
							<div className="campaign-banner">
								<BannerActions campaign={ campaign } banner={ campaign.banners.var } isWPDE={ isWPDE }/>
							</div>
						</div>
					</div>
				} ) }
			</div>
		</section>

		<footer className="footer">
			<div className="footer-left">Welcome to the Fun Forge, we got fun campaigns!</div>
			<div className="footer-right">
				<a href="#" className="footer-link">Docs</a>
			</div>
		</footer>

	</div>;
}
