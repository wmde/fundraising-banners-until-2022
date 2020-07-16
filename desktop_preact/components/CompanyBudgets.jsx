// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

const companies = [
	{ name: 'Google', budget: 161, budgetCitation: 'https://www.macrotrends.net/stocks/charts/GOOGL/alphabet/revenue' },
	{ name: 'Amazon', budget: 280, budgetCitation: 'https://www.macrotrends.net/stocks/charts/AMZN/amazon/revenue' },
	{ name: 'Facebook', budget: 70, budgetCitation: 'https://www.macrotrends.net/stocks/charts/FB/facebook/revenue' },
	{ name: 'Wikipedia', budget: 0.12, budgetCitation: '' }
];

export default function CompanyBudgets() {
	const highestBudget = companies.reduce( ( highestBudget, company ) => Math.max( highestBudget, company.budget ), 0 );
	return <table className="company_budgets">
		{companies.map( company => (
			<tr className={ 'company_budgets__row--' + company.name.toLowerCase() } key={company.name}>
				<td className="company_budgets__col--company">{ company.name }</td>
				<td className="company_budgets__col--graph">
					<span className="company_budgets__budget_line" style={{ width: ( company.budget / highestBudget * 100 ) + '%' }}>{'\u00A0' }</span>
				</td>
				<td className="company_budgets__col--budget_number">{ String( company.budget ).replace( '.', ',' ) }</td>
				<td className="company_budgets__col--unit">Mrd. €</td>
				<td className="company_budgets__col--citation">
					{ company.budgetCitation ? ( <a href={company.budgetCitation} target="_blank">Quelle</a> ) : '\u00A0' }
				</td>
			</tr>
		) )}
	</table>;
}
