import { h } from 'preact';
import BannerActions from './BannerActions';

export default function Dashboard( props ) {

	const onDoScreenshots = ( e ) => {
		e.preventDefault();
		navigator.clipboard.writeText( 'ssh -t funweb-deploy "./queue_screenshots.sh C22_WMDE_Test_18"' )
			.then( () => {
				// TODO indicate the the copying was successful by making something flash
			} );
	};

	return <div>
		<h1>FUN Forge</h1>
		<div>
			Current branch {props.gitBranch}
			<a className='do-screenshots' title="Copy SSH command for screenshots to clipboard" onClick={onDoScreenshots} href="#">📷 </a>
		</div>
		<table>
			{ Object.entries( props.campaigns ).map( ( [ campaignName, campaign ] ) => (
				<tr key={campaignName}>
					<td className='campaign-column'>
						{ /* TODO put icon here maybe */ }
						<a
							className='shutterbug-preview'
							title="Show images in Shutterbug"
							target='_blank'
							href={`https://shutterbug.wikimedia.de/#/slides/${campaign.campaign_tracking}`}
						>📷 </a>
						{ campaignName }
					</td>
					<td className='banner-column'>
						<BannerActions campaign={campaign} banner={ campaign.banners.ctrl } />
					</td>
					<td className='banner-column'>
						{ campaign.banners.var ?
							<BannerActions campaign={campaign} banner={ campaign.banners.var } /> :
							'' }
					</td>
				</tr>
			)
			)}

		</table>

	</div>;
}
