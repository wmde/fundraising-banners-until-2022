# Campaign parameters

## Description
Some dynamic texts in the banners (e.g. the campaign day sentence) and the
progress bar need starting parameters to calculate a "current value" (e.g.
number of donations, number of donors, how many days from the start of the
campaign, how many days until the end of the campaign). We store these starting
parameters separately form the banner code, to update *all* banners
when one value changes.

### Campaign projection
![Projection Chart](Campaign%20Projection.png)

For the current values of the progress bar we use a feature called
"campaign projection" - given the current sum of donations and donors on a
given date and time and given the amount of donations and number of donors
per minute, we can calculate the current value. Note that the given date
and time are *not* the campaign start but the time where these values were
last measured. The Fundraising department measures them daily and passes
the updated values to the developers.

## Delivery mechanism and value Resolution

### Wikipedia.org
For banners on wikipedia.org, the values stored in data attributes in an
empty div that's automatically included in the banner code with the
templating meachanism (double curly braces) of Mediawiki. The file
`webpack/wikitext_templates/wikipedia_org.hbs` contains the include
statement for the template. Webpack uses this template to wrap the
compiled banner Javascript, so every compiled banner contains the
inclusion of the banner parameters.

The "[development
bannner](https://meta.wikimedia.org/wiki/Special:CentralNoticeBanners/edit/B17WMDE_webpack_prototype)"
that uses CentralNotice to load a banner from the local development
environment does not contain the campaign parameter template. During
development, the banners use the values in
`shared/global_banner_settings.js`.

### Wikipedia.de
On wikipedia.de the parameters are part of the [wikipedia.de banner
repository](https://github.com/wmde/wikipedia.de-banners) and the web page
includes the JavaScript file with the parameters on every request,
creating the global variable `GlobalBannerSettings`.

To use the development values, you need to temporarily change the import
from `shared/campaign_parameters` to also include `DevCampaignParameters`
and change the call to `createCampaignParameters()` to `createCampaignParameters(new
[DevCampaignParameters()])`. The `.travis.yml` file checks for calls to
`createCampaignParameters` with arguments and throws an error when one of
your committed files calls `createCampaignParameters` with an argument.
