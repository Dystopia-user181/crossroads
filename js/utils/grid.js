function Grid(gridObj, selected) {
	this.grid = gridObj;
	this.selectedNumber = selected;
	this.x = Math.floor((selected??0)/10);
	this.y = (selected??0)%10;
	this.s = this.grid[Math.floor((selected??0)/10)][(selected??0)%10];
}

Grid.prototype.select = function (x, y) {
	this.selectedNumber = x*10+y;
	this.x = x;
	this.y = y;
	this.s = this.grid[x][y];
}

Grid.prototype.get = function (x, y) {
	if (x < 0 || x >= this.grid.length || y < 0 || y >= this.grid[x].length) return 0;
	else return this.grid[x][y];
}

Grid.prototype.set = function (x, y, v) {
	if (x < 0 || x >= this.grid.length || y < 0 || y >= this.grid[x].length) return;
	Vue.set(this.grid[x], y, v);
}

Grid.prototype.getName = function (x, y) {
	let tile = this.grid[x][y];
	return Array.isArray(tile) ? tile[0] : tile;
}

Grid.prototype.getData = function (x, y) {
	if (x < 0 || x >= this.grid.length || y < 0 || y >= this.grid[x].length || !Array.isArray(this.grid[x][y]) || this.grid[x][y] == undefined) return 0;
	else return this.grid[x][y][1];
}

Grid.prototype.setData = function (x, y, v) {
	if (x < 0 || x >= this.grid.length || y < 0 || y >= this.grid[x].length || !Array.isArray(this.grid[x][y]) || this.grid[x][y] == undefined) return;
	Vue.set(this.grid[x][y], 1, v);
}

Object.defineProperty(Grid.prototype, "selected", {
	get() {
		return this.s;
	},
	set(v) {
		Vue.set(this.grid[this.x], this.y, v);
		this.s = v;
	}
})
Object.defineProperty(Grid.prototype, "sNum", {
	get() {
		return this.selectedNumber;
	}
})

Object.defineProperty(Grid.prototype, "name", {
	get() {
		return Array.isArray(this.s) ? this.s[0] : this.s;
	}
})

Object.defineProperty(Grid.prototype, "data", {
	get() {
		return Array.isArray(this.s) && this.s[1] != undefined ? this.s[1] : 0
	},
	set(v) {
		if (Array.isArray(this.selected) && this.s[1] != undefined) {
			Vue.set(this.grid[this.x][this.y], 1, v);
			this.s[1] = v;
		}
	}
})