# TODOs

- [ ] Lightbox for Application of Funds (on Desktop)
- [ ] Adjust mobile slides accoring to the criteria for CTRL in https://phabricator.wikimedia.org/T235728
- [ ] ESLint settings for JSX files.  

## For Usage on wp.org:
- [ ] Make CSS localized by prepending all CSS with ID, or using 
    [CSS modules](https://github.com/css-modules/css-modules),
    see [this article](https://medium.com/trabe/using-bem-conventions-in-css-modules-leveraging-custom-webpack-loaders-fd985f72bcb2)
    to learn how to combine BEM notation and CSS modules  
- [ ] Mediawiki-Skin dependent banner space reservation (see `shared/skin` classes)
- [ ] initial delay and scroll-in. For that, maybe the `bannerVisible` property needs to be split in two: One for actual visibility and one for when the banner is "ready" (i.e. completely scrolled down). This will become important for when animations should start when the banner is fully in view (e.g. progress bar)
- [ ] Progress bar. (starting only when `bannerVisible` property switches from false to true)
 