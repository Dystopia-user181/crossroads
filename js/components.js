var app;

function loadVue() {
	// data = a function returning the content (actually HTML)
	Vue.component('display-text', {
		props: ['layer', 'data'],
		template: `
			<span class="instant" v-html="data"></span>
		`
	})

// data = a function returning the content (actually HTML)
	Vue.component('raw-html', {
			props: ['layer', 'data'],
			template: `
				<span class="instant"  v-html="data"></span>
			`
		})

	// Blank space, data = optional height in px or pair with width and height in px
	Vue.component('blank', {
		props: ['layer', 'data'],
		template: `
			<div class = "instant">
			<div class = "instant" v-if="!data" v-bind:style="{'width': '8px', 'height': '17px'}"></div>
			<div class = "instant" v-else-if="Array.isArray(data)" v-bind:style="{'width': data[0], 'height': data[1]}"></div>
			<div class = "instant" v-else v-bind:style="{'width': '8px', 'height': data}"><br></div>
			</div>
		`
	})

	// Displays an image, data is the URL
	Vue.component('display-image', {
		props: ['layer', 'data'],
		template: `
			<img class="instant" v-bind:src= "data" v-bind:alt= "data">
		`
	})
		
	// data = an array of Components to be displayed in a row
	Vue.component('row', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `
		<div class="upgTable instant">
			<div class="upgRow">
				<div v-for="(item, index) in data">
				<div v-if="!Array.isArray(item)" v-bind:is="item" :layer= "layer" v-bind:style="tmp[layer].componentStyles[item]" :key="key + '-' + index"></div>
				<div v-else-if="item.length==3" v-bind:style="[tmp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" :key="key + '-' + index"></div>
				<div v-else-if="item.length==2" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" v-bind:style="tmp[layer].componentStyles[item[0]]" :key="key + '-' + index"></div>
				</div>
			</div>
		</div>
		`
	})

	// data = an array of Components to be displayed in a column
	Vue.component('column', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `
		<div class="upgTable instant">
			<div class="upgCol">
				<div v-for="(item, index) in data">
					<div v-if="!Array.isArray(item)" v-bind:is="item" :layer= "layer" v-bind:style="tmp[layer].componentStyles[item]" :key="key + '-' + index"></div>
					<div v-else-if="item.length==3" v-bind:style="[tmp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" :key="key + '-' + index"></div>
					<div v-else-if="item.length==2" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" v-bind:style="tmp[layer].componentStyles[item[0]]" :key="key + '-' + index"></div>
				</div>
			</div>
		</div>
		`
	})

	Vue.component('infobox', {
		props: ['layer', 'data'],
		template: `
		<div class="story instant" v-if="tmp[layer].infoboxes && tmp[layer].infoboxes[data]!== undefined && tmp[layer].infoboxes[data].unlocked" v-bind:style="[{'border-color': tmp[layer].color, 'border-radius': player.infoboxes[layer][data] ? 0 : '8px'}, tmp[layer].infoboxes[data].style]">
			<button class="story-title" v-bind:style="[{'background-color': tmp[layer].color}, tmp[layer].infoboxes[data].titleStyle]"
				v-on:click="player.infoboxes[layer][data] = !player.infoboxes[layer][data]">
				<span class="story-toggle">{{player.infoboxes[layer][data] ? "+" : "-"}}</span>
				<span v-html="tmp[layer].infoboxes[data].title ? tmp[layer].infoboxes[data].title : (tmp[layer].name)"></span>
			</button>
			<div v-if="!player.infoboxes[layer][data]" class="story-text" v-bind:style="tmp[layer].infoboxes[data].bodyStyle">
				<span v-html="tmp[layer].infoboxes[data].body ? tmp[layer].infoboxes[data].body : 'Blah'"></span>
			</div>
		</div>
		`
	})


	// Data = width in px, by default fills the full area
	Vue.component('h-line', {
		props: ['layer', 'data'],
			template:`
				<hr class="instant" v-bind:style="data ? {'width': data} : {}" class="hl">
			`
		})

	// Data = height in px, by default is bad
	Vue.component('v-line', {
		props: ['layer', 'data'],
		template: `
			<div class="instant" v-bind:style="data ? {'height': data} : {}" class="vl2"></div>
		`
	})

	Vue.component('challenges', {
		props: ['layer'],
		template: `
		<div v-if="tmp[layer].challenges" class="upgTable">
			<div v-for="row in tmp[layer].challenges.rows" class="upgRow">
				<div v-for="col in tmp[layer].challenges.cols">
					<challenge v-if="tmp[layer].challenges[row*10+col]!== undefined && tmp[layer].challenges[row*10+col].unlocked" :layer = "layer" :data = "row*10+col" v-bind:style="tmp[layer].componentStyles.challenge"></challenge>
				</div>
			</div>
		</div>
		`
	})

	// data = id
	Vue.component('challenge', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].challenges && tmp[layer].challenges[data]!== undefined && tmp[layer].challenges[data].unlocked && !(player.hideChallenges && maxedChallenge(layer, [data]))" v-bind:class="{hChallenge: true, done: tmp[layer].challenges[data].defaultStyle === 'done', canComplete:tmp[layer].challenges[data].defaultStyle === 'canComplete', locked: tmp[layer].challenges[data].defaultStyle === 'locked'}">
			<br><h3 v-html="tmp[layer].challenges[data].name"></h3><br><br>
			<button v-bind:class="{ longUpg: true, can: true, [layer]: true }" v-bind:style="{'background-color': tmp[layer].color}" v-on:click="startChallenge(layer, data)">{{tmp[layer].challenges[data].buttonText}}</button><br><br>
			<span v-if="tmp[layer].challenges[data].fullDisplay" v-html="tmp[layer].challenges[data].fullDisplay"></span>
			<span v-else>
				<span v-html="tmp[layer].challenges[data].challengeDescription"></span><br>
				Goal:  <span v-if="tmp[layer].challenges[data].goalDescription" v-html="tmp[layer].challenges[data].goalDescription"></span><span v-else>{{format(tmp[layer].challenges[data].goal)}} {{tmp[layer].challenges[data].currencyDisplayName ? tmp[layer].challenges[data].currencyDisplayName : "points"}}</span><br>
				Reward: <span v-html="tmp[layer].challenges[data].rewardDescription"></span><br>
				<span v-if="tmp[layer].challenges[data].rewardEffect!==undefined">Currently: <span v-html="(tmp[layer].challenges[data].rewardDisplay) ? (tmp[layer].challenges[data].rewardDisplay) : format(tmp[layer].challenges[data].rewardEffect)"></span></span>
			</span>
		</div>
		`
	})

	Vue.component('upgrades', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].upgrades" class="upgTable">
			<div v-for="row in (data === undefined ? tmp[layer].upgrades.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].upgrades.cols"><div v-if="tmp[layer].upgrades[row*10+col]!== undefined && tmp[layer].upgrades[row*10+col].unlocked" class="upgAlign">
					<upgrade :layer = "layer" :data = "row*10+col" v-bind:style="tmp[layer].componentStyles.upgrade"></upgrade>
				</div></div>
			</div>
			<br>
		</div>
		`
	})

	// data = id
	Vue.component('upgrade', {
		props: ['layer', 'data'],
		template: `
		<button v-if="tmp[layer].upgrades && tmp[layer].upgrades[data]!== undefined && tmp[layer].upgrades[data].unlocked" v-on:click="buyUpg(layer, data)" v-bind:class="{ [layer]: true, upg: true, bought: hasUpgrade(layer, data), locked: (!(canAffordUpgrade(layer, data))&&!hasUpgrade(layer, data)), can: (canAffordUpgrade(layer, data)&&!hasUpgrade(layer, data))}"
			v-bind:style="[((!hasUpgrade(layer, data) && canAffordUpgrade(layer, data)) ? {'background-color': tmp[layer].color} : {}), tmp[layer].upgrades[data].style]">
			<span v-if="tmp[layer].upgrades[data].fullDisplay" v-html="tmp[layer].upgrades[data].fullDisplay"></span>
			<span v-else>
				<span v-if= "tmp[layer].upgrades[data].title"><h3 v-html="tmp[layer].upgrades[data].title"></h3><br></span>
				<span v-html="tmp[layer].upgrades[data].description"></span>
				<span v-if="tmp[layer].upgrades[data].effectDisplay"><br>Currently: <span v-html="tmp[layer].upgrades[data].effectDisplay"></span></span>
				<br><br>Cost: {{ formatWhole(tmp[layer].upgrades[data].cost) }} {{(tmp[layer].upgrades[data].currencyDisplayName ? tmp[layer].upgrades[data].currencyDisplayName : tmp[layer].resource)}}
			</span>	
			</button>
		`
	})

	Vue.component('milestones', {
		props: ['layer'],
		template: `
		<div v-if="tmp[layer].milestones">
			<table>
				<tr v-for="id in Object.keys(tmp[layer].milestones)"><div v-if="tmp[layer].milestones[id]!== undefined && tmp[layer].milestones[id].unlocked && milestoneShown(layer, id)"
					<milestone :layer = "layer" :data = "id" v-bind:style="tmp[layer].componentStyles.milestone"></milestone>
				</tr></div>
			</table>
			<br>
		</div>
		`
	})

	// data = id
	Vue.component('milestone', {
		props: ['layer', 'data'],
		template: `
		<td v-if="tmp[layer].milestones && tmp[layer].milestones[data]!== undefined && milestoneShown(layer, data)" v-bind:style="[(!tmp[layer].milestones[data].unlocked) ? {'visibility': 'hidden'} : {}, tmp[layer].milestones[data].style]" v-bind:class="{milestone: !hasMilestone(layer, data), milestoneDone: hasMilestone(layer, data)}">
			<h3 v-html="tmp[layer].milestones[data].requirementDescription"></h3><br>
			<span v-html="tmp[layer].milestones[data].effectDescription"></span><br>
		<span v-if="(tmp[layer].milestones[data].toggles)&&(hasMilestone(layer, data))" v-for="toggle in tmp[layer].milestones[data].toggles"><toggle :layer= "layer" :data= "toggle" v-bind:style="tmp[layer].componentStyles.toggle"></toggle>&nbsp;</span></td></tr>
		`
	})

	Vue.component('toggle', {
		props: ['layer', 'data'],
		template: `
		<button class="smallUpg can" v-bind:style="{'background-color': tmp[data[0]].color}" v-on:click="toggleAuto(data)">{{player[data[0]][data[1]]?"ON":"OFF"}}</button>
		`
	})

	// data = function to return the text describing the reset before the amount gained (optional)
	Vue.component('prestige-button', {
		props: ['layer', 'data'],
		template: `
		<button v-if="(tmp[layer].type !== 'none')" v-bind:class="{ [layer]: true, reset: true, locked: !tmp[layer].canReset, can: tmp[layer].canReset}"
			v-bind:style="[tmp[layer].canReset ? {'background-color': tmp[layer].color} : {}, tmp[layer].componentStyles['prestige-button']]"
			v-html="tmp[layer].prestigeButtonText" v-on:click="doReset(layer)">
		</button>
		`
	
	})

	// Displays the main resource for the layer
	Vue.component('main-display', {
		props: ['layer'],
		template: `
		<div><span v-if="player[layer].points.lt('1e1000')">You have </span><h2 v-bind:style="{'color': tmp[layer].color, 'text-shadow': '0px 0px 10px'}">{{formatWhole(player[layer].points)}}</h2> {{tmp[layer].resource}}<span v-if="tmp[layer].effectDescription">, <span v-html="tmp[layer].effectDescription"></span></span><br><br></div>
		`
	})

	Vue.component('custom-display', {
		props: ['layer', 'data'],
		template: `
		<div>
			<span v-if="data&&data[0]?data[0].lt('1e1000'):player[layer].points.lt('1e1000')">You have </span>
			<h2 v-bind:style="{'color': data&&data[1]?data[1]:tmp[layer].color, 'text-shadow': '0px 0px 10px'}">{{formatWhole(data&&data[0]?data[0]:player[layer].points)}}</h2> {{data&&data[2]?data[2]:tmp[layer].resource}}
			<span v-if="data&&data[3]?data[3]:tmp[layer].effectDescription">, <span v-html="tmp[layer].effectDescription"></span></span><br><br></div>
		`
	})

	// Displays the base resource for the layer, as well as the best and total values for the layer's currency, if tracked
	Vue.component('resource-display', {
		props: ['layer'],
		template: `
		<div style="margin-top: -13px">
			<span><br>You have {{formatWhole(tmp[layer].baseAmount)}} {{tmp[layer].baseResource}}</span>
			<span v-if="tmp[layer].passiveGeneration"><br>You are gaining {{formatWhole(tmp[layer].resetGain.times(tmp[layer].passiveGeneration))}} {{tmp[layer].resource}} per second</span>
			<br><br>
			<span v-if="tmp[layer].showBest">Your best {{tmp[layer].resource}} is {{formatWhole(player[layer].best)}}<br></span>
			<span v-if="tmp[layer].showTotal">You have made a total of {{formatWhole(player[layer].total)}} {{tmp[layer].resource}}<br></span>
		</div>
		`
	})

	// data = button size, in px
	Vue.component('buyables', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].buyables" class="upgTable">
			<respec-button v-if="tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)" :layer = "layer" v-bind:style="[{'margin-bottom': '12px'}, tmp[layer].componentStyles['respec-button']]"></respec-button>
			<div v-for="row in tmp[layer].buyables.rows" class="upgRow">
				<div v-for="col in tmp[layer].buyables.cols"><div v-if="tmp[layer].buyables[row*10+col]!== undefined && tmp[layer].buyables[row*10+col].unlocked" class="upgAlign" v-bind:style="{'height': (data ? data : 'inherit'),}">
					<buyable :layer = "layer" :data = "row*10+col" :size = "data"></buyable>
				</div></div>
			</div>
		</div>
	`
	})

	Vue.component('buyable-row', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].buyables" class="upgTable">
			<respec-button v-if="tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)" :layer = "layer" v-bind:style="[{'margin-bottom': '12px'}, tmp[layer].componentStyles['respec-button']]"></respec-button>
			<div class="upgRow">
				<div v-for="col in tmp[layer].buyables.cols"><div v-if="tmp[layer].buyables[data*10+col]!== undefined && tmp[layer].buyables[data*10+col].unlocked" class="upgAlign">
					<buyable :layer = "layer" :data = "data*10+col" :size = "data"></buyable>
				</div></div>
			</div>
		</div>
	`
	})

	// data = id of buyable
	Vue.component('buyable', {
		props: ['layer', 'data', 'size'],
		computed: {
			changeStyle: function () {
				return tmp[this.layer].buyables[this.data].changeStyle != undefined ? tmp[this.layer].buyables[this.data].changeStyle : tmp[this.layer].changeBuyableStyle
			}
		},
		template: `
		<div v-if="tmp[layer].buyables && tmp[layer].buyables[data]!== undefined && tmp[layer].buyables[data].unlocked" style="display: grid">
			<button v-bind:class="{ buyable: !changeStyle, buyable2: changeStyle,
				can: tmp[layer].buyables[data].canAfford,
				locked: !tmp[layer].buyables[data].canAfford && !changeStyle,
				locked2: !tmp[layer].buyables[data].canAfford && changeStyle,
				[layer]: true, }"
			v-bind:style="[tmp[layer].buyables[data].canAfford ?
			{'background': (tmp[layer].buyables[data].color || tmp[layer].color) + (changeStyle ? '66' : '')} : {},
			size ? {'height': size, 'width': size} : {},
			tmp[layer].componentStyles.buyable,
			tmp[layer].buyables[data].style,
			changeStyle ? {transform: 'none'} : {}]"
			v-on:click="buyBuyable(layer, data)">
				<span v-if= "tmp[layer].buyables[data].title"><h2 v-html="tmp[layer].buyables[data].title"></h2><br></span>
				<span v-bind:style="{'white-space': 'pre-line'}" v-html="tmp[layer].buyables[data].display"></span>
			</button>
			<br v-if="(tmp[layer].buyables[data].sellOne !== undefined && !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)) || (tmp[layer].buyables[data].sellAll && !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false))">
			<sell-one :layer="layer" :data="data" v-bind:style="tmp[layer].componentStyles['sell-one']" v-if="(tmp[layer].buyables[data].sellOne)&& !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)"></sell-one>
			<sell-all :layer="layer" :data="data" v-bind:style="tmp[layer].componentStyles['sell-all']" v-if="(tmp[layer].buyables[data].sellAll)&& !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false)"></sell-all>
		</div>
		`
	})

	Vue.component('respec-button', {
		props: ['layer', 'data'],
		template: `
			<button v-if="tmp[layer].buyables && tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)" v-on:click="respecBuyables(layer)" v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].buyables.respecText ? tmp[layer].buyables.respecText : "Respec"}}</button>
	`
	})

	// data = button size, in px
	Vue.component('clickables', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].clickables" class="upgTable">
			<master-button v-if="tmp[layer].clickables.masterButtonPress && !(tmp[layer].clickables.showMasterButton !== undefined && tmp[layer].clickables.showMasterButton == false)" :layer = "layer" v-bind:style="[{'margin-bottom': '12px'}, tmp[layer].componentStyles['master-button']]"></master-button>
			<div v-for="row in tmp[layer].clickables.rows" class="upgRow">
				<div v-for="col in tmp[layer].clickables.cols"><div v-if="tmp[layer].clickables[row*10+col]!== undefined && tmp[layer].clickables[row*10+col].unlocked" class="upgAlign" v-bind:style="{'margin-left': '7px', 'margin-right': '7px',  'height': (data ? data : 'inherit'),}">
					<clickable :layer = "layer" :data = "row*10+col" :size = "data" v-bind:style="tmp[layer].componentStyles.clickable"></clickable>
				</div></div>
				<br>
			</div>
		</div>
	`
	})

	// data = id of clickable
	Vue.component('clickable', {
		props: ['layer', 'data', 'size'],
		template: `
		<button 
			v-if="tmp[layer].clickables && tmp[layer].clickables[data]!== undefined && tmp[layer].clickables[data].unlocked" 
			v-bind:class="{ upg: true, can: tmp[layer].clickables[data].canClick, locked: !tmp[layer].clickables[data].canClick}"
			v-bind:style="[tmp[layer].clickables[data].canClick ? {'background': tmp[layer].clickables[data].style&&tmp[layer].clickables[data].style.background?tmp[layer].clickables[data].style.background:tmp[layer].color} : {}, size ? {'height': size, 'width': size} : {}, tmp[layer].clickables[data].style, {position: 'relative', overflow: 'hidden'}]"
			v-on:click="clickClickable(layer, data)">
			<div style="z-index: 999; position: relative"><span v-if="tmp[layer].clickables[data].title"><h2 style="z-index: 999;" v-html="tmp[layer].clickables[data].title"></h2><br></span>
			<span v-bind:style="{'white-space': 'pre-line', 'z-index': 999}" v-html="tmp[layer].clickables[data].display"></span></div>
			<div v-if="(tmp[layer].clickables[data].bar != undefined) && tmp[layer].clickables[data].bar.constructor == Number && tmp[layer].clickables[data].canClick" :style="{backgroundColor: tmp[layer].clickables[data].barColor, height: 116*tmp[layer].clickables[data].bar+'px', bottom: 0, position: 'absolute', width: '300px', left: '0', transform: 'translate(-20px, 2px)', zIndex: 1, transition: 'all 0.2s'}"></div>
		</button>
		`
	})

	Vue.component('master-button', {
		props: ['layer', 'data'],
		template: `
		<button v-if="tmp[layer].clickables && tmp[layer].clickables.masterButtonPress && !(tmp[layer].clickables.showMasterButton !== undefined && tmp[layer].clickables.showMasterButton == false)"
			v-on:click="run(tmp[layer].clickables.masterButtonPress, tmp[layer].clickables)" v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].clickables.masterButtonText ? tmp[layer].clickables.masterButtonText : "Click me!"}}</button>
	`
	})

	// data = button size, in px
	Vue.component('microtabs', {
		props: ['layer', 'data'],
		computed: {
			currentTab() {return player.subtabs[layer][data]}
		},
		template: `
		<div v-if="tmp[layer].microtabs" :style="{'border-style': 'solid'}">
			<div class="upgTable instant">
				<tab-buttons :layer="layer" :data="tmp[layer].microtabs[data]" :name="data" v-bind:style="tmp[layer].componentStyles['tab-buttons']"></tab-buttons>
			</div>
			<layer-tab v-if="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :layer="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :embedded="true"></layer-tab>

			<column v-else v-bind:style="tmp[layer].microtabs[data][player.subtabs[layer][data]].style" :layer="layer" :data="tmp[layer].microtabs[data][player.subtabs[layer][data]].content"></column>
		</div>
		`
	})


	// data = id of the bar
	Vue.component('bar', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].bars && tmp[layer].bars[data].unlocked" v-bind:style="{'position': 'relative'}"><div v-bind:style="[tmp[layer].bars[data].style, tmp[layer].bars[data].dims, {'display': 'table'}]">
			<div class = "overlayTextContainer barBorder" v-bind:style="[tmp[layer].bars[data].borderStyle, tmp[layer].bars[data].dims]">
				<span class = "overlayText" v-bind:style="[tmp[layer].bars[data].style, tmp[layer].bars[data].textStyle]" v-html="tmp[layer].bars[data].display"></span>
			</div>
			<div class ="barBG barBorder" v-bind:style="[tmp[layer].bars[data].style, tmp[layer].bars[data].baseStyle, tmp[layer].bars[data].borderStyle,  tmp[layer].bars[data].dims]">
				<div class ="fill" v-bind:style="[tmp[layer].bars[data].style, tmp[layer].bars[data].fillStyle, tmp[layer].bars[data].fillDims]"></div>
			</div>
		</div></div>
		`
	})


	Vue.component('achievements', {
		props: ['layer'],
		template: `
		<div v-if="tmp[layer].achievements" class="upgTable">
			<div v-for="row in tmp[layer].achievements.rows" class="upgRow">
				<div v-for="col in tmp[layer].achievements.cols"><div v-if="tmp[layer].achievements[row*10+col]!== undefined && tmp[layer].achievements[row*10+col].unlocked" class="upgAlign">
					<achievement :layer = "layer" :data = "row*10+col" v-bind:style="tmp[layer].componentStyles.achievement"></achievement>
				</div></div>
			</div>
			<br>
		</div>
		`
	})

	// data = id
	Vue.component('achievement', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].achievements && tmp[layer].achievements[data]!== undefined && tmp[layer].achievements[data].unlocked" v-bind:class="{ [layer]: true, achievement: true, locked: !hasAchievement(layer, data), bought: hasAchievement(layer, data)}"
			v-bind:tooltip="
				(tmp[layer].achievements[data].tooltip == '') ? false : hasAchievement(layer, data) ? (tmp[layer].achievements[data].doneTooltip ? tmp[layer].achievements[data].doneTooltip : (tmp[layer].achievements[data].tooltip ? tmp[layer].achievements[data].tooltip : 'You did it!'))
				: (tmp[layer].achievements[data].goalTooltip ? tmp[layer].achievements[data].goalTooltip : (tmp[layer].achievements[data].tooltip ? tmp[layer].achievements[data].tooltip : 'LOCKED'))
			"
			
			v-bind:style="tmp[layer].achievements[data].computedStyle">
			<span v-if= "tmp[layer].achievements[data].name"><br><h3 v-bind:style="tmp[layer].achievements[data].textStyle" v-html="tmp[layer].achievements[data].name"></h3><br></span>
		</div>
		`
	})

	// Data is an array with the structure of the tree
	Vue.component('tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<div>
		<span class="upgRow" v-for="(row, r) in data"><table>
			<span v-for="(node, id) in row" style = "{width: 0px}">
				<tree-node :layer='node' :abb='tmp[node].symbol' :key="key + '-' + r + '-' + id"></tree-node>
			</span>
			<tr><table><button class="treeNode hidden"></button></table></tr>
		</span></div>

	`
	})

	// These are for buyables, data is the id of the corresponding buyable
	Vue.component('sell-one', {
		props: ['layer', 'data'],
		template: `
			<button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellOne && !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)" v-on:click="run(tmp[layer].buyables[data].sellOne, tmp[layer].buyables[data])"
				v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].buyables.sellOneText ? tmp[layer].buyables.sellOneText : "Sell One"}}</button>
	`
	})
	Vue.component('sell-all', {
		props: ['layer', 'data'],
		template: `
			<button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellAll && !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false)" v-on:click="run(tmp[layer].buyables[data].sellAll, tmp[layer].buyables[data])"
				v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].buyables.sellAllText ? tmp[layer].buyables.sellAllText : "Sell All"}}</button>
	`
	})

	Vue.component('placement-grid', {
		template: `<div v-if="player.plHome.total.gte(10)">
		<div style="width: 736px; border: 2px solid white; background-color: #fff2; text-align: left; display: flex; align-items: stretch">
				<div style="margin: 0; border-right: 2px solid #fff; width: 140px;">
					<div style="text-align: left;">
						<div style="font-size: 18px; padding: 5px; border-bottom: 2px solid #fff;">{{tmp.plHome.tileName}}<br></div>
						<div style="padding: 3px; text-align: left">
							<span v-html="tUtils.plH.descs[plHGrid.name]"></span>
						</div>
					</div>
				</div>
				<div style="display: flex; flex-direction: column; align-items: center">
					<div v-for="(row, rowN) in player.plHome.grid">
						<div style="display: flex"><div v-for="(id, idN) in row" :class="{'grid-tile': true, selected: plHGrid.x == rowN && plHGrid.y == idN, upgradeable: layers.plHome.buyables[21].canAfford(rowN, idN)}"
						@click="player.plHome.selected = rowN*10+idN;
						plHGrid.select(rowN, idN);
						if (player.plHome.picked[0] && !id) {
							plHGrid.selected = player.plHome.picked;
							player.plHome.picked = [0, new Decimal(0)];
						}
						tmp.plHome.tileName = layers.plHome.tileName();
						updateBuyableTemp('plHome');">
							<span v-if="plHGrid.getData(rowN, idN) && plHGrid.getData(rowN, idN).gte(1)" style="padding: 2px 0; margin-right: 100%; position: absolute">
								{{formatWhole(plHGrid.getData(rowN, idN).add(1))}}
							</span>
							<img :src="'assets/plHome/grid' + plHGrid.getName(rowN, idN) + '.png'" />
						</div></div>
					</div>
				</div>
				<div style="width: 128px; padding: 5px; border-left: 2px #fff solid; margin: 0">
					<column :layer="'plHome'" :data="[['buyable', 21], ['blank', '2px'], ['buyable', 22], ['blank', '2px'], ['buyable', 23], ['blank', '2px'], ['buyable', 24]]"></column>
				</div>
			</div>
		</div>`,
	})
	Vue.component('placement-grid-fertilizer', {
		template: `<div style="display: flex; flex-direction: column; align-items: center;">
			<h3>Any placed fertilizer factory boosts the production of adjacent tree farms by x{{format(player.plHome.fConstant, 1)}}.</h3><br><br>
			<div style="width: 736px; border: 2px solid white; background-color: #fff2; text-align: left; display: flex; align-items: stretch">
				<div style="margin: 0; border-right: 2px solid #fff; width: 140px;">
					<div style="height: 50%; text-align: left; border-bottom: 2px solid #fff">
						<div style="font-size: 18px; padding: 5px; border-bottom: 2px solid #fff;">{{tmp.plHome.fTileName}}</div>
						<div style="padding: 3px; text-align: left; font-size: 14px;">
							<span v-html="tUtils.plHF.descs[plHFGrid.name]"></span>
							<blank></blank>
							<div v-if="plHFGrid.s != 0">
								<div v-for="(amt, n) in plHFGrid.data[1]" style="text-align: left">
									<span v-if="isShowCurrency(plHFGrid.s, n)">{{n}}: {{formatWhole(amt)}}/{{formatWhole(getPlFHMax(plHFGrid.s[0], n))}}</span>
								</div>
							</div>
						</div>
					</div>
					<div style="height: 50%; text-align: left; padding: 3px; font-size: 14px;">
						Each distributor with fertilizer adds to the boost.
						<br><br>
						<span style="font-size: 18px">Stats: <br></span>
						<span v-for="(potency, name) in tmp.plHome.fertilizerPotency">
							<span v-if="tmp.plHome.fUnlockedCurrency[name]">{{name}}: +{{potency}}<br></span>
						</span>
					</div>
				</div>
				<div>
					<div v-for="(row, rowN) in player.plHome.fgrid">
						<div style="display: flex">
							<div v-for="(id, idN) in row"
								:class="{'grid-tile': true, selected: plHFGrid.x == rowN && plHFGrid.y == idN}"
								style="position: relative;"
								@click="player.plHome.fselected = rowN*10+idN;
								plHFGrid.select(rowN, idN);
								if (player.plHome.fpicked[0] && !id) {
									plHFGrid.selected = player.plHome.fpicked
									player.plHome.fpicked = 0;
								}
								tmp.plHome.fTileName = layers.plHome.fTileName();
								updateBuyableTemp('plHome');">
								<img :src="'assets/fertiliser/grid' + (id ? id[0] + id[1][0] : id) + '.png'" />
							</div>
						</div>
					</div>
				</div>
				<div style="width: 128px; padding: 5px; border-left: 2px #fff solid; margin: 0;
				display: flex; flex-direction: column; align-items: center; justify-content: flex-start;">
					<button style="color: #fff; background: #0000; border: 2px solid; cursor: pointer; transform: none; margin: 0 0 20px 0"
					class="can" onclick="Modal.show('Recipes', '', 'recipe-book')">Show Recipe Book</button>
					<column :layer="'plHome'" :data="[['buyable', 51], ['blank', '2px'], ['buyable', 52], ['blank', '2px'], ['buyable', 53]]""></column>
					<div v-if="plHFGrid.s && plHFGrid.name == 'pipe'" class="buyable2 can" style="
						background-color: #77aa7066;
						transform: none;
						width: 100px;
						height: 110px;
						padding: 1px 6px;
						display: flex;
						flex-direction: column;
						justify-content: center;
						margin-left: 3px;
						cursor: default;">
						<div>
							<span><h2>Configure Pipe</h2><br></span>
							<span>
								Currently, the pipe is transporting <blank :data="'6px'"></blank> <fpipe-config></fpipe-config>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div id="testing" style="height: 30px; width: 10px"></div>
		</div>`
	})

	Vue.component('fpipe-config', {
		computed: {
			listOfCurrs() {
				console.log("test")
				return ["None"].concat(plFHCurrencies.filter(_ => tmp.plHome.fUnlockedCurrency[_]));
			},
			selected() {
				console.log("test");
				return plHFGrid.s[1][2];
			}
		},
		methods: {
			setPipeConfig() {
				Vue.set(plHFGrid.grid[plHFGrid.x][plHFGrid.y][1], 2, player.plHome.fPipeConfig);
				app.$forceUpdate();
			}
		},
		template: `<div style="display: flex; justify-content: center; align-items: center;">
			<span
			@click="console.log((listOfCurrs.indexOf(plHFGrid.data[2]) + listOfCurrs.length - 1) % listOfCurrs.length);
			player.plHome.fPipeConfig = listOfCurrs[(listOfCurrs.indexOf(plHFGrid.data[2]) + listOfCurrs.length - 1) % listOfCurrs.length];
			setPipeConfig();"
			style="vertical-align: center; cursor: pointer; padding: 3px; width: 15px"> <</span>
			<span style="max-width: 80px;"> {{plHFGrid.s[1][2]}} </span>
			<span
			@click="player.plHome.fPipeConfig = listOfCurrs[(listOfCurrs.indexOf(plHFGrid.data[2]) + listOfCurrs.length + 1) % listOfCurrs.length];
			plHFGrid.data[2] = player.plHome.fPipeConfig;"
			style="vertical-align: center; cursor: pointer; padding: 3px; width: 15px">> </span>
		</div>`
	})

	Vue.component('recipe-book', {
		template: `<div>
			<div class="upgRow">
				<button v-for="(r, tab) in recipeBook.recipes" class="tabButton" style="border-color: #77aa70"
				@click="recipeBook.showing = tab;">{{tab[0].toUpperCase() + tab.slice(1)}}</button>
			</div>

			<p style="font-size: 25px;">{{recipeBook.showing[0].toUpperCase() + recipeBook.showing.slice(1)}}</p>
			<img src="assets/fertiliser/gridgrinderactive.png" style="width: 50px; height: 50px;">
			<br>
			<div v-for="recipe in recipeBook.recipes[recipeBook.showing]">
				<p>{{recipe.input[1]}} {{recipe.input[0]}}/s --> {{recipe.output[1]}} {{recipe.output[0]}}/s</p>
			</div>
		</div>`
	})

	// SYSTEM COMPONENTS

	Vue.component('tab-buttons', systemComponents['tab-buttons'])
	Vue.component('tree-node', systemComponents['tree-node'])
	Vue.component('layer-tab', systemComponents['layer-tab'])
	Vue.component('overlay-head', systemComponents['overlay-head'])
	Vue.component('info-tab', systemComponents['info-tab'])
	Vue.component('options-tab', systemComponents['options-tab'])


	app = new Vue({
		el: "#app",
		data: {
			player,
			plHGrid,
			plHFGrid,
			tmp,
			Decimal,
			format,
			formatWhole,
			formatTime,
			focused,
			getThemeName,
			layerunlocked,
			doReset,
			buyUpg,
			startChallenge,
			milestoneShown,
			keepGoing,
			hasUpgrade,
			hasMilestone,
			hasAchievement,
			hasChallenge,
			maxedChallenge,
			inChallenge,
			canAffordUpgrade,
			canCompleteChallenge,
			subtabShouldNotify,
			subtabResetNotify,
			VERSION,
			LAYERS,
			hotkeys,
			activePopups,
			Modal
		},
	})
}