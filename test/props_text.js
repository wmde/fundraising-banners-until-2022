import { configure, shallow , mount} from 'enzyme';
import assert from 'assert';
import Adapter from 'enzyme-adapter-preact-pure';
// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

import Footer from '../shared/components/ui/Footer';
import Infobox from '../shared/components/ui/Infobox';
import BannerText from '../english_preact/components/BannerText';

// muss man mit jsdom erst einen dom erzeugen?

configure( { adapter: new Adapter() } );

describe( 'DonationForm', () => {
	it( 'should have property blabla', () => {
		// eslint-disable-next-line no-unused-vars
		// const wrapper = mount( <DonationForm bannerName={'TestBannerName'} campaignName={'TestCampaignName'}/> );
		// ... zB wrapper.find('button').simulate('click);
		// expect(wrapper.find('.icon-star')).to.have.lengthOf(1);

		/*
			const onClick = wrapper.find('button').props().onClick;

			act(() => {
			  // Invoke the button's click handler, but this time directly, instead of
			  // via an Enzyme API
			  onClick();
			});
			// Refresh Enzyme's view of the output
			wrapper.update();

			expect(wrapper.text()).to.include('Current value: 6');
		 */

		// was könnte man alles testen?:
		/*
			- testen ob sich bei click auf button das feld einfärbt
			- testen ob errormessages erscheinen bei button click und bestimmten states
			- testen ob felder disabled werden
			- testen ob all die werte, die als props übergeben wurden, auch wirklich irgendwo im banner sind
			-- alle Zahlen sind jeweils korrekt localized und formatiert
		 */
	} );

	it( 'allows us to set props in Footer', () => {
		const showFundsModalHandler = () => {

		}
		const wrapper = shallow( <Footer showFundsModal={ showFundsModalHandler } /> );
		assert.equal( wrapper.find( '.application-of-funds-link' ).props().onClick, showFundsModalHandler );

		assert.equal( typeof wrapper.find( '.application-of-funds-link' ).props().onClick, 'function' );

		/* expect( wrapper.props().bar ).to.equal( 'baz' );
		wrapper.setProps( { bar: 'foo' } );
		expect( wrapper.props().bar ).to.equal( 'foo' );*/
	} );

	it( 'allows us to set props in Infobox', () => {

		//in bannertext suchen dann? aber bannertext ist bannerspezifisch. oder... find(bannerlement)...

		function testElem( props ) {
			return <div>
				<span className="campaignParameters"> { JSON.stringify(props.campaignParameters.startDate) }</span>

				<span className="numberOfDonors"> {props.numberOfDonors}</span>

				<span className="campaignDaySentence"> {props.campaignDaySentence}</span>

				<span className="weekdayPrepPhrase"> {props.weekdayPrepPhrase}</span>

				<span className="currentDayName"> {props.currentDayName}</span>
			</div>;
		}

		const wrapper = mount( <Infobox campaignParameters={ { startDate: '2019-01-02', endDate: '2019-01-04' } }
			campaignProjection={ { getProjectedNumberOfDonors: () =>5 } }
			formatters={ { integerFormatter: v => v } }
			bannerText={ ( testElem )}
			currentDate={ new Date( '2019-01-03' ) }
		/> );

		assert.equal( wrapper.find( '.campaignParameters' ).text(), 5 );

		assert.equal( wrapper.find( '.numberOfDonors' ).text(), 5 );

		// " Es bleiben nur noch 2 Tage, um Wikipedia in diesem Jahr zu unterstützen."
		assert.ok( wrapper.find( '.campaignDaySentence' ).text() );

		// " an diesem"
		assert.ok( wrapper.find( '.weekdayPrepPhrase' ).text() );
		assert.ok( wrapper.find( '.currentDayName' ).text() );


	} );

} );
