// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import * as PropTypes from 'prop-types';

export default function CompanyBudgets( { companies, citationLabel } ) {
	const highestBudget = companies.reduce( ( maxBudget, company ) => Math.max( maxBudget, company.budget ), 0 );
	return <table className="company_budgets">
		{companies.map( company => {
			const citation = company.budgetCitation ? ( <a
				className="company_budgets__citation_link"
				href={company.budgetCitation}
				target="_blank">
				{citationLabel}
			</a>
			) : '\u00A0';
			return (
				<tr className={'company_budgets__row--' + company.name.toLowerCase()} key={company.name}>
					<td className="company_budgets__col--company">{company.name} </td>
					<td className="company_budgets__col--graph">
						<span className="company_budgets__budget_line"
							style={{ width: ( company.budget / highestBudget * 100 ) + '%' }}>{'\u00A0'}</span>
					</td>
					<td className="company_budgets__col--budget_number">
						<span className="company_budgets__number">{ company.budgetString }</span>
						<span className="company_budgets__inline-citation">{citation}</span>
					</td>
					<td className="company_budgets__col--citation">{citation}</td>
				</tr>
			);
		}
		) }
	</table>;
}

CompanyBudgets.propTypes = {
	/**
	 * Company data with name, budget, and budgetCitation URL link
	 */
	companies: PropTypes.arrayOf( PropTypes.object ),
	/**
	 * Label for the budget citation link
	 */
	citationLabel: PropTypes.string
};
