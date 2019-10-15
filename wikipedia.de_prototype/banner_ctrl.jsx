import { h, render } from 'preact';
import style from './banner.pcss';

function Banner(props) {
	return <div class="banner">I am a Banner! {props.name}.</div>;
}

// Usage
const App = <Banner name="Pay now!" />;

render(App, document.getElementById('WMDE-Banner-Container'));