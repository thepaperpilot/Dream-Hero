import Vue from 'vue';
import App from './App.vue';
import panZoom from 'vue-panzoom';
import PerfectScrollbar from 'vue2-perfect-scrollbar';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';
import Decimal from './break_eternity.js'
import {  } from './common.js'
import { format, formatWhole, formatTime } from './numberFormatting.js'

const storageKey = "thepaperpilot-dream";

// Load data from localStorage
const startData = {
	timePlayed: 0,
	keepPlaying: false,
	points: new Decimal(0),
	tempPoints: new Decimal(0),
	dreaming: false,
	autoSave: true,
	openBuilding: '',
	tutorialOne: true,
	path: new Array(10).fill(0).map(() => ({
		actions: new Array(100).fill(0).map(() => ({
			type: "",
			enemy: "",
			maxHp: new Decimal(0),
			hp: new Decimal(0),
			attackDuration: 0,
			damage: new Decimal(0),
			progress: 0
		})),
		type: ""
	})),
	currentAction: 0,
	actionProgress: -1,
	attackProgress: 0,
	cycle: 0,
	currentTime: performance.now(),
	hp: new Decimal(0),
	paused: false,
	upgrades: {
		Cot: 0,
		Bank: 0,
		Apothecary: 0,
		Armory: 0
	},
	gearLevel: 0,
	started: false,
	endAtLoop: false,
	endAtFloor: false,
	endingDream: false,
	endingDreamStatus: "death" // "loop", "floor"
};
function fixData(data, startData) {
	for (let dataKey in startData) {
		if (startData[dataKey] == null) {
			if (data[dataKey] === undefined) {
				data[dataKey] = null;
			}
		} else if (Array.isArray(startData[dataKey])) {
			if (data[dataKey] === undefined) {
				data[dataKey] = startData[dataKey];
			} else {
				fixData(startData[dataKey], data[dataKey]);
			}
		} else if (startData[dataKey] instanceof Decimal) { // Convert to Decimal
			if (data[dataKey] == undefined) {
				data[dataKey] = startData[dataKey];
			} else {
				data[dataKey] = new Decimal(data[dataKey]);
			}
		} else if ((!!startData[dataKey]) && (typeof startData[dataKey] === "object")) {
			if (data[dataKey] == undefined || (typeof data[dataKey] !== "object")) {
				data[dataKey] = startData[dataKey];
			} else {
				fixData(startData[dataKey], data[dataKey]);
			}
		} else {
			if (data[dataKey] == undefined) {
				data[dataKey] = startData[dataKey];
			}
		}
	}
}
let loadedData = localStorage.getItem(storageKey);
if (loadedData == null) {
	loadedData = startData;
} else {
	loadedData = Object.assign({}, startData, JSON.parse(atob(loadedData)));
	fixData(loadedData, startData);
}
const store = window.player = Vue.observable(loadedData);
Vue.prototype.$store = store;

// Set up auto-saving every 5s
window.save = function() {
	if (store.autoSave) {
		localStorage.setItem(storageKey, btoa(JSON.stringify(window.player)));
	}
}
setInterval(window.save, 5000);

// Add getters to Vue
function getAttackDuration() {
	return Decimal.times(1, Decimal.pow(.95, store.gearLevel)).clamp(Number.MIN_VALUE, Number.MAX_VALUE).toNumber();
}
Vue.prototype.getAttackDuration = window.getAttackDuration = getAttackDuration;
function getAttackDamage() {
	let damage = Decimal.add(2, store.gearLevel).pow(2);
	if (store.hp.gt(getMaxHealth())) {
		damage = damage.times(2);
	}
	return damage;
}
Vue.prototype.getAttackDamage = window.getAttackDamage = getAttackDamage;
function getActionDuration() {
	return Decimal.times(2, Decimal.pow(.98, store.gearLevel)).clamp(Number.MIN_VALUE, Number.MAX_VALUE).toNumber();
}
Vue.prototype.getActionDuration = window.getActionDuration = getActionDuration;
function getMaxHealth(gearLevel) {
	return new Decimal(25).times(Decimal.add(1, gearLevel || store.gearLevel).pow(2));
}
Vue.prototype.getMaxHealth = window.getMaxHealth = getMaxHealth;
function isCombatActive() {
	if (!store.dreaming) {
		return false;
	}
	if (store.path[store.position].actions[store.currentAction].type !== "enemy") {
		return false;
	}
	if (store.actionProgress < getActionDuration()) {
		return false;
	}
	return true;
}
Vue.prototype.isCombatActive = window.isCombatActive = isCombatActive;

// Set up actions
function getRandomModifier(cycle) {
	return (Math.random() * 0.2 + 0.8) * (cycle * 1.5);
}
const tiles = {
	default: [
		cycle => { // Bat
			const hp = new Decimal(getRandomModifier(cycle) + 3).factorial().floor();
			return Vue.observable({
				type: "enemy",
				enemy: "bat",
				maxHp: hp,
				hp,
				attackDuration: Decimal.times(2, Decimal.pow(.9, cycle)).toNumber(),
				damage: new Decimal(getRandomModifier(cycle) + 1.5).factorial().floor(),
				progress: 0
			});
		},
		cycle => { // Gold
			return Vue.observable({ type: "gold", amount: new Decimal(getRandomModifier(cycle) + 1).factorial().times(Decimal.pow(2, store.upgrades.Bank)).floor() });
		}
	],
	city: [
		cycle => { // Slime
			const hp = new Decimal(getRandomModifier(cycle) + 2.75).factorial().floor();
			return Vue.observable({
				type: "enemy",
				enemy: "slime",
				maxHp: hp,
				hp,
				attackDuration: Decimal.times(1, Decimal.pow(.5, cycle + 1)).toNumber(),
				damage: new Decimal(cycle + 1).sqrt(),
				progress: 0
			});
		},
		cycle => { // Gold
			return Vue.observable({ type: "gold", image: "dollar", amount: new Decimal(getRandomModifier(cycle) + 2).factorial().times(Decimal.pow(2, store.upgrades.Bank)).floor() });
		}
	],
	savanna: [
		cycle => { // Witch
			const hp = new Decimal(getRandomModifier(cycle) + 3).factorial().floor();
			return Vue.observable({
				type: "enemy",
				enemy: "witch",
				maxHp: hp,
				hp,
				attackDuration: Decimal.times(2, Decimal.pow(.95, cycle)).toNumber(),
				damage: new Decimal(getRandomModifier(cycle) + 2).factorial().floor(),
				progress: 0
			});
		},
		() => { // Potion
			return Vue.observable({ type: "potion" });
		}
	],
	graveyard: [
		cycle => { // Skeleton
			const hp = new Decimal(getRandomModifier(cycle) + 2.5).factorial().floor();
			return Vue.observable({
				type: "enemy",
				enemy: "skeleton",
				maxHp: hp,
				hp,
				attackDuration: Decimal.times(3, Decimal.pow(.98, cycle)).toNumber(),
				damage: new Decimal(getRandomModifier(cycle) + 2.5).factorial().floor(),
				progress: 0
			});
		},
		cycle => { // Gear
			return Vue.observable({ type: "gear", amount: (cycle + 1) / 10 });
		}
	]
}

const actions = window.actions = {
	startDream() {
		store.endAtLoop = false;
		store.endAtFloor = false;
		store.tutorialOne = false;
		store.openBuilding = '';
		store.cycle = -1;
		let tiles = [ "default" ];
		if (store.upgrades["Bank"] >= 1) {
			tiles.push("city");
		}
		if (store.upgrades["Apothecary"] >= 1) {
			tiles.push("savanna");
		}
		if (store.upgrades["Armory"] >= 1) {
			tiles.push("graveyard");
		}
		store.path = new Array(10).fill(0).map(() => ({ type: tiles[Math.floor(Math.random() * tiles.length)] }));
		store.position = 0;
		store.tempPoints = new Decimal(0);
		store.gearLevel = store.upgrades.Armory;
		store.hp = getMaxHealth();
		this.startLoop();
		store.dreaming = true;
	},
	endDream() {
		let modifier = 1;
		if (store.endingDreamStatus === "death") {
			modifier = 0.8;
		} else if (store.endingDreamStatus === "floor") {
			modifier = 0.9;
		}
		store.points = store.points.add(store.tempPoints.pow(modifier));
		store.dreaming = false;
		store.endingDream = false;
	},
	startLoop() {
		store.cycle++;
		store.position = -1;
		store.path.forEach(tile => {
			tile.actions = new Array(store.cycle + 1).fill(0).map(() => tiles[tile.type][Math.floor(Math.random() * tiles[tile.type].length)](store.cycle));
		});
		window.vue.$root.$children[0].$refs.dream.$refs.scroll.$el.scrollTo({top: 0, behavior: 'smooth'});
		this.nextFloor();
	},
	nextFloor() {
		store.position = store.position + 1;
		if (store.position >= 10) {
			if (store.upgrades.Cot >= 1 && !store.endAtLoop) {
				this.startLoop();
			} else {
				store.endingDreamStatus = "loop";
				store.endingDream = true;
				store.position = store.points - 1;
				store.currentAction = store.currentAction - 1;
			}
			return;
		}
		store.currentAction = -1;
		const scrollTarget = window.vue.$root.$children[0].$refs.dream.$refs.scroll.$el.children[store.position].offsetTop - 250;
		window.vue.$root.$children[0].$refs.dream.$refs.scroll.$el.scrollTo({ top: scrollTarget, behavior: 'smooth' });
		this.nextAction();
	},
	nextAction() {
		store.currentAction++;
		if (store.currentAction >= store.path[store.position].actions.length) {
			if (store.upgrades.Cot < 2 || !store.endAtFloor) {
				this.nextFloor();
			} else {
				store.endingDreamStatus = "floor";
				store.endingDream = true;
				store.currentAction = store.currentAction - 1;
			}
			return;
		}
		store.actionProgress = 0;
		store.attackProgress = 0;
	},
	openBuilding(building) {
		store.openBuilding = building;
	},
	closeBuilding() {
		store.openBuilding = '';
	}
};
Vue.prototype.$actions = actions;

// Add utility functions to Vue
Vue.prototype.format = format;
Vue.prototype.formatWhole = formatWhole;
Vue.prototype.formatTime = formatTime;

// Setup Vue
Vue.config.productionTip = false;
Vue.use(panZoom);
Vue.use(PerfectScrollbar, { name: 'scroll' });

// Start Vue
window.vue = new Vue({
  render: h => h(App),
}).$mount('#app');

// Setup update loop
function update(currTime) {
	// TODO offline time doesn't work if using performance.now()
	const delta = (currTime - store.currentTime) / 1000;
	if (delta > 0 && !store.paused && store.started && (store.cycle < 5 || store.keepPlaying)) {
		store.timePlayed += delta;
		if (store.dreaming && !store.endingDream) {
			store.actionProgress += delta;
			if (isCombatActive()) {
				store.attackProgress += delta;
				store.path[store.position].actions[store.currentAction].progress += delta;
				let alive = true;
				if (store.attackProgress >= getAttackDuration()) {
					store.attackProgress = 0;
					store.path[store.position].actions[store.currentAction].hp =
						store.path[store.position].actions[store.currentAction].hp.sub(getAttackDamage());
					if (store.path[store.position].actions[store.currentAction].hp.lte(0)) {
						actions.nextAction();
						alive = false;
					}
				}
				if (alive && store.path[store.position].actions[store.currentAction].progress >= store.path[store.position].actions[store.currentAction].attackDuration) {
					store.path[store.position].actions[store.currentAction].progress = 0;
					store.hp = store.hp.sub(store.path[store.position].actions[store.currentAction].damage);
					if (store.hp.lte(0)) {
						store.endingDream = true;
						store.endingDreamStatus = "death";
					}
				}
			} else {
				if (store.actionProgress >= getActionDuration()) {
					switch (store.path[store.position].actions[store.currentAction].type) {
						case "gold":
							store.tempPoints = store.tempPoints.add(store.path[store.position].actions[store.currentAction].amount);
							break;
						case "gear": {
							const oldGearLevel = store.gearLevel;
							store.gearLevel += store.path[store.position].actions[store.currentAction].amount * store.upgrades.Armory;
							store.hp = store.hp.add(getMaxHealth().sub(getMaxHealth(oldGearLevel)));
							break;
						}
						case "potion":
							store.hp = store.hp.add(getMaxHealth().times(0.25).times(store.upgrades.Apothecary + 1));
							break;
					}
					actions.nextAction();
				}
			}
		}
	}
	store.currentTime = currTime;
	requestAnimationFrame(update);
}
update(performance.now());
