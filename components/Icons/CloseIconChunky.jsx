import { h } from 'preact';

export default function CloseIconChunky( { fill } ) {
	return <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g transform="matrix(1,0,0,1,-20,-22)">
			<g id="ChunkyButton" transform="matrix(0.707107,-0.707107,0.707107,0.707107,-15.0833,33.5858)">
				<path d="M36,32L36,21L30,21L30,32L19,32L19,38L30,38L30,49L36,49L36,38L47,38L47,32L36,32Z" fill={ fill || 'rgb(219,176,173)' }/>
			</g>
		</g>
	</svg>;
}
