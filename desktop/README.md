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

The web server is at http://localhost:8080/

By default, the banner `banner_ctrl` will be loaded. To load a different banner, e.g. `banner_var`, add the parameter `?banner=banner_var` to the URL.

## Using the compiled JavaScript on CentralNotice

Until there is an upload tool, you need to copy and paste the compiled banner code form the `dist` directory into the CentralNotice text field. Wrap it as follows:

    <div id="WMDE-Banner-Container">
    <script>{{MediaWiki:WMDE_FR2017/Resources/BannerValues.js}}</script>
    <nowiki><script>
    // banner code here
    </script></nowiki>
    </div>

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
- [ ] Preview with real Wikipedia DE markup and HTML on preview page.
- [ ] Create upload plugin that wraps the generated JS (see above) and sends it to CentralNotice
- [ ] development version with source maps

## Random ideas
* Move index.html out of `dist` into `public` folder and use different values for `devServer.contentBase` and `devServer.publicPath` ?
* Configure Campaign number, campaign prefix and campaign start date to generate file names and tracking info inside banners.

## Notes on possible Banner code improvements
* Move `addSpace`, `addSpaceInstantly` and `displayBanner` to module `BannerDisplay`. Move all the different ways of showing banners (overlay or scrollable, instant on, rollo and mini nag banner) into the new module. Remove similar functions from `DesktopBanner.js`. Add the 7.5 seconds delay for `displayBanner` as default but make delay configurable (for preview).
* Move form initialization and validation code to module `FormValidation`. Form elements (jQuery objects) should be passed in as constructor params. Also move validation functions from `DesktopBanner.js` into the new module.
* Move date/time-based campaign data counting (donors, donations, campaign day, special day name, normal day name, prefix for day name) from `DesktopBanner.js`, `custom_day_name.js` and `count_campaign_days.js` into module.
* Refactor `DesktopBanner.js` and `count_campaign_days` to longer require parameters after `require`. Use classes with constructor parameters instead.
* Structure banner initialization into functions, call them one after each other. Select Banner object only once and use its `find` method with all other jQuery selections.
* Re-Implement/Refactor lightbox module without the need for global jQuery object and get rid of `ProvidePlugin` in webpack config. Also, for "sticky" Banners, the lightbox should position itself in relation to the banner and the scroll position, so we don't need to scroll to the top of the page to show the lightbox.
