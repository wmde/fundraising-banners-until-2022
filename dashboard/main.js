import { render, createElement } from "preact";
import Dashboard from "./components/Dashboard";

const dashboardContainer = document.getElementById('dashboard');

console.log("campaigns is ", CAMPAIGNS)

render( createElement(
	Dashboard,
		// CAMPAIGNS is a global variable injected by webpack DefinePlugin, see webpack.config.js
	{ campaigns: CAMPAIGNS }
	),
	dashboardContainer
);
