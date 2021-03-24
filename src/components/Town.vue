<template>
<transition name="town">
    <div class="town-container" v-if="!this.$store.dreaming">
        <panZoom @init="onInit">
            <div class="town">
                <h1 class="background">World Map</h1>
                <div v-bind:class="{ building: true, highlight: $store.tutorialOne }" style="top: 500px; left: 700px;"
                    v-on:pointerdown="$actions.openBuilding('Cot')">
                    Cot
                </div>
                <div class="building" v-if="!$store.tutorialOne" style="top: 200px; left: 600px;"
                    v-on:pointerdown="$actions.openBuilding('Bank')">
                    Bank
                </div>
                <div class="building" v-if="!$store.tutorialOne" style="top: 800px; left: 200px;"
                    v-on:pointerdown="$actions.openBuilding('Apothecary')">
                    Apothecary
                </div>
                <div class="building" v-if="!$store.tutorialOne" style="top: 750px; left: 800px;"
                    v-on:pointerdown="$actions.openBuilding('Armory')">
                    Armory
                </div>
            </div>
        </panZoom>
        <Modal :show="$store.openBuilding !== ''" @close="$actions.closeBuilding">
            <div slot="header" style="position: relative;">
                <img v-bind:src="'assets/' + buildingInfo.background + '.png'" alt="$store.openBuilding" class="header"/>
                <div class="header-enemies">
                    <img v-for="enemy in buildingInfo.enemies" v-bind:src="'assets/' + enemy + '.png'" v-bind:alt="enemy" v-bind:key="enemy" />
                </div>
                <h3>{{ $store.openBuilding }}</h3>
            </div>
            <div slot="body">
                <div v-if="$store.openBuilding === 'Cot'" style="display: flex; margin-bottom: 8px; border-bottom: solid 2px var(--fg-color); padding-bottom: 8px;">
                    <span style="flex-grow: 1;">I'm feeling tired...</span>
                    <button @click="$actions.startDream()" style="float: right">Dream</button>
                </div>
                <div v-if="!$store.tutorialOne && upgradeInfo" style="display: flex;">
                    <span style="flex-grow: 1;">{{ upgradeInfo.description }}</span>
                    <button @click="upgradeBuilding()" style="float: right; margin-left: 4px;"
                        v-bind:disabled="$store.points.lt(upgradeInfo.cost)">
                        Cost: {{ formatWhole(upgradeInfo.cost) }}
                    </button>
                </div>
                <div v-else>
                    You've fully upgraded this!
                </div>
            </div>
            <div slot="footer" style="margin-bottom: -24px"></div>
        </Modal>
    </div>
</transition>
</template>

<script>
import Modal from './Modal.vue'
import Common from '../common.js'
import Decimal from '../break_eternity.js'

export default {
    name: 'Town',
    components: {
        Modal
    },
    computed: {
        buildingInfo() {
            return this.$store.openBuilding && Common.buildingInfo[this.$store.openBuilding];
        },
        upgradeInfo() {
            if (!this.$store.openBuilding) {
                return null;
            }
            const buildingInfo = Common.buildingInfo[this.$store.openBuilding];
            let upgrade = buildingInfo.upgrades[this.$store.upgrades[this.$store.openBuilding]];
            if (!upgrade && buildingInfo.infinite) {
                upgrade = {
                    description: buildingInfo.infinite.description,
                    cost: Decimal.times(buildingInfo.infinite.base, Decimal.pow(buildingInfo.infinite.r, this.$store.upgrades[this.$store.openBuilding]))
                };
            }
            return upgrade;
        }
    },
    methods: {
        onInit: function(panzoomInstance) {
            panzoomInstance.setTransformOrigin(null);
        },
        upgradeBuilding: function() {
            const buildingInfo = Common.buildingInfo[this.$store.openBuilding];
            let cost;
            if (this.$store.upgrades[this.$store.openBuilding] in buildingInfo.upgrades) {
                cost = buildingInfo.upgrades[this.$store.upgrades[this.$store.openBuilding]].cost;
            } else if (buildingInfo.infinite) {
                cost = Decimal.times(buildingInfo.infinite.base, Decimal.pow(buildingInfo.infinite.r, this.$store.upgrades[this.$store.openBuilding]));
            }
            if (cost.lte(this.$store.points)) {
                this.$store.points = this.$store.points.sub(cost);
                this.$store.upgrades[this.$store.openBuilding]++;
            }
        }
    }
}
</script>

<style scoped>
.town-container {
    flex-grow: 1;
    transition-duration: 2s;
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg-color);
    z-index: 1;
    min-width: 640px;
    height: calc(var(--height) - 50px);
}

.town-enter {
    opacity: 0;
    filter: blur(100px);
}

.town-leave-active {
    opacity: 0;
    filter: blur(100px);
}

.vue-pan-zoom-item {
    overflow: hidden;
    height: 100%
}

.town {
    width: 1000px;
    height: 1000px;
    position: relative;
    transition-duration: 0s;
}

.town:before {
    content: "";
    position: absolute;
    top: 0%;
    bottom: 0%;
    left: 0%;
    right: 0%;
    background: var(--hi-color);
    filter: blur(10px);
}

.background {
    position: absolute;
    top: 500px;
    left: 500px;
    transform: translate(-50%, -50%);
    font-size: 160px;
    font-weight: 900;
    margin: 0;
    text-align: center;
    color: var(--other-color);
    cursor: default;
}

.building {
    position: absolute;
    height: 50px;
    color: var(--other-color);
    font-size: xx-large;
    transform: translate(-50%, -50%);
    font-weight: 900;
    cursor: pointer;
    border-radius: 50%;
    padding: 8px;
    background: var(--fg-color);
}

.building.highlight {
    box-shadow: var(--bg-color) 0 0 8px 4px;
}

.header {
    margin: -30px;
    margin-bottom: 0;
    width: calc(100% + 60px);
}

.header-enemies {
    display: flex;
    position: absolute;
    top: -30px;
    height: 120px;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.header-enemies img {
    width: 96px;
    height: 96px;
    filter: drop-shadow(4px 4px 4px var(--fg-color));
}
</style>
