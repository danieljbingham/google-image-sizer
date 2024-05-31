// ==UserScript==
// @name         Google image sizer
// @namespace    https://github.com/danieljbingham/google-image-sizer
// @version      2.0.0
// @description  re-implement Google Images size filter
// @author       Daniel Bingham
// @include      http*://*.google.tld/search*tbm=isch*
// @grant        none
// ==/UserScript==

(function () {

	var sizes = ["2mp", "4mp", "6mp", "8mp", "10mp", "12mp", "15mp", "20mp", "40mp", "70mp"];

	/*
	Add sizes for current Google Images layout
	*/
	function addSizes() {
		// Select the g-menu with the specific jsname attribute
		const menu = document.querySelector('g-menu[jsname="xl07Ob"]');
		console.log("Adding Google Image sizes...")

		// Check if the menu exists
		if (menu) {
			// Select the last g-menu-item within this menu
			const lastMenuItem = menu.querySelector('g-menu-item:last-child');

			// Url size param
			const sizeParameter = window.location.href.match(/imgsz=([^&]+)/);
			const currentSize = sizeParameter && sizeParameter.length > 1 ? sizeParameter[1] : null
			console.log(`Current URL is ${currentSize}`);

			const checkedMenuItem = menu.querySelector('g-menu-item div[aria-checked="true"]').closest('g-menu-item');

			if (currentSize) {
				// Uncheck any aria-checked nodes
				const checkedNodes = menu.querySelectorAll('[aria-checked="true"]');
				checkedNodes.forEach(node => node.setAttribute('aria-checked', 'false'));
			}

			sizes.forEach(size => {

				if (currentSize == size) {
					console.log(`${size} should be checked`)

					const newMenuItem = checkedMenuItem.cloneNode(true);
					console.log("newMenuItem")
					console.log(newMenuItem)
					const newAnchor = newMenuItem.querySelector('.y0fQ9c');
					newAnchor.textContent = `Larger than ${size}`;
					newAnchor.setAttribute('aria-checked', 'true');

					menu.appendChild(newMenuItem);
				} else {
					console.log(`${size} should NOT be checked`)

					const newMenuItem = lastMenuItem.cloneNode(true);
					const newAnchor = newMenuItem.querySelector('a');
					newAnchor.href = newAnchor.href.replace(/tbs=isz:[^&]+/, "imgsz=" + size);

					// Remove all occurrences of tbs=isz: and imgsz=
					newAnchor.href = newAnchor.href.replace(/(tbs=isz:[^&]+|imgsz=[^&]+)/g, "");

					// Append the new imgsz parameter
					newAnchor.href += (newAnchor.href.includes("?") ? "&" : "?") + "imgsz=" + size;

					newAnchor.textContent = `Larger than ${size}`;
					newAnchor.setAttribute('aria-checked', 'false');

					menu.appendChild(newMenuItem);
				}


				console.log(`New menu item for size ${size} added!`);
			})

		} else {
			console.error('Menu with jsname "xl07Ob" not found.');
		}
	}

	/*
	Check the user is on google images
	*/
	function isImageUrl() {
		return document.querySelector('div[jsname="bVqjv"][selected]') || location.href.includes("tbm=isch");
	}

	/*
	Check sizes not there already
	*/
	function needSizes() {
		var nodes = document.querySelector('g-menu[jsname="xl07Ob"]');
		return nodes && nodes.childNodes.length < 6;
	}

	/*
	Show sizes/dimensions by default instead of on hover
	*/
	function showSizesDefault() {
		var css = ".rg_anbg {display: none !important;} .rg_l:hover .rg_anbg {display: block !important;} " +
			".rg_ilmbg {display: block !important;} .rg_l:hover .rg_ilmbg {display: none !important;}" +
			".h312td.RtIwE {display:block;} .isv-r.MSM1fd:hover .h312td.RtIwE {display: none;}";
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

	var maxTries = 100;
	function chk() {
		// if (!document.getElementById('isz_i') && (!document.querySelector('[aria-label="Large"]')) && (!document.querySelector('.qcTKEe'))) {
		// 	if (maxTries--) setTimeout(chk, 100);
		// 	return;
		// }

		if (needSizes()) addSizes();
	}

	if (isImageUrl()) chk();

})();
