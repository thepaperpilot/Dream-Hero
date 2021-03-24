<template>
<div class="action" v-bind:style="{ backgroundImage: 'url(assets/' + tile.type + '.png)' }">
    <img class="shake left" src="assets/hero.png" alt="hero" />
    <div class="health left">
        <span v-bind:style="{ color: $store.hp.gt(getMaxHealth()) ? 'var(--raised-color)' : ''}">{{ formatWhole($store.hp) }}</span>
        <div class="health-fill"
            v-bind:style="{ width: 100 * $store.hp / getMaxHealth() + '%' }"></div>
    </div>
    <div class="shake right">
        <img v-if="tile.actions[$store.currentAction].type === 'gold'"
            v-bind:src="'assets/' + (tile.actions[$store.currentAction].image || 'gold') + '.png'"
            v-bind:alt="tile.actions[$store.currentAction].image || 'gold'" />
        <img v-else-if="tile.actions[$store.currentAction].type === 'enemy'"
            v-bind:src="'assets/' + tile.actions[$store.currentAction].enemy + '.png'"
            v-bind:alt="tile.actions[$store.currentAction].enemy"/>
        <img v-else-if="tile.actions[$store.currentAction].type === 'potion'"
            src="assets/potion.png" alt="potion"/>
        <img v-else-if="tile.actions[$store.currentAction].type === 'gear'"
            src="assets/shield.png" alt="shield"/>
    </div>
    <span v-if="tile.actions[$store.currentAction].type === 'gold'" class="amount right">
        {{ formatWhole(tile.actions[$store.currentAction].amount) }}
    </span>
    <div class="health right" v-if="tile.actions[$store.currentAction].type === 'enemy'">
        <span>{{ formatWhole(tile.actions[$store.currentAction].hp) }}</span>
        <div class="health-fill"
            v-bind:style="{ width: 100 * tile.actions[$store.currentAction].hp / tile.actions[$store.currentAction].maxHp + '%' }"></div>
    </div>
</div>
</template>

<script>
export default {
    name: 'Action',
    props: {
        tile: Object
    }
}
</script>

<style scoped>
.action {
    border-top: solid var(--bg-color) 0;
    height: 0;
    box-sizing: border-box;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
}

.tile.active .action {
    height: 200px;
    border-top-width: 10px;
}

.action img {
    width: 128px;
    height: 128px;
}

.left {
    position: absolute;
    left: 30%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition-duration: 0s;
    display: inline-block;
}

.right {
    position: absolute;
    left: 70%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition-duration: 0s;
    display: inline-block;
}

.tile:not(.active) .left,
.tile:not(.active) .right {
    display: none;
}

.shake {
    animation: shake 1.5s infinite;
}

.health {
    width: 150px;
    height: 16px;
    background: var(--bg-color);
    border: solid 2px var(--fg-color);
    position: absolute;
    top: 90%;
    text-align: center;
    overflow: hidden;
}

.health span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 900;
    font-size: small;
    z-index: 1;
}

.health-fill {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background: var(--other-color);
    transition-duration: 0s;
}

.right.amount {
    position: absolute;
    left: unset;
    transform: unset;
    right: calc(30% - 60px);
    top: calc(50% - 60px);
    font-size: x-large;
    font-weight: 900;
    color: var(--other-color);
    background: var(--fg-color);
    padding: 4px;
    border-radius: 4px;
    opacity: 0.9;
}

@keyframes shake {
    from, 45% {
        transform: translate(-50%, -50%) rotateZ(-15deg);
    }

    55%, 90% {
        transform: translate(-50%, -50%) rotateZ(15deg);
    }

    to {
        transform: translate(-50%, -50%) rotateZ(-15deg);
    }
}
</style>
