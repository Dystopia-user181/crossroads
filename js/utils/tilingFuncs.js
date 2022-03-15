function plFHTCan(givetake, tile, item) {
	if (tile[0] == "pipe") {
		return tile[1][2] == item;
	}
	return tmp.plHome.fProperties[tile[0]][givetake].includes(item) || tmp.plHome.fProperties[tile[0]][givetake].includes("all")
}

const plHTileNames = ["Empty", "Tree Farm", "Mine", "Oil Rig", "Laboratory", "Fertilizer Factory"]
function plHTileName(i) {
	if (i.constructor == Array) i = i[0];
	return plHTileNames[i]
}
const plFHTileNames = {
	0: "Empty",
	box: "Crate",
	grinder: "Grinder",
	distributor: "Distributor",
	refiner: "Refiner",
	pipe: "Pipe"
}
function plFHTileName(i) {
	if (i.constructor == Array) i = i[0];
	return plFHTileNames[i]
}


function plHTileBuyable(i) {
	switch (i) {
		case "Tree Farm": 
		return 11;
		case "Mine":
		return 12;
		case "Oil Rig":
		return 13;
		case "Laboratory":
		return 14;
		default:
		return 22;
	}
}
function plHFTileBuyable(i) {
	switch (i) {
		case "Crate":
		return 41;
		case "Grinder":
		return 42;
		case "Distributor":
		return 43;
		case "Refiner":
		return 44;
		case "Pipe":
		return 50;
		default:
		return 51;
	}
}
function getPlHDesc(i) {
	switch(i) {
		case "Tree Farm":
		return "Produces 1 wood every 5 seconds.";
		case "Mine":
		return "Produces 1 metal every 10 seconds.";
		case "Oil Rig":
		return "Produces 1 oil every 15 seconds.";
		case "Laboratory":
		return "Gives access to researches.";
		case "Fertilizer Factory":
		return "Boosts all adjacent farms (including diagonally)."
		default:
		return "An empty tile. Does nothing.";
	}
}
function getPlHFDesc(i) {
	switch(i) {
		case "Crate":
		return "Holds wood.";
		case "Grinder":
		return "Cuts any materials it's given into smaller fragments.";
		case "Distributor":
		return `Boosts farms next to the factory, consuming 0.5 of each fertilizer per second.`;
		case "Refiner":
		return `Produces 0.05 chemical fertilizer every second for each mine.`;
		case "Pipe":
		return `Transports materials.`;
		default:
		return "An empty tile. Does nothing.";
	}
}

let plFHCurrencies = ["Wood", "Mulch", "Chemical Fertilizer", "Super-Fertilizer", "Ammonium Nitrate"]
function plFHTextureName(tile, i, j) {
	let fgrid = plHFGrid.grid;
	let tData = plHFGrid.getData(i, j);
	switch (tile[0]) {
		case "box":
		Vue.set(tData, 0, (tData[1].Wood.lte(0) ? "empty" : "full"));
		break;
		case "grinder":
		Vue.set(tData, 0, (tData[1].Wood.gt(0) && tData[1].Mulch.lt(tmp.plHome.fMaxAmt.Grinder.Mulch))?"active":"inactive");
		break;
		case "distributor":
		Vue.set(tData, 0, (tile[1][1].Mulch.gt(0))?"active":"inactive");
		break;
		case "refiner":
		Vue.set(tData, 0, (tile[1][1]["Ammonium Nitrate"].lt(tmp.plHome.fMaxAmt.Refiner["Ammonium Nitrate"]))?"active":"inactive");
		break;
		case "pipe":
		let textureStr = "";
		textureStr += (fgrid[i-1] && fgrid[i-1][j] && pipeConnectConditions(i-1, j, tile[1][2])) ? "1" : "0";
		textureStr += (fgrid[i][j+1] && pipeConnectConditions(i, j+1, tile[1][2])) ? "1" : "0";
		textureStr += (fgrid[i+1] && fgrid[i+1][j] && pipeConnectConditions(i+1, j, tile[1][2])) ? "1" : "0";
		textureStr += (fgrid[i][j-1] && pipeConnectConditions(i, j-1, tile[1][2])) ? "1" : "0";
		Vue.set(tData, 0, textureStr);
	}
}
function pipeConnectConditions(i, j, currName) {
	let grid = plHFGrid.grid;
	if (currName == "None") return false; 
	if (grid[i][j][0] == "pipe") {
		return grid[i][j][1][2] == currName;
	} else {
		return plFHTCan("take", grid[i][j], currName) || plFHTCan("give", grid[i][j], currName);
	}
}
function getPlFHMax(name, curr) {
	if (!tmp.plHome.fMaxAmt[name]) name = plFHTileName(name);
	return tmp.plHome.fMaxAmt[name][curr] ? tmp.plHome.fMaxAmt[name][curr] : tmp.plHome.fMaxAmt[name].generally;
}
function isShowCurrency(tile, curr) {
	switch(tile[0]) {
		case "pipe":
		return tmp.plHome.fUnlockedCurrency[curr] && tile[1][2] == curr;
		default:
		return tmp.plHome.fUnlockedCurrency[curr]
	}
}

function getQueryCurrencies() {
	return {
		box: [],
		grinder: [["Wood", 15]],
		distributor: [["Mulch", 1], ["Chemical Fertilizer", 1], ["Super-Fertilizer", 1]],
		refiner: [],
		pipe: [["Wood", 40], ["Mulch", 40], ["Chemical Fertilizer", 40], ["Super-Fertilizer", 40], ["Ammonium Nitrate", 40]]
	}
}
queryCurrencies = {
	box: [],
	grinder: [["Wood", 15]],
	distributor: [["Mulch", 1], ["Chemical Fertilizer", 1], ["Super-Fertilizer", 1]],
	refiner: [],
	pipe: [["Wood", 40], ["Mulch", 40], ["Chemical Fertilizer", 40], ["Super-Fertilizer", 40], ["Ammonium Nitrate", 40]]
}

function queryPlFHTile(tile, i, j, diff) {
	if (!tile) return;

	let fgrid = plHFGrid.grid;

	let top = i >= 1, bottom = i <= 7,
	left = j >= 1, right = j <= 7;

	let dirs = [];

	let name = tile[0];

	plFHTextureName(tile, i, j);

	let currs = queryCurrencies[name];
	currs = currs.filter(_=> plFHTCan("take", tile, _[0]));

	for (currency in currs) {
		dirs = [];
		let curr = currs[currency][0];
		let curAmt = currs[currency][1];
		if (tile[1][1].curr == undefined) tile[1][1].curr = decimalZero;

		if (top && fgrid[i-1][j] && plFHTCan("give", fgrid[i-1][j], curr))
			dirs.push("t");
		if (bottom && fgrid[i+1][j] && plFHTCan("give", fgrid[i+1][j], curr))
			dirs.push("b");
		if (left && fgrid[i][j-1] && plFHTCan("give", fgrid[i][j-1], curr))
			dirs.push("l");
		if (right && fgrid[i][j+1] && plFHTCan("give", fgrid[i][j+1], curr))
			dirs.push("r");

		for (k in dirs) {
			let ival=i, jval=j;
			switch (dirs[k]) {
				case "t": ival = i-1; break
				case "b": ival = i+1; break
				case "l": jval = j-1; break
				case "r": jval = j+1; break
			}

			let otherTile = fgrid[ival][jval];

			let otherC = otherTile[1][1],
			    thisC = tile[1][1]

			if (!otherC[curr]) otherC[curr] = decimalZero;
			if (!thisC[curr]) thisC[curr] = decimalZero;

			let prevCurr = otherC[curr];

			if (plFHTCan("take", otherTile, curr) && plFHTCan("give", tile, curr) && !prevCurr.gte(thisC[curr].add(curAmt*diff))) {
				if (thisC[curr].gte(prevCurr.add(curAmt*diff))) {
					otherC[curr] = prevCurr.add(Decimal.sub(getPlFHMax(name, curr), otherC[curr]).min(curAmt*diff).min(thisC[curr])).unFuck();
					prevCurr = prevCurr.sub(otherC[curr]);

					thisC[curr] = thisC[curr].add(prevCurr).unFuck();
				} else {
					let avg = prevCurr.add(thisC[curr]).div(2);
					otherC[curr] = avg;
					thisC[curr] = avg;
				}
			} else {
				otherC[curr] = prevCurr.sub(Decimal.sub(getPlFHMax(name, curr), thisC[curr]).min(curAmt*diff).min(prevCurr)).unFuck();
				prevCurr = prevCurr.sub(otherC[curr]);

				thisC[curr] = thisC[curr].add(prevCurr).unFuck();
			}
		}
	}
}
let tUtils = {
	plH: {
		tileName: ["Empty", "Tree Farm", "Mine", "Oil Rig", "Laboratory", "Fertilizer Factory"],
		descs: ["An empty tile. Does nothing.",
		"Produces 1 wood every 5 seconds.",
		"Produces 1 metal every 10 seconds.",
		"Produces 1 oil every 15 seconds.",
		"Gives access to researches.",
		"Boosts all adjacent tree farms (including diagonals)."],
		corrBuyable: [21, 11, 12, 13, 14, 15],
	},
	plHF: {
		tileName: {
			0: "Empty", box: "Crate", grinder: "Grinder", distributor: "Distributor",
			refiner: "Refiner", pipe: "Pipe"
		},
		descs: {
			0: "An empty tile. Does nothing.",
			box: "Holds wood.",
			grinder: "Grinds any material it's given. See recipe book for more details.",
			distributor: "Adds to the fertilizer boost. See stats below.",
			refiner: "Produces 0.05 ammonium nitrate per second for every mine.",
			pipe: "Transports materials of a certain type."
		},
		corrBuyable: {
			0: 51, box: 41, grinder: 42, distributor: 43,
			refiner: 44, pipe: 50
		}
	}
}

let recipeBook = {
	recipes: {
		grinder: [
			{
				input: ["Wood", 10],
				output: ["Mulch", 2],
				canCraft() {
					return true
				}
			}
		]
	},
	showing: "grinder"
}