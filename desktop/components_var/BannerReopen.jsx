// eslint-disable-next-line no-unused-vars
import { Component, h } from 'preact';
import CloseIcon from './ui/CloseIcon';
import ChevronRightIcon from './ui/ChevronRightIcon';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../shared/components/TranslationContext';

export default class BannerReopen extends Component {
	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const Translations = useContext( TranslationContext );
		return <div className="banner__reopen">
			<span className="banner__reopen-text-main">
				<span className="banner__reopen-text-main-text">{ Translations[ 'minimised-text' ] }</span>
			</span>
			<span className="banner__reopen-text-small">
				<a href="#" className="banner__reopen-close" onClick={ props.closeBanner }>
					<CloseIcon/>
				</a>
				<a href="#" className="banner__reopen-reopen" onClick={ props.maximiseBanner }>{ Translations[ 'minimised-reopen' ] }</a>
				<span className="banner__reopen-chevron">
					<ChevronRightIcon/>
				</span>
			</span>
		</div>;
	}
}
