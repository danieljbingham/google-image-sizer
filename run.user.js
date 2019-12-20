// ==UserScript==
// @name         Google image sizer
// @namespace    https://github.com/danieljbingham/google-image-sizer
// @version      1.0.3.1
// @description  re-implement Google Images size filter
// @author       Daniel Bingham
// @include      http*://*.google.tld/search*tbm=isch*
// @grant        none
// ==/UserScript==

(function() {

var sz= /[?&]tbs=(?:[^&]+,)?isz:([^&,]+)/.test(location.search) && RegExp.$1;

/*
Iterate through list of image sizes and add them to the DOM
*/
function addSizes() {
	var icon = document.getElementById("isz_i").parentNode.querySelector(':scope * + .hdtbItm:not([tabindex])');
	var parent = icon.parentNode;
	var sizes = [["isz_2", "2mp"],["isz_4", "4mp"],["isz_6", "6mp"],["isz_8", "8mp"],["isz_10", "10mp"],
		["isz_12", "12mp"],["isz_15", "15mp"],["isz_20", "20mp"],["isz_40", "40mp"],["isz_70", "70mp"]];
	var clone, child, chkAny=false;
	for (var i=0; i < sizes.length; i++) {
		clone = icon.cloneNode(true);
		clone.id = sizes[i][0];
		if (sizes[i][1]==sz) {
			clone.classList.add('hdtbSel');
			child=clone;
			chkAny=true;
			parent.previousSibling.querySelector('.mn-hd-txt').textContent = "Larger than " + sizes[i][1].toUpperCase();
			parent.previousSibling.classList.add('hdtb-tsel');
			}
		else {
			child = clone.firstChild;
			child.href = child.href.replace(/(tbs=(?:[^&]+,)?)isz(:[^&,]+)/, "$1"+"isz:" + sizes[i][1]);
			}
		child.textContent = "Larger than " + sizes[i][1].toUpperCase();

		parent.appendChild(clone);
	}

	var fc = parent.firstElementChild;
	if (chkAny && fc.classList.contains('hdtbSel')) {
		fc.classList.remove('hdtbSel');
		child=icon.firstChild.cloneNode(true);
		child.href= child.href.replace(/(tbs=(?:[^&]+,)?)isz(:[^&,]+)/, "$1");
		child.textContent = fc.textContent;
		fc.textContent='';
		fc.appendChild(child);
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

var maxTries=100;
function chk() {
	if (!document.getElementById('isz_i')) {
		if (maxTries--) setTimeout(chk,100);
		return;
		}
	if (needSizes()) addSizes();
}

if (isImageUrl()) chk();

})();
