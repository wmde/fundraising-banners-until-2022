# Fundraising banners, webpack edition

This is bundling all dependencies of WMDE fundraising banners with webpack.

## Installing dependencies
To install all dependencies run:

    docker-compose run js-build npm install

## Building the assets
To build a minified version of the banner:

    docker-compose run js-build npm run build

## Starting the preview

    docker-compose up js-serve

To view the banner inside the proxied German Wikimedia go to [http://localhost:8080/wiki/Wikipedia:Hauptseite?banner=B17WMDE_webpack_prototype](http://localhost:8080/wiki/Wikipedia:Hauptseite?banner=B17WMDE_webpack_prototype).

By default, the banner `banner_ctrl` will be loaded. To load a different banner, e.g. `banner_var`, add the parameter `&devbanner=banner_var` to the URL.

## Using the compiled JavaScript on CentralNotice

After the assets are compiled, the `dist` directory contains `.wikitext` files that can be inserted 1:1 in CentralNotice or uploaded via the [upload tool](https://github.com/wmde/banner-toolkit).

## Banner assets and structure
The files `banner_ctrl.js` and `banner_var.js` are the so-called *[entry points](https://webpack.js.org/configuration/entry-context/)*, the files which will be compiled by [Webpack](https://webpack.js.org) to pure JavaScript code and JavaScript code wrapped in wikitext that can be copied to CentralNotice.
Each entry points includes JavaScript libraries, CSS and HTML templates through `require` statements, which Webpack will then handle according to file type. Most assets are shared between the banners.  

### Creating A/B tests
The changes to the code depend on which kind of test you are running.

* If you test **different behavior**, change `banner_var.js` as needed. Override library functions with our own versions if need be.
* If you test **style changes**, include a file named `css/styles_var.pcss` in your `banner_var.js`. That file should only contain the overriding changes.
* If you test **text or markup changes**, duplicate the necessary templates in the `templates` directory.
* If you test a **whole new banner design**, all of the above changes might apply.

**Attention:** Before creating a new A/B test, clean up the previous one by incorporating the changes into the code! Do not layer tests upon each other!

## How the preview feature works
* `webpack-dev-server` has the ability to act as a proxy for certain URL paths, meaning that it will fetch the content for that 
  path from a configured URL in the background and serve it transparently from the local host. The server is configured to relay the paths `/w`, `/wiki` and `/static` to the German Wikipedia at https://de.wikipedia.org
* `B17WMDE_webpack_prototype` is a special banner on CentralNotice that reads the `devbanner` parameter from the URL and inserts it in a script tag with the same hostname as the webpack server (e.g. `localhost` or `10.0.2.2`).   


## Planned Features
- [x] Bundle HTML and JavaScript as one includable bundle
- [x] Bundle CSS
- [x] Bundle multiple entry points/HTML files for multiple banners
- [x] Use template engine to render HTML
- [x] Use webpack web server for previews
- [x] Use [HOT module replacement](https://webpack.js.org/guides/hot-module-replacement/) for automatic refresh in browser.
- [x] Add production config for webpack
- [x] Test how webpack handles JavaScript that calls jQuery without requiring it.
- [x] Add Dockerfile with installed npm >= 5.x, check in npm lock file (5.3 it is)
- [X] Preview with real Wikipedia DE markup and HTML on preview page.
- [ ] Make webpack configuration work with multiple banner destinations (DEWP, mobile, English, WP.DE, etc). Allow for as much code sharing as possible.
- [ ] Create upload plugin for webpack that can figure out the correct naming of the banner from the banner data and sends the wikitext to the appropriate page on meta.wikimedia.org / GS-Wiki.
- [ ] Add source maps to dev preview

## Random ideas
* Configure Campaign number, campaign prefix and campaign start date to generate file names and tracking info inside banners.

## Notes on possible Banner code improvements
* Move `addSpace`, `addSpaceInstantly` and `displayBanner` to module `banner_display`. Move all the different ways of showing banners (overlay or scrollable, instant on, rollo and mini nag banner) into the new module. Remove similar functions from `banner_functions.js`. Add the 7.5 seconds delay for `displayBanner` as default but make delay configurable (for preview).
* Move form initialization and validation code to module `form_validation`. Form elements (jQuery objects) should be passed in as constructor params. Also move validation functions from `banner_functions.js` into the new module.
* Move date/time-based campaign data counting (donors, donations, campaign day, special day name, normal day name, prefix for day name) from `banner_functions.js`, `custom_day_name.js` and `count_campaign_days.js` into module.
* Refactor `banner_functions.js` and `count_campaign_days` to longer require parameters after `require`. Use classes with constructor parameters instead.
* Structure banner initialization into functions, call them one after each other. Select Banner object only once and use its `find` method with all other jQuery selections.
* Re-Implement/Refactor lightbox module without the need for global jQuery object and get rid of `ProvidePlugin` in webpack config. Also, for "sticky" Banners, the lightbox should position itself in relation to the banner and the scroll position, so we don't need to scroll to the top of the page to show the lightbox.
