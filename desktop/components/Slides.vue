<template>
	<div>
		<Slide>
			<div class="sad-puppy" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Mr_Newman_-_the_world%27s_saddest_dog_%28cropped%29.jpg/1024px-Mr_Newman_-_the_world%27s_saddest_dog_%28cropped%29.jpg')"></div>
		</Slide>
		<Slide>
			<div class="sad-puppy" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Puppyfrom_Algeria.jpg/576px-Puppyfrom_Algeria.jpg')"></div>
		</Slide>
		<Slide>
			<div class="sad-puppy" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Gibon_jos_jedan-MONO_blur_headshot.jpg/640px-Gibon_jos_jedan-MONO_blur_headshot.jpg')"></div>
		</Slide>
		<Slide>
			<div class="sad-puppy" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Sad_Lama_%282927388048%29.jpg/640px-Sad_Lama_%282927388048%29.jpg')"></div>
		</Slide>
		<Slide>
			<div class="sad-puppy" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/60_Jahre_Allgemeine_Erkl%C3%A4rung_der_Menschenrechte_%283084670759%29.jpg/640px-60_Jahre_Allgemeine_Erkl%C3%A4rung_der_Menschenrechte_%283084670759%29.jpg')"></div>
		</Slide>
	</div>
</template>

<script>

import Slide from '../../shared/vue_components/Slide';

export default {
	name: "Slides",
	components: {
		Slide
	},
}
</script>

<style lang="css">
	.keen-slider__slide-content {
		position: relative;
		min-height: 800px;
		width: 100%;
		background-size: cover;
	}
	.sad-puppy {
		position: absolute;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
	}
</style>
