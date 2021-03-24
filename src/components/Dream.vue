<template>
<scroll class="dream" ref="scroll">
    <Floor v-for="(tile, index) in $store.path" :key="index" :index="index" />
    <div v-if="$store.upgrades.Cot >= 1" class="endAtLoop" v-on:click="toggleEndAtLoop">
        <h2 v-if="$store.endAtLoop">Waking up at end of this sleep cycle</h2>
        <h2 v-else>Entering deeper sleep at end of this sleep cycle</h2>
        <span>Click to toggle</span>
    </div>
    <Modal :show="$store.endingDream" @close="$actions.endDream">
        <h3 slot="header">Time to wake up</h3>
        <div slot="body">
            <span v-if="$store.endingDreamStatus === 'death'">
                Unfortunately, your dream has met an untimely end. You will only receive a portion of your coins:<br/>+{{ formatWhole($store.tempPoints.pow(0.8)) }}
            </span>
            <span v-else-if="$store.endingDreamStatus === 'floor'">
                You wake up early, avoiding potential death at the cost of some of your potential coins:<br/>+{{ formatWhole($store.tempPoints.pow(0.9)) }}
            </span>
            <span v-else>
                You wake up feeling refreshed, with a heavier wallet:<br/>+{{ formatWhole($store.tempPoints) }}
            </span>
        </div>
        <div slot="footer">
            <button v-on:click="$actions.endDream">Wake Up</button>
        </div>
    </Modal>
</scroll>
</template>

<script>
import Floor from './Floor.vue'
import Modal from './Modal.vue'

export default {
    name: 'Dream',
    components: {
        Floor,
        Modal
    },
    methods: {
        toggleEndAtLoop() {
            this.$store.endAtLoop = !this.$store.endAtLoop
        }
    }
}
</script>

<style scoped>
.dream {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg-color);
    padding: 20px;
}

.endAtLoop {
    width: 600px;
    max-width: 90vw;
    margin: 10px auto;
    background: var(--raised-color);
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 10px;
    text-align: center;
    box-sizing: border-box;
}

.endAtLoop > * {
    margin: 0;
    user-select: none;
}
</style>
