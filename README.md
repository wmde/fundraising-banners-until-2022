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
- [ ] Create upload plugin for webpack uses the campaign information from `campaign_info.toml` to upload the generated `.wikitext` file to the appropriate page on meta.wikimedia.org / GS-Wiki.

## Notes on possible Banner code improvements
none ♥