import { h } from 'preact';

export default function Dashboard( props ) {
	return <div>
		<h1>FUN Banner Dashboard</h1>
		<p>We have { props.campaigns?.length } banners</p>

		<table>
			{ Object.entries( props.campaigns ).map( ( [ campaignName, campaign ] ) => (
				<tr key={campaignName}>
					<td>
						{ /* TODO put icon here maybe */ }
						{ campaignName }
					</td>
					<td>
						{ campaign.banners.ctrl.pagename }
					</td>
					<td>
						{ campaign.banners.var?.pagename }
					</td>
				</tr>
			)
			)}

		</table>

	</div>;
}
