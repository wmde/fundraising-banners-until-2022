import { h } from 'preact';
import BannerActions from './BannerActions';

export default function Dashboard( props ) {
	return <div>
		<h1>FUN Forge</h1>

		<table>
			{ Object.entries( props.campaigns ).map( ( [ campaignName, campaign ] ) => (
				<tr key={campaignName}>
					<td>
						{ /* TODO put icon here maybe */ }
						<a href={`https://shutterbug.wikimedia.de/#/slides/${campaign.campaign_tracking}`}>📷 </a>
						{ campaignName }
					</td>
					<td>
						<BannerActions campaign={campaign} banner={ campaign.banners.ctrl } />
					</td>
					<td>
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
