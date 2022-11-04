import { render, createElement } from 'preact';
import Dashboard from './components/Dashboard';

import './styles.pcss';

const dashboardContainer = document.getElementById( 'dashboard' );

// eslint-disable-next-line no-undef
const campaignConfig = window.location.pathname === '/thank_you/' ? THANK_YOU : CAMPAIGNS;

// eslint-disable-next-line no-undef
console.log( 'campaigns is ', campaignConfig );

render(
	createElement(
		Dashboard,
		// global variables injected by webpack DefinePlugin, see webpack.config.js
		{
			campaigns: campaignConfig,
			// eslint-disable-next-line no-undef
			gitBranch: GIT_BRANCH
		}
	),
	dashboardContainer
);
