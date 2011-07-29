"use strict";
var $ = function () {
//----------[begin]---------→

//todo добавить остальные методы
if (!Array.isArray) {
	Array.isArray = function (obj) {
		return Object.prototype.toString.call(obj) == "[object Array]";
	};
}

function $(arg) {
	return new $.Node(arg);
}

$.extend = function (target, obj /*, obj1, obj2, …*/) {
	var i, len = arguments.length, prop;
	for (i = 1; i < len; i++) {
		obj = arguments[i];
		for (prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				target[prop] = obj[prop];
			}
		}
	}
	return target;
};

$.extend($, {
	features: new function () {
		var doc = document, node = doc.createElement("div");
		//node.testProperty = "for IE";
		$.extend(this, {
			//elementTraversal: "childElementCount" in node,
			//selectors: "querySelector" in doc,
			//classList: "classList" in node,
			//dataset: "dataset" in node,
			//attrAndProp: !node.getAttribute("testProperty")
		});
	}
});

//constructor
$.Node = function () {

	function $Node(arg) {
		if (typeof arg == "string") {
			this._node = document.getElementById(arg);
		}
		this._node = arg;
		return this._node ? this : null;
	}

	//$.extend($Node, {});

	$.extend($Node.prototype, {
		_node: null,
		_getOrSet: function ($get, $set, args) {
			var arg = args[0], i, len, obj, key;
			if (args.length == 2) {
				return this[$set](arg, args[1]);
			}
			if (typeof arg == "string") {
				return this[$get](arg);
			}
			if (Array.isArray(arg)) {
				i = 0;
				len = arg.length;
				obj = {};
				while (i < len) {
					key = arg[i];
					obj[key] = this[$get](key);
					i++;
				}
				return obj;
			}
			for (key in arg) {
				if (arg.hasOwnProperty(key)) {
					this[$set](key, arg[key]);
				}
			}
			return this;
		},
		parent: function () {
		},
		next: function () {
		},
		prev: function () {
		},
		firstChild: function () {
		},
		lastChild: function () {
		},
		nthChild: function () {
		},
		children: function () {
		},
		descendant: function () {
		},
		descendants: function () {
		},
		append: function () {
		},
		prepend: function () {
		},
		appendTo: function () {
		},
		prependTo: function () {
		},
		insertAfter: function () {
		},
		insertBefore: function () {
		},
		setProp: function () {
		},
		getProp: function () {
		},
		prop: function () {
		},
		removeProp: function () {
		},
		setAttr: function (name, value) {
			//самостоятельно приводим value к string:
			//1)node.setAttribute(name, null) приводит к разным результатам в браузерах
			//2)для IE
			this._node.setAttribute(name, String(value));
			return this;
		},
		getAttr: function (name) {
			var value = this._node.getAttribute(name);
			return value === null ? null : String(value);
		},
		//attr(name, value) и attr({name1: value1, name2, value2, …}) → $node
		//attr(name) → string|null
		//attr([name1, name2, …]) → {name1: string|null, name2: string|null, …}
		attr: function () {
			return this._getOrSet("getAttr", "setAttr", arguments);
		},
		removeAttr: function (name) {
			this._node.removeAttr(name);
			return this;
		},
		//todo сделать преобразование ключей по стандарту,
		//использовать встроенный интерфейс
		//https://developer.mozilla.org/en/DOM/element.dataset
		//http://www.w3.org/TR/html5/elements.html#dom-dataset
		setDataAttr: function (key, value) {
			return this.setAttr("data-" + key, value);
		},
		getDataAttr: function (key) {
			return this.getAttr("data-" + key);
		},
		data: function () {
			return this._getOrSet("getDataAttr", "setDataAttr", arguments);
		},
		removeData: function (key) {
		},
		wrap: function () {
		},
		wrapInner: function () {
		},
		create: function () {
		},
		clone: function () {
		},
		remove: function () {
		},
		empty: function () {
		},
		css: function () {
		},
		toList: function () {
			return new $.NodeList([this._node]);
		}
	});

	return $Node;
}();

//constructor
$.NodeList = function () {

	function $NodeList(arg) {
		this._nodeList = arg;
	}

	//$.extend($NodeList, {});

	$.extend($NodeList.prototype, {
		add: function () {
		},
		each: function () {
		}
	});

	return $NodeList;
}();


//←---------[end]----------
	return $;
}();