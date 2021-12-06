import { useState } from 'preact/hooks';

export const NEW_DONATION_URL = 'https://spenden.wikimedia.de/donation/new';
export const ADD_DONATION_URL = 'https://spenden.wikimedia.de/donation/add';

// When IE is finally dead, we'll use URLSearchParams instead
const queryString = formActionParams => Object.keys( formActionParams )
	.map( key => `${key}=${formActionParams[ key ]}` )
	.join( '&' );

export default function useFormAction( { bannerName, campaignName, impressionCounts }, extraProps = {} ) {
	const initialQuery = {
		piwik_kwd: bannerName,
		piwik_campaign: campaignName,
		banner_submission: 1,
		// FIXME: impressionCounts is not a reactive property this variable doesn't get
		//        incremented when the banner presenter updates it, we need to figure that out
		impCount: impressionCounts.overallCount + 1,
		bImpCount: impressionCounts.bannerCount + 1,
		...extraProps
	};

	const [ urlState, setUrlState ] = useState( NEW_DONATION_URL );
	const [ queryState ] = useState( initialQuery );
	const setUrl = ( url ) => {
		const urlWithoutQuery = url.split( '?' )[ 0 ];
		setUrlState( urlWithoutQuery );
	};
	return [ urlState + '?' + queryString( queryState ), setUrl ];
}
