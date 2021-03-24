<template>
<img v-if="action.type === 'enemy'" v-bind:class="{ actionPreview: true, active: index === $store.currentAction }"
    v-bind:src="'assets/' + action.enemy + '.png'"
    v-bind:alt="action.enemy"/>
<div v-else-if="action.type === 'gold'" class="amount-container">
    <img class="actionPreview"
        v-bind:src="'assets/' + (action.image || 'gold') + '.png'"
        v-bind:alt="action.image || 'gold'"
        v-bind:class="{ actionPreview: true, active: index === $store.currentAction }" />
    <span class="amount">{{ formatWhole(action.amount) }}</span>
</div>
<img v-else-if="action.type === 'potion'" v-bind:class="{ actionPreview: true, active: index === $store.currentAction }"
    src="assets/potion.png" alt="potion"/>
<img v-else-if="action.type === 'gear'" v-bind:class="{ actionPreview: true, active: index === $store.currentAction }"
    src="assets/shield.png" alt="shield"/>
</template>

<script>
export default {
    name: 'ActionPreview',
    props: {
        action: Object,
        index: Number
    }
}
</script>

<style scoped>
.actionPreview {
    margin: 9px;
    width: 64px;
    height: 64px;
}

.tile.active .actionPreview.active {
    transform: scale(1.5);
}

.amount-container {
    position: relative;
}

.amount {
    position: absolute;
    top: 4px;
    right: 4px;
    font-weight: 900;
    color: var(--other-color);
    background: var(--fg-color);
    padding: 4px;
    border-radius: 4px;
    font-size: small;
    opacity: 0.9;
}
</style>
