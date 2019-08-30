/*
Iterate through list of image sizes and add them to the DOM 
*/
function addSizes() {
	var icon = document.getElementById("isz_i");
	var parent = icon.parentNode;
	var sizes = [["isz_2", "2mp"],["isz_4", "4mp"],["isz_6", "6mp"],["isz_8", "8mp"],["isz_10", "10mp"],
		["isz_12", "12mp"],["isz_15", "15mp"],["isz_20", "20mp"],["isz_40", "40mp"],["isz_70", "70mp"]];
	for (var i=0; i < sizes.length; i++) {
		clone = icon.cloneNode(true);
		clone.id = sizes[i][0];
		child = clone.firstChild;
		href = child.href;
		href = href.replace("tbs=isz:i", "tbs=isz:" + sizes[i][1]);
		clone.firstChild.href = href;
		clone.firstChild.innerHTML = "Larger than " + sizes[i][1].toUpperCase();
		
		parent.appendChild(clone);
	}

}

/*
Check the user is on google images
*/
function isImageUrl() {
	return location.href.includes("tbm=isch");
}

/*
Check sizes not there already
*/
function needSizes() {
	return document.getElementById("isz_i").parentNode.childNodes.length < 6
}

/*
Show sizes/dimensions by default instead of on hover
*/
function showSizesDefault() {
	var css = ".rg_anbg {display: none !important;} .rg_l:hover .rg_anbg {display: block !important;} " +
		".rg_ilmbg {display: block !important;} .rg_l:hover .rg_ilmbg {display: none !important;}";
	var style = document.createElement('style');

	if (style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}

	document.getElementsByTagName('head')[0].appendChild(style);
}

//run script
showSizesDefault();
if (isImageUrl()) {
	var checkExist = setInterval(function() {
		if (document.getElementById("isz_i")) {
			clearInterval(checkExist);
			if (needSizes()) {
				addSizes();
			}
		}
	 }, 100); // check every 100ms
}
