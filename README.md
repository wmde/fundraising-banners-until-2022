# Fundraising banners, webpack edition

[![Build Status](https://travis-ci.org/wmde/fundraising-banners.svg?branch=master)](https://travis-ci.org/wmde/fundraising-banners)

This project is bundling all assets and dependencies of WMDE fundraising banners with webpack.

## Installing dependencies

To install all dependencies run

    docker-compose run js-build npm install

## Starting the preview

The banners can be previewed using a built-in server.

    docker-compose up js-serve

The preview server is at [http://localhost:8084/](http://localhost:8084/)

It will display a selection of banners to preview in their respective channel (German Wikimedia / mobile German Wikipedia / wikipedia.de).

Changes to the code base while the preview is running should be reflected via hot reload.

## Check the sources

To verify the code is correct and up to our coding standards. These tests will also be run, and have to pass, in CI.

    docker-compose run js-build npm run test
    docker-compose run js-build npm run lint:js
    docker-compose run js-build npm run lint:css

## Building the assets

To build a minified version of the banner in order to use it on CentralNotice run

    docker-compose run js-build npm run build

## Using the compiled JavaScript on CentralNotice

After the assets are compiled, the `dist` directory contains `.wikitext` files that can be inserted 1:1 in CentralNotice.

## Campaigns, Banner assets and structure
The file `campaign_info.toml` contains the metadata for all banners and campaigns. It'll be used to determine the unique file names of the output and the input files, the so-called *[entry points](https://webpack.js.org/configuration/entry-context/)*. Entry points are the local files (configured with the setting `filename`) which will be compiled by [Webpack](https://webpack.js.org) to pure JavaScript code and JavaScript code wrapped in wikitext that can be copied to CentralNotice. The CentralNotice banner names (which can also be used for the `devbanner` parameter in the preview) come from the `pagename` setting.

Each entry point includes JavaScript libraries, CSS and HTML templates through `require` statements in the entry point files. Webpack is [configured](webpack.common.js) to handle file types according to their extension: HTML templates are preprocessed as JavaScript templating functions, CSS is preprocessed and will be inserted as an inline `<style>` tag, etc. Most assets are shared between the banners.

The `campaign_tracking` and `tracking` parameters in `campaign_info.toml` are used to create the tracking information inside the banner code. The tracking information is passed to the form fields and event tracking pixels inside the banner.

## Creating new campaigns
1. Duplicate an existing folder with banner entry points, e.g. `desktop`.
2. Create a new campaign and its banner configuration in `campaign_info.toml`.

### Creating A/B tests
The changes to the code depend on which kind of test you are running.

* If you test **different behavior**, change `banner_var.js` as needed. Override library functions with our own versions if need be.
* If you test **style changes**, include a file named `css/styles_var.pcss` in your `banner_var.js`. That file should only contain the overriding changes.
* If you test **text or markup changes**, duplicate the necessary templates in the `templates` directory.
* If you test a **whole new banner design**, all of the above changes might apply.

**Attention:** Before creating a new A/B test, clean up the previous one by incorporating the changes into the code! Do not layer tests upon each other!

## How the preview feature works
* Initially, the file `webpack/loader.js` will use the banner configuration to present links to a preview page for each banner.  
* `webpack-dev-server` has the ability to act as a proxy for certain URL paths, meaning that it will fetch the content for that
  path from a configured URL in the background and serve it transparently from the local host. The server is configured to relay the paths `/w`, `/wiki` and `/static` to the German Wikipedia at https://de.wikipedia.org.
* there exist two meta banners that read the `devbanner` parameter from the URL and insert it in a script tag with the same hostname as the webpack server (e.g. `localhost` or `10.0.2.2`).
  * [B17WMDE_webpack_prototype](https://meta.wikimedia.org/wiki/Special:CentralNoticeBanners/edit/B17WMDE_webpack_prototype) on CentralNotice
  * [B17WMDE_webpack_prototype](https://wiki.wikimedia.de/w/index.php?title=Web:Banner/B17WMDE_webpack_prototype) on GS-WIKI

## Planned Features of the dev environment
- [ ] Configure webpack to add source maps (esp for JavaScript) to dev preview.
- [ ] Use `MediaWikiTextWrapper` only in webpack production configuration and don't output the compiled `*.js` files.
- [ ] Create upload plugin for webpack uses the campaign information from `campaign_info.toml` to upload the generated `.wikitext` file to the appropriate page on meta.wikimedia.org / GS-Wiki.

## Notes on possible Banner code improvements
* Refactor old CSS to remove ID selectors and ensure that no new CSS uses ID selectors by setting "selector-max-id" in .stylelintrc.json to 0. The current legacy CSS often makes use of two-chained ID selectors (like `#elementOne #elementTwo { color: blah; }`) which is unnecessary and is something we should get rid of in the future.
* Rename `CampaignDays` to `DateRange`, since we're using it for more than the range of the campaign, but also for the campaign projection with a different start date. Use the proper method names in the Campaign projection.
* Change banner JS code to improve reusability of markup, for A/B testing text changes: Load the `banner_text.hbs` template and render it as an unescaped variable into the markup in `banner_html.hbs`.
* Move translatable strings from `banner_functions.js` and `campaign_day_sentence.js` into a central `messages.js` file and add a `Translations` object that can receive keys (and placeholder values) and returns translated strings.
* Move `addSpace`, `addSpaceInstantly` and `displayBanner` to module `banner_display`. Move all the different ways of showing banners (overlay or scrollable, instant on, rollo and mini nag banner) into the new module. Add the 7.5 seconds delay for `displayBanner` as default but make delay configurable (for preview).
* Move form initialization and validation code to module `form_validation`. Form elements (jQuery objects) should be passed in as constructor params. Also move validation functions from `banner_functions.js` into the new module.
* Implement `impCount` and `bImpCount` as template placeholders instead of setting them with jQuery (they don't change with user interaction). Move the whole impression counting thing (reading and writing the cookie) to its own JavaScript module.
* Refactor `banner_functions.js` to no longer require parameters after `require`. Use classes with constructor parameters instead.
* Move calculations in from `progress_bar.s` to `campaign_projection.js`: Add the `goalDonationSum` parameter to `CampaignProjection` class and add `remainingDonations` and `percentReached` methods to `CampaignProjection`.
* Structure banner initialization into functions, call them one after each other.
* Select Banner DOM object only once and use its `find` method with all other jQuery selections.
* Improve A/B testability by moving to the feature toggle/feature factory model we have in FundraisingFrontend. Get rid of `banner_ctrl.js` and `banner_var.js`. This will improve code sharing.
* Re-Implement/Refactor lightbox module without the need for a global jQuery object and get rid of `ProvidePlugin` in webpack config. Also, for "sticky" Banners, the lightbox should position itself in relation to the banner and the scroll position, so we don't need to scroll to the top of the page to show the lightbox.
