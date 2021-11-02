import { h } from 'preact';
import CompanyBudgets from './CompanyBudgets';
import { splitStringAt } from '../../../split_string_at';
import classNames from 'classnames';
import * as PropTypes from 'prop-types';

export default function FundsContent( props ) {
	const onCallToAction = props.onCallToAction ? props.onCallToAction : props.toggleFundsModal;
	const content = props.useOfFundsText;
	const organizationClassLookup = new Map( Object.entries( content.orgchart.organizationClasses ) );
	const getHighlightClassName = part => organizationClassLookup.has( part ) ? `use_of_funds__org use_of_funds__org--${organizationClassLookup.get( part )}` : '';
	const highlightOrganizations = text => splitStringAt( Array.from( organizationClassLookup.keys() ), text ).map( part =>
		// Don't wrap punctuation in span to avoid whitespace. A workaround for https://github.com/facebook/react/issues/1643
		part === '.' ? part : <span className={classNames( getHighlightClassName( part ) )} key={part}> { part } </span>
	);
	return <div className="use_of_funds">
		<div className="use_of_funds__section">
			<div className="use_of_funds__section_intro">
				<h2>{content.intro.headline}</h2>
				<div>{content.intro.text}</div>
			</div>
			{props.children}
		</div>

		<div className="use_of_funds__section use_of_funds__section--two-cols-info">
			<div className="use_of_funds__column--info">
				<span>{content.detailedReports.international.intro}</span>
				<a href={content.detailedReports.international.linkUrl} target="_blank">
					{content.detailedReports.international.linkName}
				</a>
			</div>
			<div className="use_of_funds__column--info" style="display:none">
				<span>{content.detailedReports.germany.intro}</span>
				<a href={content.detailedReports.germany.linkUrl} target="_blank">
					{content.detailedReports.germany.linkName}
				</a>
			</div>
		</div>
		<div className="use_of_funds__section use_of_funds__section--two-cols">
			<div className="use_of_funds__column">
				<div className="use_of_funds__benefits_list">
					<h2>{content.benefitsList.headline}</h2>
					<ul className="use_of_funds__icon-list">
						{content.benefitsList.benefits.map( benefit => (
							<li className={'use_of_funds__icon-list_item--' + benefit.icon} key={benefit.text}>
								{benefit.text}
							</li>
						) )}
					</ul>
				</div>
			</div>
			<div className="use_of_funds__column">
				<div className="use_of_funds__comparison">
					<h2>{content.comparison.headline}</h2>
					<div>{content.comparison.paragraphs.map( text => <p key={text}>{ text }</p> )}
						<h3>{content.comparison.subhead}</h3>
					</div>
					<CompanyBudgets
						citationLabel={ content.comparison.citationLabel }
						companies={ content.comparison.companies }
					/>
				</div>
			</div>
		</div>
		<div className="use_of_funds__section use_of_funds__section--orgchart">
			<div className="use_of_funds__orgchart_text">
				<h2>{content.orgchart.headline}</h2>
				<div>
					<p>
						{highlightOrganizations( content.orgchart.paragraphs[ 0 ] )}
					</p>
					{content.orgchart.paragraphs.slice( 1 ).map( para => <p key={para}>{para}</p> )}
				</div>
			</div>
			<div className="use_of_funds__orgchart_image">
				<img src={ content.orgchart.imageUrl }/>
			</div>
		</div>
		<div className="banner_model__section use_of_funds__section--call_to_action">
			<button className="use_of_funds__button" onClick={onCallToAction}>{content.callToAction}</button>
		</div>
		<div style="text-align: left; font-size: small; padding-bottom: 16px;">{content.provisional}</div>
	</div>;
}

FundsContent.propTypes = {
	toggleFundsModal: PropTypes.func.isRequired,
	/**
	 * Special handling function for "donate now" button, defaults to toggleFundsModal
	 */
	onCallToAction: PropTypes.func,
	/**
	 * Translatable contents
	 */
	useOfFundsText: PropTypes.object,
	locale: PropTypes.string
};
