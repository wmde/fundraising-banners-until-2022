export default function useOfFundsFiguresOverride( useOfFundsMessages, campaignConfigurationOverrides ) {
	for ( const key in campaignConfigurationOverrides ) {
		const item = useOfFundsMessages.applicationOfFundsData.find( x => x.id === key );
		if ( item ) {
			item.percentage = campaignConfigurationOverrides[ key ];
		}
	}
	return useOfFundsMessages;
}
