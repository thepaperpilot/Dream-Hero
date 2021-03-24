<template>
<div v-bind:style="{ '--height': $store.windowHeight + 'px' }">
	<transition name="victory" v-if="$store.cycle >= 5 && !$store.keepPlaying">
		<div  class="victory">
			<h1>You Win!</h1>
			<h2>Congratulations, you beat the game in:<br/>{{ formatTime($store.timePlayed) }}</h2>
			<h3>You can keep going if you'd like, but things might get weird</h3>
			<button v-on:click="keepGoing">Keep Going</button>
		</div>
	</transition>
	<div id="app" v-else-if="$store.started">
		<Header />
		<Town />
		<Dream ref="dream" />
	</div>
	<transition name="welcome" v-else>
		<div  class="welcome" v-on:click="start">
			<img src="assets/logo.png" alt="Dream Hero" />
		</div>
	</transition>
</div>
</template>

<script>
import Header from './components/Header.vue'
import Town from './components/Town.vue'
import Dream from './components/Dream.vue'

export default {
	name: 'App',
	components: {
		Header,
		Town,
		Dream
	},
	methods: {
		start() {
			this.$store.started = true;
		},
		keepGoing() {
			this.$store.keepPlaying = true;
		}
	}
}
</script>

<style>
:root {
	--fg-color: #292831;
	--bg-color: #ee8695;
	--hi-color: #333f58;
	--raised-color: #fbbbad;
	--other-color: #4a7a96;
}

* {
	transition-duration: 0.5s;
	font-family: "Roboto Mono", monospace;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	-webkit-text-size-adjust: none;
	text-size-adjust: none;
}

html {
	min-width: 640px;
	width: 100%;
	height: 100%;
}

body {
	color: var(--fg-color);
	background-color: var(--bg-color);
	width: 100%;
	height: 100%;
	margin: 0;
}

#app {
	width: 100%;
	height: 100%;
	display: flex;
	flex-flow: column;
}

button {
	outline: none;
	border: solid 2px var(--fg-color);
	background: var(--bg-color);
}

#app .ps__thumb-y {
	background-color: var(--fg-color);
}

#app .ps .ps__rail-x:hover,
#app .ps .ps__rail-y:hover,
#app .ps .ps__rail-x:focus,
#app .ps .ps__rail-y:focus,
#app .ps .ps__rail-x.ps--clicking,
#app .ps .ps__rail-y.ps--clicking {
	background-color: var(--other-color);
}

img, [background-image] {
	image-rendering: crisp-edges;
}

.victory-enter {
    opacity: 0;
    filter: blur(100px);
}

.victory-leave-active {
    opacity: 0;
    filter: blur(100px);
}

.victory {
	position: fixed;
	width: 100%;
	height: 100%;
    box-sizing: border-box;
	background: var(--fg-color);
	color: var(--bg-color);
	text-align: center;
	padding: 20px;
	transition-duration: 2s;
	z-index: 100;
}

.victory button {
	font-size: large;
	font-weight: 900;
}

.welcome-leave-active {
    opacity: 0;
    filter: blur(100px);
}

.welcome {
	transition-duration: 2s;
    background: var(--fg-color);
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 100;
}

.welcome img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: blur 5s infinite;
}

.dream img {
    filter: drop-shadow(4px 4px 4px var(--fg-color));
}

@keyframes blur {
	from {
		filter: blur(0px);
	}

    33% {
        filter: blur(4px);
    }

    66%, to {
        filter: blur(0px);
    }
}
</style>
