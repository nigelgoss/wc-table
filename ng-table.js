if ($.wc === "undefined") $.wc = {};
$.wc.ngTable = (() => {
	
const style = document.createElement("style"); document.head.appendChild(style);
style.textContent = [
	".ng-table th { position:sticky; top:0; background-color:lightgrey; padding:5px; text-align:left; }",
	".ng-table tbody { border-bottom:1px solid lightgrey; }",
	".ng-table td { padding:5px; }",
].join("\n");

return () => {

	const store = {
		"data": [],
		"shortcuts": [],
		"tbody": null,
		"refresh": null,
		"thead": null,
		"field": null,
		"order": null,
	};

	// ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

	const ele = document.createElement("section");
	ele.className = "ng-table";
	ele.style.overflow = "auto";
	ele.style.border = "1px solid blue";
	ele.style.borderRadius = "5px";
	ele.style.position = "relative";
	
	Object.defineProperties(ele, {
		"thead": {
			"set": $d => { store.thead = $d; setThead(); },
		},
		"tbody": {
			"set": $d => { store.tbody = $d; setTbody(); },
		},
		"data": {
			"set": $d => { store.data = $d; setData(); },
		},
		"shortcuts": {
			"set": $d => { store.shortcuts = $d; setShortcuts(); },
		},
		"refresh": {
			"set": $d => { store.refresh = $d; setRefresh(); },
		},
	});
		
	const nav = document.createElement("div"); ele.appendChild(nav);
	nav.style.backgroundColor = "lightgrey";
	nav.style.padding = "5px";
	nav.style.display = "grid";
	nav.style.gridTemplateColumns = "1fr auto";
	
		const dLeft = document.createElement("div"); nav.appendChild(dLeft);
	
			const inputFilter = document.createElement("input"); dLeft.appendChild(inputFilter);
			inputFilter.type = "text";
			inputFilter.placeholder = "Filter...";
			inputFilter.oninput = () => {
				setData();
			};
		
		const dRight = document.createElement("div"); nav.appendChild(dRight);
		
			const buttonRefresh = document.createElement("button"); dRight.appendChild(buttonRefresh);
			buttonRefresh.textContent = "R";
			buttonRefresh.style.display = "none";
			buttonRefresh.onpointerdown = () => {
				store.refresh();
			};
	
	const table = document.createElement("table"); ele.appendChild(table);
	table.style.borderCollapse = "collapse";
	table.style.width = "100%";
	
	const thead = document.createElement("thead"); table.appendChild(thead);

	// ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

	const fn = {
		"sort": ($ele, $sortFn) => {
			$ele.style.textDecoration = "underline";
			ele.data.sort($sortFn);
			ele.build();
		},
	};
	
	const setThead = () => {
		thead.replaceWith(store.thead(fn));
	};
	
	const setTbody = () => {
		setData();
	};
	
	const setShortcuts = () => {
		
		dLeft.querySelectorAll("button").forEach($v => { $v.remove(); });
		[""].concat(store.shortcuts).forEach($v => {
			const button = document.createElement("button"); dLeft.appendChild(button);
			button.textContent = $v || "X";
			button.onpointerdown = () => {
				inputFilter.value = $v;
				inputFilter.oninput();
			};
		});
		
	};
	
	const setData = () => {
		
		let out = store.data;
		
		if (inputFilter.value !== "") {
	
			const needles = inputFilter.value.toLowerCase().split(" ");

			out = out.filter($v => {

				const haystack = Object.values($v).map($v2 => {
					try {
						return ($v2).toString().toLowerCase();
					} catch (e) {
						return "";
					}
				});

				for (let n = 0; n < needles.length; n++) {
					for (let h = 0; h < haystack.length; h++) {
						if (haystack[h].indexOf(needles[n]) > -1) break;
						if (h === haystack.length - 1) return false;
					};
				}; return true;

			});

		}
	
		table.querySelectorAll("tbody").forEach($v => { $v.remove(); });
		
		if (typeof store.tbody !== "function") return;
		out.forEach($v => {
			table.appendChild(store.tbody($v, fn));
		});
		
	};
	
	const setRefresh = () => {
		buttonRefresh.style.display = (typeof store.refresh === "function") ? "block" : "none";
	};

	return ele;
		
};

})();
