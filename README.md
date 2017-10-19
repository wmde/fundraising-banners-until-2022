# Fundraising banners, webpack edition

[![Build Status](https://travis-ci.org/wmde/fundraising-banners.svg?branch=master)](https://travis-ci.org/wmde/fundraising-banners)

This project is bundling all assets and dependencies of WMDE fundraising banners with webpack.

## Installing dependencies
To install all dependencies run:

    docker-compose run js-build npm install

## Building the assets
To build a minified version of the banner:

    docker-compose run js-build npm run build

## Starting the preview

    docker-compose up js-serve

The preview server is at [http://localhost:8084/](http://localhost:8084/)

It will display a selection of banners to preview. The preview will be shown inside the proxied German Wikimedia.

To load a different banner than the one you selected, change the `devbanner` parameter in the URL to the new banner name.

## Using the compiled JavaScript on CentralNotice

After the assets are compiled, the `dist` directory contains `.wikitext` files that can be inserted 1:1 in CentralNotice or uploaded via the [upload tool](https://github.com/wmde/banner-toolkit).

## Campaigns, Banner assets and structure
The file `campaign_info.toml` contains the metadata for all banners and campaigns. It'll be used to determine the unique file names of the output and the input files, the so-called *[entry points](https://webpack.js.org/configuration/entry-context/)*. Entry points are the local files (configured with the setting `filename`) which will be compiled by [Webpack](https://webpack.js.org) to pure JavaScript code and JavaScript code wrapped in wikitext that can be copied to CentralNotice. The CentralNotice banner names (which can also be used for the `devbanner` parameter in the preview) come from the `pagename` setting.

Each entry point includes JavaScript libraries, CSS and HTML templates through `require` statements in the entry point files. Webpack is [configured](webpack.common.js) to handle file types according to their extension: HTML templates are preprocessed as JavaScript templating functions, CSS is preprocessed and will be inserted as an inline `<style>` tag, etc. Most assets are shared between the banners.

The `campaign_tracking` and `tracking` parameters in `campaign_info.toml` are used to create the tracking information inside the banner code. The tracking information is passed to the form fields and event tracking pixels inside the banner.

For mobile banners on de.m.wikipedia.org you can use the mobile skin when previewing by adding the following line to your mobile campaign:

	preview_skin = "minerva"

### Naming conventions

Each banner test needs to use unique names for banner pages as well as campaign and banner tracking.  

#### Banner pages

The `pagename` setting in the file `campaign_info.toml` defines the banner's on-wiki page title. Due to MediaWiki restrictions, this needs to be unique. The different parts of the page title need to be separated by underscores.

Prefix | Project | Test ID | Date | banner identifier
---|---|---|---|---
B`yy`WMDE | `dewp` (de.wikipedia.org)<br>`enwp` (en.wikipedia.org)<br>`mob` (de.m.wikipedia.org)<br>`ipad` (de.m.wikipedia.org)<br>`wpde` (www.wikipedia.de) | `nn` | format `yymmdd` | e. g. `ctrl`, `var`

#### Campaign tracking

This defines the actual test and is being used by our website tracking system as well as wmde/fundraising-backend.  The different parts of the page title need to be separated by dashes. 

Prefix | Test ID | Test type | Date of Test Start
---|---|---|---
`dewp` (de.wikipedia.org)<br>`enwp` (en.wikipedia.org)<br>`mob` (de.m.wikipedia.org)<br>`ipad` (de.m.wikipedia.org)<br>`wpde` (www.wikipedia.de) | incrementing `nn` | e. g. `ba` for banner tests<br>`lp` for landing page test | format `yymmdd`

#### Banner tracking

This defines the keyword of a banner in a specific campaign. It is also being used by our website tracking system and wmde/fundraising-backend.  The different parts of the page title need to be separated by dashes.

Prefix | Test ID | Date | Banner Identifier
---|---|---|---
org-mob<br>org-dewp<br>org-ipad<br>org-enwp<br>wpde | nn | yymmdd | e. g. `ctrl`, `var`

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
  path from a configured URL in the background and serve it transparently from the local host. The server is configured to relay the paths `/w`, `/wiki` and `/static` to the German Wikipedia at https://de.wikipedia.org. That means the CentralNotice banner loader will be used for loading the development banner `B17WMDE_webpack_prototype`.
* `B17WMDE_webpack_prototype` is a special banner on CentralNotice that reads the `devbanner` parameter from the URL and inserts it in a script tag with the same hostname as the webpack server (e.g. `localhost` or `10.0.2.2`).   


## Planned Features of the dev environment
- [ ] Configure webpack to add source maps (esp for JavaScript) to dev preview.
- [ ] Use `MediaWikiTextWrapper` only in webpack production configuration and don't output the compiled `*.js` files.
- [ ] Create upload plugin for webpack uses the campaign information from `campaign_info.toml` to upload the generated `.wikitext` file to the appropriate page on meta.wikimedia.org / GS-Wiki.

## Notes on possible Banner code improvements
* Change banner JS code to improve reusability of markup, for A/B testing text changes: Load the `banner_text.hbs` template and render it as an usecaped variable into the markup in `banner_html.hbs`.
* Move `addSpace`, `addSpaceInstantly` and `displayBanner` to module `banner_display`. Move all the different ways of showing banners (overlay or scrollable, instant on, rollo and mini nag banner) into the new module. Add the 7.5 seconds delay for `displayBanner` as default but make delay configurable (for preview).
* Move form initialization and validation code to module `form_validation`. Form elements (jQuery objects) should be passed in as constructor params. Also move validation functions from `banner_functions.js` into the new module.
* Implement `impCount` and `bImpCount` as template placeholders instead of setting them with jQuery (they don't change with user interaction). Move the whole impression counting thing (reading and writing the cookie) to its own JavaScript module.
* Move date/time-based campaign data counting (campaign day, special day name, normal day name, prefix for day name) from `custom_day_name.js` and `count_campaign_days.js` into `campaign_projection.js` module or split date math and modules depending on the date math into their own modules. There is some duplicated code between `count_campaign_days.js` and `campaign_projection.js`. 
* Refactor `banner_functions.js` and `count_campaign_days` to longer require parameters after `require`. Use classes with constructor parameters instead.
* Structure banner initialization into functions, call them one after each other. Select Banner object only once and use its `find` method with all other jQuery selections.
* Re-Implement/Refactor lightbox module without the need for a global jQuery object and get rid of `ProvidePlugin` in webpack config. Also, for "sticky" Banners, the lightbox should position itself in relation to the banner and the scroll position, so we don't need to scroll to the top of the page to show the lightbox.
