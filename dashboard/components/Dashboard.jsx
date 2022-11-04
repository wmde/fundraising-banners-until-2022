import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import BannerActions from './BannerActions';
import IconShutterbug from './IconShutterbug';
import IconGit from './IconGit';
import IconCog from './IconCog';
import IconCommand from './IconCommand';
import { parseCompileInfo } from '../util';
import classNames from 'classnames';

export default function Dashboard( props ) {

	const [ compileInfo, setCompileInfo ] = useState( {} );
	useEffect( () => {
		fetch( '/compiled-banners/' ).then( async res => {
			if ( !res.ok ) {
				return;
			}
			const fileList = await res.text();
			setCompileInfo( parseCompileInfo( fileList ) );
		} );
	}, [] );

	const gitFailurePrefix = /^UNKNOWN -/;

	const onDoScreenshots = ( campaignName, e ) => {
		e.preventDefault();
		navigator.clipboard.writeText( `ssh -t funweb3-deploy "queue_screenshots ${campaignName}"` )
			.then( () => {
				// TODO indicate the the copying was successful by making something flash
			} );
	};

	let branchName = props.gitBranch;
	if ( props.gitBranch.match( gitFailurePrefix ) ) {
		branchName = props.gitBranch.replace( gitFailurePrefix, '' );
	}

	return ( <div>
		<header className="header">
			<div className="header-left">
				<h1>FUN Forge</h1>
				<a className="header-link header-git"
					target="_blank"
					href={`https://github.com/wmde/fundraising-banners/tree/${branchName}`}>
					<IconGit/> { branchName }
				</a>
			</div>
			<div className="header-right">
				<a href="http://localhost:8084/" className="header-link">Main</a>
				<a href="http://localhost:8084/thank_you" className="header-link">TY</a>
				<a href="https://meta.wikimedia.org/w/index.php?title=Special:CentralNotice" className="header-link">CN</a>
				<a href="https://meta.wikimedia.org/wiki/Special:CentralNoticeBanners" className="header-link">CN Banners</a>
			</div>
		</header>

		<section className="content">
			<div className="campaigns">
				{ Object.entries( props.campaigns ).map( ( [ channelName, campaign ], index ) => {
					const isWPDE = campaign.banners.ctrl.pagename.includes( 'WPDE' );
					return <div
						key={ channelName }
						className={classNames( 'campaign', { 'current-branch': campaign.name === branchName } ) }
						style={ '--index: ' + index }>
						<div className="campaign-title">
							<span title={ campaign.name} >{ channelName }</span>
							{ !isWPDE && (
								<a href={ `https://meta.wikimedia.org/w/index.php?title=Special:CentralNotice&subaction=noticeDetail&notice=${ campaign.name }` }
									target="_blank"
									className="link-icon link-icon-large"
									data-tooltip="View Central Notice Settings">
									<IconCog/>
								</a>
							) }
							<a href={ `https://shutterbug.wikimedia.de/#/slides/${ campaign.campaign_tracking }` }
								target="_blank"
								className="link-icon link-icon-large"
								data-tooltip="View in Shutterbug">
								<IconShutterbug/>
							</a>
							<a href="#"
								className="link-icon link-icon-large"
								data-tooltip="Copy Shutterbug Command"
								onClick={ ( e ) => onDoScreenshots( campaign.name, e ) }>
								<IconCommand/>
							</a>
						</div>
						<div className="campaign-banners">
							<div className="campaign-banner">
								<BannerActions
									campaign={ campaign }
									banner={ campaign.banners.ctrl }
									compileInfo={ compileInfo[ campaign.banners.ctrl.pagename ]}
									isWPDE={ isWPDE }
								/>
							</div>
							<div className="campaign-banner">
								<BannerActions
									campaign={ campaign }
									banner={ campaign.banners.var }
									compileInfo={ compileInfo[ campaign.banners.var.pagename ]}
									isWPDE={ isWPDE }/>
							</div>
						</div>
					</div>;
				} ) }
			</div>
		</section>

		<footer className="footer">
			<div className="footer-left">Welcome to the Fun Forge, we got fun campaigns!</div>
			<div className="footer-right">
				<a href="#" className="footer-link">Docs</a>
			</div>
		</footer>

	</div> );
}
