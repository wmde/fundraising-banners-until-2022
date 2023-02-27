import { h } from 'preact';

/* eslint-disable max-len */
export default function CheckCircle( { fill } ) {
	return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clipPath="url(#clip0_735_346)">
			<path d="M14.6666 7.38662V7.99995C14.6658 9.43757 14.2003 10.8364 13.3395 11.9878C12.4787 13.1393 11.2688 13.9816 9.89016 14.3892C8.51154 14.7968 7.03809 14.7479 5.68957 14.2497C4.34104 13.7515 3.18969 12.8307 2.40723 11.6247C1.62476 10.4186 1.25311 8.99199 1.3477 7.55749C1.44229 6.12299 1.99806 4.7575 2.93211 3.66467C3.86615 2.57183 5.12844 1.81021 6.53071 1.49338C7.93298 1.17656 9.4001 1.32151 10.7133 1.90662" stroke={ fill ?? '#FFA51D' } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M14.6667 2.66663L8 9.33996L6 7.33996" stroke={ fill ?? '#FFA51D' } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		</g>
		<defs>
			<clipPath id="clip0_735_346">
				<rect width="16" height="16" fill="white"/>
			</clipPath>
		</defs>
	</svg>;
}
