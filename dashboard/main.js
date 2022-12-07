import { render, createElement } from 'preact';
import Dashboard from './components/Dashboard';

import './styles.pcss';

const dashboardContainer = document.getElementById( 'dashboard' );

// eslint-disable-next-line no-undef
console.log( 'campaigns is ', CAMPAIGNS );

render(
	createElement(
		Dashboard,
		// global variables injected by webpack DefinePlugin, see webpack.config.js
		{
			// eslint-disable-next-line no-undef
			campaigns: CAMPAIGNS,
			// eslint-disable-next-line no-undef
			gitBranch: GIT_BRANCH }
	),
	dashboardContainer
);
