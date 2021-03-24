<template>
<div v-bind:class="{ tile: true, blur: $store.position < index, active: $store.position === index }">
    <span class="indicator">
        <img v-if="$store.position === index" class="indicator-hero" src="assets/hero.png" alt="hero" />
        <div v-else class="indicator-index">{{ index + 1 }}</div>
    </span>
    <span class="actions-container"
        v-bind:style="{
            backgroundImage: 'url(assets/' + $store.path[index].type + '.png)',
            width: $store.upgrades.Cot >= 2 && $store.position === index ? '70%' : '85%'
        }">
        <ActionPreview v-for="(action, index) in $store.path[index].actions"
            :key="index" :action="action" :index="index" />
    </span>
    <span v-bind:style="{ width: $store.upgrades.Cot >= 2 && $store.position === index ? '15%' : '0%' }"
        class="endAtFloor" v-on:pointerdown="toggleEndAtFloor">
        Wake up early:<br/><b>{{ $store.endAtFloor ? "On" : "Off" }}</b>
    </span>
    <Action :tile="$store.path[index]" />
    <div class="actionProgress">
        <div class="actionProgress-fill"
            v-bind:style="{ width: 100 * $store.actionProgress / getActionDuration() + '%' }"></div>
    </div>
</div>
</template>

<script>
import Action from './Action.vue'
import ActionPreview from './ActionPreview.vue'

export default {
    name: 'Floor',
    props: {
        index: Number
    },
    components: {
        Action,
        ActionPreview
    },
    methods: {
        toggleEndAtFloor() {
            this.$store.endAtFloor = !this.$store.endAtFloor
        }
    }
}
</script>

<style scoped>
.tile {
    width: 600px;
    margin: 10px auto;
    background: var(--raised-color);
}

.tile.blur {
    filter: blur(2px);
}

.tile.active {
    margin-bottom: 30px;
}

.indicator {
    width: 15%;
    height: 100px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--other-color);
}

.indicator-hero {
    width: 64px;
    height: 64px;
}

.indicator-index {
    font-size: xx-large;
    font-weight: 900;
}

.actions-container {
    width: 85%;
    display: inline-flex;
    height: 100px;
    vertical-align: bottom;
    padding: 9px 16px;
    box-sizing: border-box;
    background-size: cover;
    background-position: bottom;
}

.actionProgress {
    height: 0;
    position: relative;
    overflow: hidden;
}

.tile.active .actionProgress {
    height: 20px;
}

.actionProgress-fill {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background: var(--other-color);
    transition-duration: 0s;
}

.endAtFloor {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    width: 15%;
    height: 100px;
    text-align: center;
    vertical-align: bottom;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
}
</style>
