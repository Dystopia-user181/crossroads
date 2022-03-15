let Modal = {
	show(title, text, bindComponent="", style={}) {
		Modal.data.title = title;
		Modal.data.text = text;
		Modal.data.bind = bindComponent;
		Modal.data.style = style;
		Modal.showing = true;
		setupModalTemp();
	},
	showing: false,
	data: {
		title: "",
		text: "",
		bind: "",
		style: {}
	},
	tmp: {
		title: "",
		text: "",
		bind: "",
		style: {}
	}
};

function setupModalTempData(dataValue, tmpValue, isArr) {
	for (i in dataValue) {
		let item = dataValue[i];
		if (Array.isArray(item)) {
			setupModalTempData(dataValue[i], tmpValue[i], true);
		} else if (item.constructor == Object) {
			setupModalTempData(dataValue[i], tmpValue[i], false);
		} else {
			if (isArr) Vue.set(tmpValue, i, item); 
			else tmpValue[i] = item;
		}
	}
}
function setupModalTemp() {
	setupModalTempData(Modal.data, Modal.tmp, false);
	updateModalTemp();
}
function updateModalTemp() {
	updateTempData(Modal.data, Modal.tmp, false);
}