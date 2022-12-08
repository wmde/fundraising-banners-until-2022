import { h } from 'preact';
import BannerActions from './BannerActions';
import IconShutterbug from './IconShutterbug';
import IconGit from './IconGit';
import IconRefresh from './IconRefresh';

export default function Dashboard( props ) {
	const gitFailurePrefix = /^UNKNOWN -/;

	const onDoScreenshots = ( e ) => {
		e.preventDefault();
		navigator.clipboard.writeText( 'ssh -t funweb-deploy "./queue_screenshots.sh C22_WMDE_Test_18"' )
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
				<a className="header-link" title="Copy SSH command for screenshots to clipboard" onClick={onDoScreenshots} href="#">Shutterbug Command</a>
				<a href="https://meta.wikimedia.org/w/index.php?title=Special:CentralNotice" className="header-link">CN</a>
				<a href="https://meta.wikimedia.org/wiki/Special:CentralNoticeBanners" className="header-link">CN Banners</a>
				<a href="#" onClick={ refresh } className="header-link header-link-refresh"><IconRefresh/></a>
			</div>
		</header>

		<section className="content">
			<div className="campaigns">
				{ Object.entries( props.campaigns ).map( ( [ campaignName, campaign ], index ) => (
					<div key={ campaignName } className="campaign" style={ '--index: ' + index }>
						<div className="campaign-title">
							<a href={`https://shutterbug.wikimedia.de/#/slides/${campaign.campaign_tracking}`}
								className="link-icon link-icon-large"
								data-tooltip="View in Shutterbug">
								<IconShutterbug/>
							</a>
							<span>{ campaignName }</span>
						</div>
						<div className="campaign-banners">
							<div className="campaign-banner">
								<BannerActions campaign={campaign} banner={ campaign.banners.ctrl } />
							</div>
							<div className="campaign-banner">
								<BannerActions campaign={campaign} banner={ campaign.banners.var } />
							</div>
						</div>
					</div>
				) ) }
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
