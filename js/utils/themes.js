// ************ Themes ************
const themes = {
	1: "aqua"
};
const theme_names = {
	aqua: "Aqua"
};
function getThemeStyles(theme) {
	switch (theme) {
		case "plains":
		return ["#103010", "rgba(0, 30, 0, 0.75)", "#dfdfdf", "#ffffff", "#bf8f8f"];
		case "aqua":
		return ["#001f3f", "rgba(0, 15, 31, 0.75)", "#bfdfff", "#dfefff", "#c4a7b3"];
		default:
		return ["#103010", "rgba(0, 30, 0, 0.75)", "#dfdfdf", "#ffffff", "#bf8f8f"];
	}
} 
function changeTheme() {
	colors_theme = colors[player.theme || "plains"];
	document.body.style.setProperty('--background', getThemeStyles(player.theme)[0]);
	document.body.style.setProperty('--background_tooltip', getThemeStyles(player.theme)[1]);
	document.body.style.setProperty('--color', getThemeStyles(player.theme)[2]);
	document.body.style.setProperty('--points', getThemeStyles(player.theme)[3]);
	document.body.style.setProperty("--locked", getThemeStyles(player.theme)[4]);
}
function getThemeName() {
	return player.theme ? theme_names[player.theme] : "plains";
}
function switchTheme(theme) {
	player.theme = theme;
	changeTheme();
	resizeCanvas();
}