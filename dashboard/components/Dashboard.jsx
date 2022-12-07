import { h } from 'preact';
import BannerActions from './BannerActions';

export default function Dashboard( props ) {
	return <div>
		<h1>FUN Forge</h1>

		<table>
			{ Object.entries( props.campaigns ).map( ( [ campaignName, campaign ] ) => (
				<tr key={campaignName}>
					<td className='campaign-column'>
						{ /* TODO put icon here maybe */ }
						<a className='shutterbug-preview' target='_blank' href={`https://shutterbug.wikimedia.de/#/slides/${campaign.campaign_tracking}`}>📷 </a>
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
