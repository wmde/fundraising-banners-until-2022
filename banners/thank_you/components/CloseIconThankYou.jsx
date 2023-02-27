import { h } from 'preact';

export default function CloseIconThankYou( { fill } ) {
	return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M16 2L2 16" stroke={ fill ?? '#2B6DA0' } strokeWidth="3" strokeLinecap="round"/>
		<path d="M16 16.0007L2 2.00078" stroke={ fill ?? '#2B6DA0' } strokeWidth="3" strokeLinecap="round"/>
	</svg>;
}
