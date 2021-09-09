<template>
    <BannerPresenter>
        <div class="banner-position banner-position--state-finished">
            <div class="banner__wrapper">
                <div class="banner__content">
                    <div class="banner__infobox">
                        <div class="banner__slideshow">
                            Slideshow
                        </div>
                    </div>
                    <div class="banner__form">
                        Form
                    </div>
                </div>
                <div class="close">
                    <a class="close__link">&#x2715;</a>
                </div>
            </div>
        </div>
    </BannerPresenter>
</template>

<script>

import BannerPresenter from "../shared/vue_components/BannerPresenter";

export default {
    name: "Banner",
	components: {
			BannerPresenter
	}
}
</script>
