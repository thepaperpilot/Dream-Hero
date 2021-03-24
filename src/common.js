import Decimal from './break_eternity.js'

global.Decimal = Decimal

const bgColor = "#ee8695";
const fgColor = "#292831";
const hiColor = "#333f58";
const raisedColor = "#fbbbad";
const otherColor = "#4a7a96";

const decimalZero = new Decimal(0);
const decimalOne = new Decimal(1);
const decimalNaN = new Decimal(NaN);

const buildingInfo = {
	Cot: {
		background: "default",
		enemies: [ "bat" ],
		upgrades: [
			{ description: "I'd sleep better on something comfier", cost: new Decimal(2) },
			{ description: "An even comfier bed could give me better control on when I wake up", cost: new Decimal(2500) },
			// TODO upgrade to select order of dream path
		]
	},
	Bank: {
		background: "city",
		enemies: [ "slime" ],
		upgrades: [
			{ description: "Building a bank allows me to adventure to cities in my dreams, with increased riches", cost: new Decimal(100) }
		],
		infinite: {
			description: "Improve the bank to double all gold gain",
			r: 5,
			base: 100
		}
	},
	Apothecary: {
		background: "savanna",
		enemies: [ "witch" ],
		upgrades: [
			{ description: "Building an apothecary will allow me to find potions in my dreams", cost: new Decimal(10000) }
		],
		infinite: {
			description: "Improve the apothecary to increase how much potions heal",
			r: 3,
			base: 10000
		}
	},
	Armory: {
		background: "graveyard",
		enemies: [ "skeleton" ],
		upgrades: [
			{ description: "Building an armory will help my gear up in my dreams", cost: new Decimal(10) }
		],
		infinite: {
			description: "Improve the armory to increase starting gear level",
			r: 8,
			base: 10
		}
	}
}

export default { bgColor, fgColor, hiColor, raisedColor, otherColor, decimalZero, decimalOne, decimalNaN, buildingInfo };
