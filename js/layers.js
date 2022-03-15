/*addLayer("p", {
	name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: true,
		points: decimalZero,
	}},
	color: "#4BDC13",
	requires: new Decimal(10), // Can be a function that takes requirement increases into account
	resource: "prestige points", // Name of prestige currency
	baseResource: "points", // Name of resource prestige is based on
	baseAmount() {return player.points}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 0.5, // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1)
		return mult
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 0, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown(){return true}
})*/
/*pl = plains*/
addLayer("plHome", {
	name: "Home",
	symbol: "Home",
	startData() { return {
		unlocked: true,
		points: decimalZero,
		metal: decimalZero,
		bestMetal: decimalZero,
		oil: decimalZero,
		chopping: 0,
		chopTime: 0,
		grid: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		],
		picked: [0, decimalZero],
		selected: 0,
		fgrid: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		],
		fpicked: 0,
		fselected: 0,
		fPipeConfig: "None",
		fConstant: new Decimal(1),
		treeFarmTime: decimalZero,
		mineTime: decimalZero
	}},
	color: "#77aa70",
	resource: "wood",
	position: 0,
	row: 0,
	layerShown: true,
	componentStyles: {
		buyable: {
			width: "116px",
			height: "116px"
		}
	},
	buyables: {
		rows: 4,
		cols: 10,
		11: {
			title: "Tree Farm",
			display() {
				return `Produces 1 wood every 5 seconds.<br>
				${!plHGrid.selected?`Cost: ${formatWhole(this.cost())} wood`:""}${plHGrid.selected?"Select an empty tile before placing.":""}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.points = player.plHome.points.sub(this.cost());
				player.plHome.buyables[11] = player.plHome.buyables[11].add(1);
				plHGrid.selected = [1, decimalZero];
				tmp.plHome.tileName = layers.plHome.tileName();
			},
			cost(n=player.plHome.buyables[11]) {
				return Decimal.pow(1.8, n).mul(10).ceil()
			},
			canAfford(n=player.plHome.buyables[11]) {
				return player.plHome.points.gte(this.cost(n)) &&
				plHGrid.selected == 0 && tmp.plHome.buyables[11].unlocked
			},
			unlocked() {
				return player.plHome.best >= 10 && !player.plHome.picked[0] && player.subtabs.plHome.mainTabs == "The Clearing"
			}
		},
		12: {
			title: "Mine",
			display() {
				return `Produces 1 metal every 10 seconds.<br>
				${!plHGrid.selected?`Cost: ${formatWhole(this.cost())} wood`:""}${plHGrid.selected?"Select an empty tile before placing.":""}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.points = player.plHome.points.sub(this.cost());
				player.plHome.buyables[12] = player.plHome.buyables[12].add(1);
				plHGrid.selected = [2, decimalZero];
				tmp.plHome.tileName = layers.plHome.tileName();
			},
			cost(n=player.plHome.buyables[12]) {
				return Decimal.pow(1.95, n).mul(100).ceil()
			},
			canAfford(n=player.plHome.buyables[12]) {
				return player.plHome.points.gte(this.cost(n)) &&
				plHGrid.selected == 0 && tmp.plHome.buyables[12].unlocked
			},
			unlocked() {
				return player.plHome.best >= 100 && !player.plHome.picked[0] && player.subtabs.plHome.mainTabs == "The Clearing"
			}
		},
		13: {
			title: "Oil Rig",
			display() {
				return `Produces 1 oil every 15 seconds.<br>
				${!plHGrid.selected?`Cost: ${formatWhole(this.cost())} metal`:""}${plHGrid.selected?"Select an empty tile before placing.":""}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.metal = player.plHome.metal.sub(this.cost());
				player.plHome.buyables[13] = player.plHome.buyables[13].add(1);
				plHGrid.selected = [3, decimalZero];
				tmp.plHome.tileName = layers.plHome.tileName();
			},
			cost(n=player.plHome.buyables[13]) {
				return Decimal.pow(2.2, n).mul(50).ceil()
			},
			canAfford(n=player.plHome.buyables[13]) {
				return player.plHome.metal.gte(this.cost(n)) &&
				plHGrid.selected == 0 && tmp.plHome.buyables[13].unlocked
			},
			unlocked() {
				return player.plHome.bestMetal >= 50 && !player.plHome.picked[0] && player.subtabs.plHome.mainTabs == "The Clearing"
			}
		},
		14: {
			title: "Laboratory",
			display() {
				return `Gives access to researches.<br>
				${`${player.plHome.buyables[14].gte(1)?"(MAXED)":(plHGrid.selected ? "Select an empty tile before placing." : "Cost: 100 metal")}`}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.metal = player.plHome.metal.sub(100);
				player.plHome.buyables[14] = player.plHome.buyables[14].add(1);
				plHGrid.selected = [4, decimalZero];
				tmp.plHome.tileName = layers.plHome.tileName();
			},
			canAfford() {
				return player.plHome.metal.gte(100) &&
				plHGrid.selected == 0 && tmp.plHome.buyables[14].unlocked && player.plHome.buyables[14].lt(1)
			},
			unlocked() {
				return hasUpgrade("plVillage", 11) && !player.plHome.picked[0] && player.subtabs.plHome.mainTabs == "The Clearing";
			}
		},
		15: {
			title: "Fertilizer",
			display() {
				return `Boosts all tree farms next to it (including diagonal) by x${format(player.plHome.fConstant, 1)}.<br>
				${!plHGrid.selected?`Cost: ${formatWhole(tmp.plHome.buyables[15].cost)} metal`:""}${plHGrid.selected?"Select an empty tile before placing.":""}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.metal = player.plHome.metal.sub(this.cost());
				player.plHome.buyables[15] = player.plHome.buyables[15].add(1);
				plHGrid.selected = [5];
				tmp.plHome.tileName = layers.plHome.tileName();
			},
			cost() {
				return Decimal.pow(10, player.plHome.buyables[15]).mul(10000);
			},
			canAfford() {
				return player.plHome.metal.gte(this.cost()) &&
				plHGrid.selected == 0 && tmp.plHome.buyables[15].unlocked && !player.plHome.picked[0]
			},
			unlocked() {
				return !player.plHome.picked[0] && player.plHome.buyables[32].gte(1) && player.subtabs.plHome.mainTabs == "The Clearing";
			}
		},
		21: {
			title: "Upgrade",
			display() {
				if (!plHGrid.selected || !plHGrid.data) return "Something bad probably happened"
				return `Upgrade the ${tmp.plHome.tileName}.<br>
				Level ${formatWhole(plHGrid.data.add(1))}
				${tmp.plHome.buyables[21].effect?`Effect: ${tmp.plHome.buyables[21].effect}`:""}
				Cost: ${plHGrid.data.gte(tmp.plHome.buyables[21].maxLevel)?"(MAXED)":`${formatWhole(tmp.plHome.buyables[21].cost)} ${this.currencyName()}`}`
			},
			buy(tileX=plHGrid.x, tileY=plHGrid.y) {
				if (!this.canAfford(tileX, tileY)) return;
				player.plHome[tmp.plHome.buyables[21].currencyLoc] = player.plHome[tmp.plHome.buyables[21].currencyLoc].sub(this.cost(tileX, tileY));
				plHGrid.setData(tileX, tileY, plHGrid.getData(tileX, tileY).add(1));
			},
			cost(tileX=plHGrid.x, tileY=plHGrid.y) {
				if (!plHGrid.get(tileX, tileY)) return Infinity;
				var tileID = plHGrid.get(tileX, tileY)[0];
				switch (tileID) {
					case 1:
					return Decimal.pow(4.5, plHGrid.getData(tileX, tileY)).mul(30).floor();
					case 2:
					return Decimal.pow(5, plHGrid.getData(tileX, tileY)).mul(15);
					case 3:
					return Decimal.pow(6, plHGrid.getData(tileX, tileY)).mul(75);
					case 4:
					return Decimal.pow(50, plHGrid.getData(tileX, tileY)).mul(100000);
					default:
					return Infinity;
				}
			},
			currencyLoc(tileX=plHGrid.x, tileY=plHGrid.y) {
				try {if (!plHGrid.get(tileX, tileY)) return;} catch(e) {console.log(tileX)}
				var tileID = plHGrid.get(tileX, tileY)[0];
				switch (tileID) {
					case 1: return "points";
					case 2: return "metal";
					case 3: return "metal";
					case 4: return "metal";
				}
			},
			canAfford(tileX=plHGrid.x, tileY=plHGrid.y) {
				return layers.plHome.buyables[21].currencyLoc(tileX, tileY) && player.plHome[layers.plHome.buyables[21].currencyLoc(tileX, tileY)].gte(this.cost(tileX, tileY)) && plHGrid.getData(tileX, tileY).lt(this.maxLevel(tileX, tileY));
			},
			currencyName(tileX=plHGrid.x, tileY=plHGrid.y) {
				if (!plHGrid.get(tileX, tileY)) return;
				var tileID = plHGrid.get(tileX, tileY)[0];
				switch (tileID) {
					case 1:
					return "wood";
					case 2:
					return "metal";
					case 3:
					return "metal";
					case 4:
					return "metal"
				}
			},
			maxLevel(tileX=plHGrid.x, tileY=plHGrid.y) {
				if (!plHGrid.get(tileX, tileY)) return 0;
				var tileID = plHGrid.get(tileX, tileY)[0];
				switch (tileID) {
					case 4:
					return 1;
					default:
					return 20;
				}
			},
			effect() {
				switch (plHGrid.name) {
					case 1:
					return `x${formatWhole(Decimal.pow(2, plHGrid.data))} to production`
					case 2:
					return `x${formatWhole(Decimal.pow(2, plHGrid.data))} to production`
					case 3:
					return `x${format(Decimal.pow(1.5, plHGrid.data))} to production`
					case 4:
					return `${formatWhole(plHGrid.data.add(1))} researches unlocked`
				}
			},
			unlocked() {
				return player.plHome.best >= 10 &&
				plHGrid.s != 0 && !player.plHome.picked[0]
				&& plHGrid.data && player.subtabs.plHome.mainTabs == "The Clearing" && tmp.plHome.buyables[21].currencyLoc;
			},
			changeStyle: true
		},
		22: {
			title: "Sell",
			display() {
				return `Sell the ${tmp.plHome.tileName} for nothing in return.`
			},
			buy() {
				player.plHome.buyables[plHTileBuyable(tmp.plHome.tileName)] = player.plHome.buyables[plHTileBuyable(tmp.plHome.tileName)].sub(1)
				plHGrid.selected = 0;
				tmp.plHome.tileName = layers.plHome.tileName();
			},
			canAfford: true,
			unlocked() {
				return player.plHome.best >= 10 &&
				plHGrid.s != 0 && !player.plHome.picked[0] && player.subtabs.plHome.mainTabs == "The Clearing";
			},
			changeStyle: true
		},
		23: {
			title: "Move",
			display() {
				return player.plHome.picked[0]?
				`Click on the tile where you wish to place the building.${player.plHome.picked[1]?`<br>(Level ${formatWhole(player.plHome.picked[1].add(1))} ${plHTileName(player.plHome.picked[0])})`:""}`:
				`Pick up the ${tmp.plHome.tileName} and move it.`
			},
			buy() {
				player.plHome.picked = plHGrid.selected;
				plHGrid.selected = 0;
				tmp.plHome.tileName = layers.plHome.tileName();
			},
			canAfford() {
				return !player.plHome.picked[0]
			},
			unlocked() {
				return hasUpgrade("plVillage", 13) && (plHGrid.selected.constructor == Array || player.plHome.picked[0]) && player.subtabs.plHome.mainTabs == "The Clearing"
			},
			changeStyle: true
		},
		24: {
			title: "Setup",
			display: "Set up the fertilizer factory to boost production.",
			buy() {player.subtabs.plHome.mainTabs = "Fertilizer Factory"},
			canAfford: true,
			unlocked() { return plHGrid.s &&
				plHGrid.s[0] == 5 && player.subtabs.plHome.mainTabs == "The Clearing"},
			changeStyle: true
		},
		31: {
			title: "WD-40",
			display() {
				return `Increases production of metal and oil by oiling the machines better.
				Level ${formatWhole(player.plHome.buyables[31])}
				Effect: x${formatWhole(tmp.plHome.buyables[31].effect)}
				${player.plHome.buyables[31].gte(tmp.plHome.buyables[31].maxAmount)?"(MAXED)":`Cost: ${formatWhole(tmp.plHome.buyables[31].cost)} oil`}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.oil = player.plHome.oil.sub(this.cost());
				player.plHome.buyables[31] = player.plHome.buyables[31].add(1);
			},
			cost() {
				return Decimal.pow(3, player.plHome.buyables[31]).mul(20)
			},
			canAfford() {
				return player.plHome.oil.gte(this.cost()) && player.plHome.buyables[31].lt(tmp.plHome.buyables[31].maxAmount);
			},
			maxAmount: 20,
			effect() {
				return player.plHome.buyables[31].pow(2).add(1)
			},
			unlocked() {
				return player.plHome.buyables[14].gt(0) && player.subtabs.plHome.mainTabs == "The Clearing";
			}
		},
		32: {
			title: "Fertilizers",
			display() {
				var desc = ["Unlock Fertilizers.",
				"Increase the potency of fertilizer, and unlock new factory buildings."];
				return `${desc[player.plHome.buyables[32].toString()]}
				Level ${formatWhole(player.plHome.buyables[32])}
				${player.plHome.buyables[32].gte(tmp.plHome.buyables[32].maxAmount)?"(MAXED)":`Cost: ${formatWhole(tmp.plHome.buyables[32].cost)} wood`}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.points = player.plHome.points.sub(this.cost());
				player.plHome.buyables[32] = player.plHome.buyables[32].add(1);
			},
			cost() {
				switch(player.plHome.buyables[32].round().toString()) {
					case "0": return 7500;
					case "1": return 1e7;
					default: return Infinity;
				}
			},
			canAfford() {
				return player.plHome.points.gte(this.cost()) && player.plHome.buyables[32].lt(tmp.plHome.buyables[32].maxAmount);
			},
			maxAmount: 2,
			unlocked() {
				return player.plHome.buyables[14].gt(0) && plHGrid.grid.map(_=> _.filter(a=> a && a[0] == 4)).filter(_=>_.length > 0)[0][0][1].gte(1) && player.subtabs.plHome.mainTabs == "The Clearing";
			}
		},
		41: {
			title: "Crate",
			display() {
				return `Holds up to 2000 wood.<br>
				${!plHFGrid.selected?`Cost: ${formatWhole(tmp.plHome.buyables[41].cost)} wood`:""}${plHFGrid.selected?"Select an empty tile before placing.":""}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.points = player.plHome.points.sub(this.cost());
				player.plHome.buyables[41] = player.plHome.buyables[41].add(1);
				plHFGrid.selected = ["box", ["empty", {Wood: decimalZero}]]
			},
			cost() {
				return Decimal.pow(100, player.plHome.buyables[41]).mul(1000)
			},
			canAfford() {
				return player.plHome.points.gte(this.cost()) &&
				plHFGrid.selected.constructor != Array && tmp.plHome.buyables[41].unlocked
			},
			unlocked() {
				return player.subtabs.plHome.mainTabs == "Fertilizer Factory" && !player.plHome.fpicked[0];
			}
		},
		42: {
			title: "Grinder",
			display() {
				return `See the recipe book for more details.<br>
				${!plHFGrid.selected?`Cost: ${formatWhole(tmp.plHome.buyables[42].cost)} metal`:""}${plHFGrid.selected?"Select an empty tile before placing.":""}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.metal = player.plHome.metal.sub(this.cost());
				player.plHome.buyables[42] = player.plHome.buyables[42].add(1);
				plHFGrid.selected = ["grinder", ["inactive", {Wood: decimalZero, Mulch: decimalZero}]]
			},
			cost() {
				return Decimal.pow(20, player.plHome.buyables[42]).mul(50000)
			},
			canAfford() {
				return player.plHome.metal.gte(this.cost()) &&
				plHFGrid.selected.constructor != Array && tmp.plHome.buyables[42].unlocked
			},
			unlocked() {
				return player.subtabs.plHome.mainTabs == "Fertilizer Factory" && !player.plHome.fpicked[0];
			}
		},
		43: {
			title: "Distributor",
			display() {
				return `Collects 1 of each fertilizer from adjacent tiles each second to boost wood production.<br>
				${!plHFGrid.selected?`Cost: ${formatWhole(tmp.plHome.buyables[43].cost)} metal`:""}${plHFGrid.selected?"Select an empty tile before placing.":""}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.metal = player.plHome.metal.sub(this.cost());
				player.plHome.buyables[43] = player.plHome.buyables[43].add(1);
				plHFGrid.selected = ["distributor", ["inactive", {Mulch: decimalZero, "Chemical Fertilizer": decimalZero, "Super-Fertilizer": decimalZero}]]
			},
			cost() {
				return Decimal.pow(6.5, player.plHome.buyables[43]).mul(100000)
			},
			canAfford() {
				return player.plHome.metal.gte(this.cost()) &&
				plHFGrid.selected.constructor != Array && tmp.plHome.buyables[43].unlocked
			},
			unlocked() {
				return player.subtabs.plHome.mainTabs == "Fertilizer Factory" && !player.plHome.fpicked[0];
			}
		},
		44: {
			title: "Refiner",
			display() {
				return `Refines minerals produced from the mine to make 0.05 Chemical Fertilizer per mine per second.<br>
				${!plHFGrid.selected?`Cost: ${formatWhole(tmp.plHome.buyables[44].cost)} metal`:""}${plHFGrid.selected?"Select an empty tile before placing.":""}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.metal = player.plHome.metal.sub(this.cost());
				player.plHome.buyables[44] = player.plHome.buyables[44].add(1);
				plHFGrid.selected = ["refiner", ["inactive", {"Ammonium Nitrate": decimalZero}]]
			},
			cost() {
				return Decimal.pow(10, player.plHome.buyables[44]).mul(1000000)
			},
			canAfford() {
				return player.plHome.metal.gte(this.cost()) &&
				plHFGrid.selected.constructor != Array && tmp.plHome.buyables[44].unlocked
			},
			unlocked() {
				return player.subtabs.plHome.mainTabs == "Fertilizer Factory" && !player.plHome.fpicked[0] && player.plHome.buyables[32].gte(2);
			}
		},
		50: {
			title: "Pipe",
			display() {
				return `Transfers materials.<br>
				${!plHFGrid.selected?`Cost: 20 metal`:""}${plHFGrid.selected?"Select an empty tile before placing.":""}`
			},
			buy() {
				if (!this.canAfford()) return;
				player.plHome.metal = player.plHome.metal.sub(20);
				player.plHome.buyables[50] = player.plHome.buyables[50].add(1);
				plHFGrid.selected = ["pipe", ["0000", {Wood: decimalZero, Mulch: decimalZero, "Chemical Fertilizer": decimalZero,
				"Super-Fertilizer": decimalZero, "Ammonium Nitrate": decimalZero}, player.plHome.fPipeConfig]];
			},
			canAfford() {
				return player.plHome.metal.gte(20) &&
				plHFGrid.selected.constructor != Array && tmp.plHome.buyables[50].unlocked
			},
			unlocked() {
				return player.subtabs.plHome.mainTabs == "Fertilizer Factory" && !player.plHome.fpicked[0];
			}
		},
		51: {
			title: "Sell",
			display() {
				return `Sell the ${tmp.plHome.fTileName} for nothing in return.`
			},
			buy() {
				player.plHome.buyables[plHFTileBuyable(tmp.plHome.fTileName)] = player.plHome.buyables[plHFTileBuyable(tmp.plHome.fTileName)].sub(1)
				plHFGrid.selected = 0;
				tmp.plHome.fTileName = layers.plHome.fTileName();
			},
			canAfford: true,
			unlocked() {
				return plHFGrid.selected && !player.plHome.fpicked && player.subtabs.plHome.mainTabs == "Fertilizer Factory";
			},
			changeStyle: true
		},
		52: {
			title: "Move",
			display() {
				return player.plHome.fpicked[0]?
				`Click on the tile where you wish to place the ${plFHTileName(player.plHome.fpicked)}.`:
				`Pick up the ${tmp.plHome.fTileName} and move it.`
			},
			buy() {
				player.plHome.fpicked = plHFGrid.selected;
				plHFGrid.selected = 0;
				tmp.plHome.fTileName = layers.plHome.fTileName();
			},
			canAfford() {
				return !player.plHome.fpicked
			},
			unlocked() {
				return hasUpgrade("plVillage", 13) && (plHFGrid.selected || player.plHome.fpicked) && player.subtabs.plHome.mainTabs == "Fertilizer Factory"
			},
			changeStyle: true
		},
		53: {
			title: "Fill",
			display() {
				if (!this.unlocked()) return;
				let hm = player.plHome, oldPoints = hm.points,
				rsc = plHFGrid.data[1];

				return `Stock the crate with ${formatWhole(hm.points.min(rsc.Wood.neg().add(tmp.plHome.fMaxAmt.Crate.Wood)).min(hm.points).floor())} wood.`
			},
			buy() {
				let hm = player.plHome, oldPoints = hm.points,
				rsc = hm.fgrid[Math.floor(player.plHome.fselected/10)][player.plHome.fselected%10][1][1];

				hm.points = hm.points.sub(hm.points.min(rsc.Wood.neg().add(tmp.plHome.fMaxAmt.Crate.Wood)).min(hm.points).floor());
				oldPoints = oldPoints.sub(hm.points);
				rsc.Wood = rsc.Wood.add(oldPoints).unFuck();
				hm.fgrid[Math.floor(player.plHome.fselected/10)][player.plHome.fselected%10][1][0] = "full"
			},
			canAfford() {
				return plHFGrid.selected && plHFGrid.selected[0] == "box" && plHFGrid.data[1].Wood.lt(tmp.plHome.fMaxAmt.Crate.Wood)
			},
			unlocked() {
				return player.subtabs.plHome.mainTabs == "Fertilizer Factory" && !player.plHome.fpicked[0] && plHFGrid.selected && plHFGrid.selected[0] == "box"
			},
			changeStyle: true
		}
	},
	clickables: {
		11: {
			display: "<span class='bText'>Chop wood.</span>",
			canClick: true,
			onClick() {
				player.plHome.chopping = 1;
			},
			style: {
				border: "none",
				boxShadow: "2px 2px 0 0 #950, -2px -2px 0 0 #950, 2px -2px 0 0 #950, -2px 2px 0 0 #950"
			},
			barColor: "#b70",
			bar() {
				return player.plHome.chopTime
			},
			unlocked() {
				return !player.r.roads.length > 0
			}
		}
	},
	tileName() {
		return tUtils.plH.tileName[plHGrid.name];
	},
	fTileName() {
		return tUtils.plHF.tileName[plHFGrid.name];
	},
	fUnlockedCurrency: {
		Wood: true,
		Mulch: true,
		"Chemical Fertilizer"() {
			return player.plHome.buyables[32].gte(2);
		},
		"Ammonium Nitrate"() {
			return player.plHome.buyables[32].gte(2);
		},
		"Super-Fertilizer": false
	},
	fMaxAmt: {
		Crate: {
			Wood: 2000,
			generally: 0
		},
		Grinder: {
			Wood: 1000,
			Mulch: 200,
			generally: 0
		},
		Distributor: {
			Mulch: 300,
			"Chemical Fertilizer": 200,
			"Super-Fertilizer": 100
		},
		Refiner: {
			"Ammonium Nitrate": 100,
		},
		Purifyer: {
			"Ammonium Nitrate": 100,
			"Chemical Fertilizer": 100,
		},
		Pipe: {
			generally: 500
		}
	},
	fProperties: {
		box: {
			give: ["Wood"],
			take: []
		},
		grinder: {
			give: ["Mulch", "Chemical Fertilizer"],
			take: ["Wood", "Ammonium Nitrate"],
		},
		distributor: {
			give: [],
			take: ["Mulch", "Chemical Fertilizer", "Super-Fertilizer"]
		},
		pipe: {
			give: ["all"],
			take: ["all"]
		}
	},
	fertilizerPotency: {
		Mulch() {
			return player.plHome.buyables[32].gte(2)?7.5:5;
		},
		"Chemical Fertilizer"() {
			return player.plHome.buyables[32].gte(2)?15:10;
		}
	},
	treeFarmAmt() {
		if (player.plHome.selected >= 100) return decimalZero;
		return plHGrid.grid.slice().reduce((a, v, i)=>{
			return a.add(v.reduce((b, w, j)=>{
				if (w.constructor != Array || w[0] != 1) return b;
				else {
					var top = i >= 1, bottom = i <= 7,
					left = j >= 1, right = j <= 7;

					var grid = plHGrid.grid;

					var hasFertilizer = false;
					if (player.plHome.buyables[32].gt(0)) for (var k = -top; k <= bottom; k++) {
						for (var l = -left; l <= right; l++) {
							hasFertilizer ||= (grid[i+k][j+l] && grid[i+k][j+l][0] == 5);
						}
					}
					return b.add(Decimal.pow(2, w[1]).mul(0.2).mul(hasFertilizer ? player.plHome.fConstant : 1));
				}
			}, decimalZero))
		}, decimalZero).mul(hasUpgrade("plVillage", 12)*3+1)
	},
	mineAmt() {
		if (player.plHome.selected >= 100) return decimalZero;
		return plHGrid.grid.slice().reduce((a, v)=>{
			return a.add(v.reduce((b, w)=>{
				if (w.constructor != Array || w[0] != 2) return b;
				else return b.add(Decimal.pow(2, w[1]).mul(0.1))
			}, decimalZero))
		}, decimalZero).mul(tmp.plHome.buyables[31].effect).mul(hasUpgrade("plVillage", 12)*3+1)
	},
	oilRigAmt() {
		if (player.plHome.selected >= 100) return decimalZero;
		return plHGrid.grid.slice().reduce((a, v)=>{
			return a.add(v.reduce((b, w)=>{
				if (w.constructor != Array || w[0] != 3) return b;
				else return b.add(Decimal.pow(1.5, w[1]).div(15))
			}, decimalZero))
		}, decimalZero).mul(tmp.plHome.buyables[31].effect).mul(hasUpgrade("plVillage", 12)*3+1)
	},
	update(diff) {
		queryCurrencies = getQueryCurrencies();
		player.plHome.fConstant = new Decimal(1);

		player.plHome.chopTime += diff*player.plHome.chopping;
		if (player.plHome.chopTime >= 1) {
			player.plHome.chopTime = player.plHome.chopping = 0;
			addPoints("plHome", 1);
		}
		player.plHome.treeFarmTime = player.plHome.treeFarmTime.add(tmp.plHome.treeFarmAmt.mul(diff));
		addPoints("plHome", player.plHome.treeFarmTime.floor());
		player.plHome.treeFarmTime = player.plHome.treeFarmTime.sub(player.plHome.treeFarmTime.floor());

		player.plHome.mineTime = player.plHome.mineTime.add(tmp.plHome.mineAmt.mul(diff));
		player.plHome.metal = player.plHome.metal.add(player.plHome.mineTime.floor());
		player.plHome.bestMetal = player.plHome.bestMetal.max(player.plHome.metal);
		player.plHome.mineTime = player.plHome.mineTime.sub(player.plHome.mineTime.floor());

		player.plHome.oil = player.plHome.oil.add(tmp.plHome.oilRigAmt.mul(diff));

		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				var fgrid = plHFGrid.grid, ftile = fgrid[i][j];

				if (!ftile) continue;

				queryPlFHTile(ftile, i, j, diff)

				switch (ftile[0]) {
					case "grinder": {
						var prevWood = ftile[1][1].Wood;
						ftile[1][1].Wood = ftile[1][1].Wood.sub(ftile[1][1].Mulch.neg().add(tmp.plHome.fMaxAmt.Grinder.Mulch).min(10*diff).min(ftile[1][1].Wood)).unFuck();
						prevWood = prevWood.sub(ftile[1][1].Wood);
						ftile[1][1].Mulch = ftile[1][1].Mulch.add(prevWood.div(5)).unFuck();

						break;
					}

					case "distributor": {
						let subbedMulch = ftile[1][1].Mulch.min(0.5*diff);
						ftile[1][1].Mulch = ftile[1][1].Mulch.sub(subbedMulch).max(0).unFuck();
						let prevMulch = subbedMulch.div(0.5*diff);

						if (prevMulch.gt(0)) {
							player.plHome.fConstant = player.plHome.fConstant.add(prevMulch.mul(tmp.plHome.fertilizerPotency.Mulch));
						}

						break;
					}

					case "refiner": {
						Vue.set(ftile[1], 0, (ftile[1][1]["Ammonium Nitrate"].lt(tmp.plHome.fMaxAmt.Refiner["Ammonium Nitrate"]))?"active":"inactive");
						ftile[1][1]["Ammonium Nitrate"] = ftile[1][1]["Ammonium Nitrate"].add(player.plHome.buyables[12].mul(0.05*diff)).min(tmp.plHome.fMaxAmt.Refiner["Ammonium Nitrate"]);

						break;
					}
				}
			}
		}
	}, 
	tabFormat: {
		"The Clearing": {
			content: [["custom-display", [0, "#c09030", _=>`wood (${format(tmp.plHome.treeFarmAmt)}/s)`]],
			 _=>player.plHome.best >= 100 ? ["custom-display", [player.plHome.metal, "#aaa", `metal
			 (${format(tmp.plHome.mineAmt)}/s)`]] : "",
			_=>player.plHome.bestMetal >= 50 ? ["custom-display", [player.plHome.oil, "#840",  `oil
			 (${format(tmp.plHome.oilRigAmt)}/s)`]] : "",
			["clickable", 11], "blank",
			["buyable-row", 1], ["buyable-row", 3], "blank",
			"placement-grid"]
		},
		"Fertilizer Factory": {
			content: [["custom-display", [0, "#c09030", _=>`wood (${format(tmp.plHome.treeFarmAmt)}/s)`]],
			_=>player.plHome.best >= 100 ? ["custom-display", [player.plHome.metal, "#aaa", `metal
			(${format(tmp.plHome.mineAmt)}/s)`]] : "",
			_=>player.plHome.bestMetal >= 50 ? ["custom-display", [player.plHome.oil, "#840",  `oil
			(${format(tmp.plHome.oilRigAmt)}/s)`]] : "",
			"buyables", "blank",
			"placement-grid-fertilizer"],
			unlocked() {
				return player.plHome.buyables[32].gte(1);
			}
		}
	},
	tooltip: "Home (Plains)",
	connected: ["plVillage"],
	branches() {
		return tmp.r.getNodeBranches.plHome
	},
	unlocked: true
})

addLayer("plVillage", {
	name: "Village",
	symbol: "Village",
	startData() { return {
		points: decimalZero,
		unlocked: false
	}},
	color: "#974",
	position: 0,
	row: 1,
	layerShown() {
		return player.plHome.bestMetal.gte(50);
	},
	type: "custom",
	getResetGain() {return new Decimal(1)},
	baseAmount() {return new Decimal(10)},
	requires() {return new Decimal(2)},
	canReset() {return player.plVillage.points.lt(1)&&JSON.stringify(player.r.roads).includes("plVillage")},
	getNextAt() {return new Decimal(Infinity)},
	prestigeButtonText() {return "Travel to the village."},
	tooltip: "Village (Plains)",
	tooltipLocked: "Build a road here to unlock.",
	branches() {
		return tmp.r.getNodeBranches.plVillage
	},
	unlocked() {
		return JSON.stringify(player.r.roads).includes("plVillage")
	},
	upgrades: {
		rows: 2,
		cols: 5,
		11: {
			title: "Gift of Science",
			description: "Unlocks the Laboratory.",
			cost: 500,
			currencyLayer: "plHome",
			currencyInternalName: "points",
			currencyDisplayName: "wood",
			unlocked() {
				return player.plVillage.points.gte(1)
			}
		},
		12: {
			title: "Gift of Fountain",
			description: "Quadruples wood, metal, and oil production.",
			cost: 100,
			currencyLayer: "plHome",
			currencyInternalName: "oil",
			currencyDisplayName: "oil",
			unlocked() {
				return player.plVillage.points.gte(1)
			}
		},
		13: {
			title: "Gift of Mobility",
			description: "You can pick up buildings and move them.",
			cost: 25000,
			currencyLayer: "plHome",
			currencyInternalName: "metal",
			currencyDisplayName: "metal",
			unlocked() {
				return player.plVillage.points.gte(1)
			}
		}
	},
	connected: ["plHome"],
	resetsNothing: true,
	tabFormat: {
		Village: {
			content: [_=>player.plVillage.points.lt(1)?"prestige-button":"upgrades"]
		}
	}
})

addLayer("r", {
	name: "Roads",
	symbol: "Roads",
	startData() { return {
		points: decimalZero,
		selectingStart: false,
		selectingEnd: false,
		selectedStart: "",
		selectedEnd: "",
		unlocked: true,
		roads: []
	}},
	color: "#ff0",
	position: 0,
	row: "side",
	layerShown() {
		return player.plHome.bestMetal.gte(50);
	},
	clickables: {
		rows: 1,
		cols: 2,
		11: {
			title() {return player.r.selectingEnd ? "End" : (player.r.selectingStart ? "Start" : "Select a path")},
			display() {
				return player.r.selectingEnd ? "Please click on the node you want to select as the end. Click on this to stop selection." : (player.r.selectingStart ? "Please click on the node you want to select as the start.  Click on this to stop selection."
				: `Currently: ${player.r.selectedEnd ? `From ${player.r.selectedStart.slice(2)} To ${player.r.selectedEnd.slice(2)}` : "no path selected"}`)
			},
			canClick: 1,
			onClick() {
				player.r.selectedStart = "";
				player.r.selectedEnd = "";
				player.r.selectingStart = !player.r.selectingStart;
				if (player.r.selectingEnd) player.r.selectingStart = false;
				player.r.selectingEnd = false;
			}
		}
	},
	buyables: {
		rows: 1,
		cols: 1,
		11: {
			title: "Build a road.",
			display() {
				return player.r.roads.map(_=>_.join("_")).includes(this.arr().join("_")) ? "There is already a road here!" :
				(player.r.selectedStart && player.r.selectedEnd ? `From: ${player.r.selectedStart.slice(2)}
				To: ${player.r.selectedEnd.slice(2)}
				Cost: ${tmp.r.buyables[11].costDisp}` : "Please select a path to build the road on.")
			},
			style: {
				fontSize: "12px"
			},
			arr() {
				var arr = [player.r.selectedStart, player.r.selectedEnd]
				return arr.sort();
			},
			buy() {
				if (this.canAfford()) {
					player.r.roads.push(this.arr());
					player.plHome.points = player.plHome.points.sub(this.cost().points);
					player.plHome.metal = player.plHome.metal.sub(this.cost().metal);
					player.plHome.oil = player.plHome.oil.sub(this.cost().oil);
					player.r.selectedStart = "";
					player.r.selectedEnd = "";
				}
			},
			cost() {
				var points,metal,oil;
				switch(this.arr().join("_")) {
					case "plHome_plVillage":
					points = new Decimal(800);
					metal = new Decimal(100);
					oil = new Decimal(40);
					break;
					default:
					points = new Decimal(Infinity);
					metal = new Decimal(Infinity);
					oil = new Decimal(Infinity);
				}
				return {points, metal, oil}
			},
			costDisp() {
				var c = tmp.r.buyables[11].cost
				return `${format(player.plHome.points)}/${format(c.points)} wood
				${format(player.plHome.metal)}/${format(c.metal)} metal
				${format(player.plHome.oil)}/${format(c.oil)} oil`
			},
			canAfford() {
				return player.plHome.points.gte(this.cost().points) && player.plHome.metal.gte(this.cost().metal) && player.plHome.oil.gte(this.cost().oil) && !player.r.roads.map(_=>_.join("_")).includes(this.arr().join("_")) && !(player.r.selectingStart || player.r.selectingEnd) && player.r.selectedStart && player.r.selectedEnd;
			}
		}
	},
	getNodeBranches() {
		var branches = {};
		for (const i in TREE_LAYERS) {
			for (const j in TREE_LAYERS[i]) {branches[TREE_LAYERS[i][j]] = [];}
		}
		for (const i in player.r.roads) {
			branches[player.r.roads[i][0]].push(player.r.roads[i][1]);
		}
		return branches;
	},
	tooltip: "Roads",
	tabFormat: {
		Build: {
			content: [["raw-html", "Roads can reach at most 1 tree node away."], "blank", "clickables", "blank", "buyables"]
		}
	},
	unlocked: true
})