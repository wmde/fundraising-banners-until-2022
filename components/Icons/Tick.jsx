import { h } from 'preact';

export default function Tick( { fill } ) {
	return <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M3.9481 6.50195L1.4461 3.99995L0.600098 4.84595L3.9481 8.19995L11.1481 0.999949L10.3021 0.147949L3.9481 6.50195Z" fill={ fill ?? '#5B5B5B' }/>
	</svg>;
}
