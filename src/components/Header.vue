<template>
<div class="header">
    <h2>Dream Hero</h2>
    <h2>{{ formatWhole($store.points) }}</h2>
    <h2 v-if="$store.dreaming" style="color: var(--hi-color);">+{{ formatWhole($store.tempPoints) }}</h2>
    <h2 v-if="$store.dreaming" style="color: var(--hi-color);">Cycle {{ $store.cycle + 1 }}</h2>
    <a href="https://discord.gg/WzejVAx" target="_blank"><img src="assets/discord.png" /></a>
</div>
</template>

<script>
    export default {
      name: 'Header'
  }
</script>

<style scoped>
.header {
    background: var(--raised-color);
    padding: 8px;
    border-bottom: solid 2px var(--fg-color);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}

h2 {
    margin: 0;
    padding-right: 8px;
    margin-right: 8px;
    display: inline;
}

h2:not(:last-of-type) {
    border-right: solid 2px var(--fg-color);
}

img {
    height: 32px;
    float: right;
}
</style>
