/**
 * js-core JavaScript framework, version 3a
 * © 2009 Dmitry Korobkin
 * Released under the MIT License
 * More information: http://www.js-core.ru/
 */

/**
 * @deprecated
 */
var element = document.documentElement || document.body; // todo remove this

/**
 * Главный конструктор
 * @constructor
 * @argument {String|HTMLElement} arg Строка с именем идентификатора или ссылка на DOM-элемент
 */
function Core(arg) {
	// Делаем необязательным использование оператора new
	if (!this.isCore) {
		return new Core(arg);
	}
	this.node = Core._id(arg);
	return this;
}

/**
 * Internet Explorer
 * @type Boolean
 */
Core.IE = /*@cc_on!@*/false;

/**
 * Выполняет функцию для каждого элемента массива или свойства объекта.
 * Чтобы прервать цикл, функция должна вернуть false.
 * В случае с объектом, в переборе участвуют только свойства,
 * непосредственно пренадлежащие объекту (hasOwnProperty).
 * @argument {Array|Object} obj Массив или объект
 * @argument {Function} func Функция
 * @argument {Object} [thisObj] Контекст вызова функции (по умолчанию window)
 * @type Array|Object
 * @returns obj
 */
Core.forEach = function forEach(obj, func, thisObj) {
	var length = obj.length, i = -1, key;
	thisObj = thisObj || window;
	if (length === undefined) {
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				// func → function (key, value, object) { this → thisObj }
				if (func.call(thisObj, key, obj[key], obj) === false) {
					break;
				}
			}
		}
	}
	else if (length) {
		while (++i < length) {
			// func → function (element, index, array, length) { this → thisObj }
			if (func.call(thisObj, obj[i], i, obj, length) === false) {
				break;
			}
		}
	}
	return obj;
};

/**
 * Копирует свойства одного объекта в другой.
 * @argument {Object} target Объект, в который копируются свойства
 * @argument {Object} obj Объект, чьи свойства копируются
 * @type Object
 * @returns target
 */
Core.extend = function extend(target, obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			target[key] = obj[key];
		}
	}
	return target;
};

Core.extend(Core, {

	/**
	 *
	 *
	 * @private
	 */
	_cache: {},

	/**
	 *
	 *
	 * @private
	 */
	_attrs: {
		htmlFor: "for",
		className: "class"
	},

	/**
	 *
	 *
	 * @private
	 */
	_id: function _id(arg) {
		return typeof arg == "string" ? this._cache[arg] || (this._cache[arg] = document.getElementById(arg)) : arg;
	},

	/**
	 *
	 *
	 * @private
	 */
	_create: function _create(arg) {
		return typeof arg == "string" ? document.createElement(arg) : arg;
	},

	/**
	 *
	 *
	 * @private
	 */
	_handlers: {
		guid: 1,
		fid: 1,
		createListener: function createListener(guid) {
			return function eventListener(event) {
				Core.forEach(Core._handlers[guid].events[(event || (event = window.event)).type], function informListeners(fid, func) {
					if (func.call(this, event) === false) {
						Core.preventDefault(event);
					}
				}, Core._handlers[guid].node);
			};
		}
	},

	/**
	 *
	 *
	 * @private
	 */
	_toArray: function _toArray(arg) {
		if (typeof arg == "string") {
			var i = -1, j = 0, array = arg.split(" "), length = array.length;
			arg = [];
			while (++i < length) {
				if (array[i]) {
					arg[j++] = array[i];
				}
			}
		}
		return arg;
	},

	isEmpty: function isEmpty(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	},

	/**
	 *
	 *
	 *
	 */
	observe: window.addEventListener ? function observe(node, type, listener) {
		node.addEventListener(type, listener, false);
	} : function observe(node, type, listener) {
		node.attachEvent("on" + type, listener);
	},
	stopObserving: window.removeEventListener ? function stopObserving(node, type, listener) {
		node.removeEventListener(type, listener, false);
	} : function stopObserving(node, type, listener) {
		node.detachEvent("on" + type, listener);
	},
	ready: function ready(ready, list, i) {
		return function (func) {
			if (func) {
				ready ? func() : list.push(func);
			}
			else if (!ready) {
				ready = true;
				var length = list.length;
				while (++i < length) {
					list[i]();
				}
				list = null;
			}
		};
	}(false, [], -1),
	parse: function parse(html) {
		var node = document.createElement("div");
		node.innerHTML = html;
		return new this(node.removeChild(node.firstChild));
	},
	create: function create(tag) {
		return new this(document.createElement(tag));
	},
	tag: function tag(tags) {
		return new this(document).children(tags, true);
	},
	find: function find(attrs, tags) {
		return new this(document).find(attrs, tags);
	},
	findAttr: function findAttr(attr, values, tags) {
		return new this(document).findAttr(attr, values, tags);
	},
	findClass: function findClass(classes, tags) {
		return new this(document).findClass(classes, tags);
	},
	makeArray: Core.IE ? function makeArray(list) {
		var i = -1, length = list.length, array = [];
		while (++i < length) {
			array[i] = list[i];
		}
		return array;
	} : function makeArray(list) {
		return Array.prototype.slice.call(list);
	},
	list: function list(items, filter) {
		if (!this.isCoreList) {
			return new Core.list(items, filter);
		}
		if (filter === false) {
			this.items = items || [];
		}
		else {
			var i = -1, j = 0, k = 0, length = items.length;
			this.items = [];
			while (++i < length) {
				if (items[i].nodeType == 1 && (filter ? filter.call(items[i], j++) : true)) {
					this.items[k++] = items[i];
				}
			}
		}
		return this;
	},
	timer: function timer(time, func, thisObj) {
		return this.isCoreTimer ? Core.extend(this, {time: time, func: func, thisObj: thisObj, enabled: false}) : new Core.timer(time, func, thisObj);
	},
	preventDefault: Core.IE ? function preventDefault(event) {
		event.returnValue = false;
	} : function preventDefault(event) {
		event.preventDefault();
	},
	stopPropagation: Core.IE ? function stopPropagation(event) {
		event.cancelBubble = true;
	} : function stopPropagation(event) {
		event.stopPropagation();
	},
	stop: function stop(event) {
		Core.preventDefault(event);
		Core.stopPropagation(event);
	},
	target: function (target) {
		return function target(event) {
			return event[target];
		};
	}(Core.IE ? "srcElement" : "target"),
	relatedTarget: Core.IE ? function relatedTarget(event) {
		return event.fromElement === event.srcElement ? event.toElement : event.fromElement;
	} : function relatedTarget(event) {
		return event.relatedTarget;
	},
	mouseButton: function (property, middle) {
		return function mouseButton(event) {
			return event[property] < 2 ? 1 : event[property] == middle ? 3 : 2;
		};
	}(Core.IE ? "button" : "which", Core.IE ? 4 : 2),
	trim: String.prototype.trim ? function trim(str) {
		return str.trim();
	} : function trim(str) {
		return str.replace(/^\s+|\s+$/g, "");
	},
	trimLeft: String.prototype.trimLeft ? function trimLeft(str) {
		return str.trimLeft();
	} : function trimLeft(str) {
		return str.replace(/^\s+/, "");
	},
	trimRight: String.prototype.trimRight ? function trimRight(str) {
		return str.trimRight();
	} : function trimRight(str) {
		return str.replace(/\s+$/, "");
	},
	computedStyle: Core.IE ? function computedStyle(node) {
		return node.currentStyle;
	} : function computedStyle(node) {
		return node.ownerDocument.defaultView.getComputedStyle(node, null);
	}
});

(function (calc) { // todo переделать
	if (Core.IE) {
		Core.pageX = function pageX(event) {
			return event.clientX + calc("Left");
		};
		Core.pageY = function pageY(event) {
			return event.clientY + calc("Top");
		};
	}
	else {
		Core.pageX = function pageX(event) {
			return event.pageX;
		};
		Core.pageY = function pageY(event) {
			return event.pageY;
		};
	}
})(function calc(side) {
	return (element["scroll" + side] || 0) - (element["client" + side] || 0);
});

Core.prototype = {
	isCore: true,
	parent: function parent(tag) {
		var node = this.node.parentNode;
		if (tag) {
			tag = tag.toUpperCase();
			do {
				if (node.nodeName.toUpperCase() == tag) {
					break;
				}
				node = node.parentNode;
			}
			while (node);
		}
		return new Core(node);
	},
	append: function append(arg) {
		return new Core(this.node.appendChild(Core._create(arg)));
	},
	prepend: function prepend(arg) {
		return new Core(this.node.insertBefore(Core._create(arg), this.node.firstChild));
	},
	after: function after(arg) {
		return new Core(this.node.parentNode.insertBefore(Core._create(arg), this.node.nextSibling));
	},
	before: function before(arg) {
		return new Core(this.node.parentNode.insertBefore(Core._create(arg), this.node));
	},
	appendTo: function appendTo(arg) {
		(arg = new Core(arg)).node.appendChild(this.node);
		return arg;
	},
	prependTo: function prependTo(arg) {
		(arg = new Core(arg)).node.insertBefore(this.node, arg.node.firstChild);
		return arg;
	},
	insertAfter: function insertAfter(arg) {
		var obj = new Core(arg);
		obj.node.parentNode.insertBefore(this.node, obj.node.nextSibling);
		return obj;
	},
	insertBefore: function insertBefore(arg) {
		var obj = new Core(arg);
		obj.node.parentNode.insertBefore(this.node, obj.node);
		return obj;
	},
	clone: function clone(cloneChild, cloneHandlers) {
		cloneChild = cloneChild !== false;
		cloneHandlers = cloneHandlers !== false;
		var list = cloneChild ? this.children(true).add(this.node) : new Core.list([this.node]), clone, guid, handler, data = {};
		list.each(function temporallyRemoveListeners(index) {
			guid = this.guid;
			this.guid = null;
			if (guid && Core._handlers[guid]) {
				Core.forEach(Core._handlers[guid].events, function unbindListeners(type) {
					Core.stopObserving(this, type, Core._handlers[guid].listener);
				}, this);
				data[guid] = index;
			}
		});
		clone = new Core(this.node.cloneNode(cloneChild));
		list = cloneChild ? clone.children(true).add(clone.node) : new Core.list([clone.node]);
		Core.forEach(data, function restoreListeners(guid, index) {
			(handler = Core._handlers[guid]).node.guid = guid;
			Core.forEach(handler.events, function bindListeners(type) {
				Core.observe(this.node, type, this.listener);
			}, handler);
			if (cloneHandlers) {
				list.get(index).copyHandlers(handler.node);
			}
		});
		return clone;
	},
	replace: function replace(arg) {
		// Просто replaceChild не используется,
		// потомучто необходимо удалить обработчики
		// событий заменяемого элемента и всех его
		// детей во избежании повления утечек памяти
		// из-за хранения ссылок на DOM-элементы.
		arg = this.before(arg);
		this.remove();
		return arg;
	},
	wrap: Core.IE ? function wrap(arg, side) {
		return new Core(this.node.applyElement(Core._create(arg), side));
	} : function wrap(arg, side) {
		if (side === "inside") {
			var nodes = document.createDocumentFragment();
			Core.forEach(Core.makeArray(this.node.childNodes), function (node) {
				nodes.appendChild(node);
			});
			return new Core(nodes).appendTo(this.append(arg).node);
		}
		return this.appendTo(this.before(arg).node);
	},
	el: function el(arg) {
		return arg ? this.replace(Core._id(arg)) : this.node;
	},
	empty: function empty() {
		this.children(true).each("remove", false);
		while (this.node.firstChild) {
			this.node.removeChild(this.node.firstChild);
		}
		return this;
	},
	remove: function remove(child) {
		if (child !== false) {
			this.empty();
		}
		Core.clear(this.unbind().node).parentNode.removeChild(this.node);
		return this;
	},
	html: function html(str) {
		if (str !== undefined) {
			this.empty().node.innerHTML = str;
			return this;
		}
		else return this.node.innerHTML;
	},
	text: function text(str) {
		if (str !== undefined) {
			this.empty().node.appendChild(document.createTextNode(str));
			return this;
		}
		else return this.node.innerText || this.node.textContent;
	},
	bind: function bind(type, func) {
		var guid = this.node.guid || (this.node.guid = Core._handlers.guid++);
		if (!Core._handlers[guid]) Core._handlers[guid] = {
			node: this.node,
			listener: Core._handlers.createListener(guid),
			events: {}
		};
		if (type && !Core._handlers[guid].events[type]) {
			Core._handlers[guid].events[type] = {};
			Core.observe(this.node, type, Core._handlers[guid].listener);
		}
		if (func) {
			if (!func.fid) func.fid = Core._handlers.fid++;
			Core._handlers[guid].events[type][func.fid] = func;
		}
		else return Core._handlers[guid];
		return this;
	},
	unbind: function unbind(type, listener) {
		var handler = Core._handlers[this.node.guid], events;
		if (handler) {
			events = handler.events;
			if (listener) {
				if (events[type]) delete events[type][listener.fid];
				if (Core.isEmpty(events[type])) return this.unbind(type);
			}
			else if (type) {
				delete events[type];
				Core.stopObserving(this.node, type, handler.listener);
				if (Core.isEmpty(handler.events)) delete Core._handlers[this.node.guid];
			}
			else {
				Core.forEach(events, function (type) {
					Core.stopObserving(this, type, handler.listener);
				}, this.node);
				delete Core._handlers[this.node.guid];
			}
		}
		return this;
	},
	copyHandlers: function copyHandlers(arg, type) {
		var handler = Core._handlers[Core._id(arg).guid], current, node;
		if (handler) {
			current = this.bind(type);
			node = this.node;
			if (type) Core.extend(current.events[type], handler.events[type]);
			else Core.forEach(handler.events, function (type, list) {
				if (!this.events[type]) {
					this.events[type] = list;
					Core.observe(node, type, this.listener);
				}
				else Core.extend(this.events[type], list);
			}, current);
		}
		return this;
	},
	exist: function exist(exist, die) {
		if (exist && this.node) exist.call(this.node);
		else if (die && !this.node) die();
		return !!this.node;
	},
	hasClass: function hasClass(arg) {
		if (arg) {
			var className = " " + this.node.className + " ", exist = true;
			Core.forEach(Core._toArray(arg), function (str) {
				return className.indexOf(" " + str + " ") == -1 ? exist = false : true;
			});
			return exist;
		}
		else return !!this.node.className;
	},
	addClass: function addClass(classes) {
		var className = this.node.className, modified = false;
		if (className) {
			className = " " + className + " ";
			Core.forEach(Core._toArray(classes), function (str) {
				if (className.indexOf(" " + str + " ") == - 1) {
					className += str + " ";
					modified = true;
				}
			});
			if (modified) this.node.className = Core._toArray(className).join(" ");
		}
		else this.node.className = classes;
		return this;
	},
	removeClass: function removeClass(classes) {
		if (classes) {
			var modified = false, i = 0, className = [];
			classes = " " + (classes.join ? classes.join(" ") : classes) + " ";
			Core.forEach(Core._toArray(this.node.className), function (str) {
				if (classes.indexOf(" " + str + " ") == -1) className[i++] = str;
				else modified = true;
			});
			if (modified) this.node.className = className.join(" ");
		}
		else this.node.className = "";
		return this;
	},
	toggleClass: function toggleClass(classes1, classes2) {
		var className = this.node.className;
		if (classes2) {
			if (className) {
				var i = 0;
				classes2 = Core._toArray(classes2);
				className = " " + className + " ";
				Core.forEach(Core._toArray(classes1), function (str) {
					className = className.replace(" " + str + " ", " " + classes2[i++] + " ");
				});
				this.node.className = Core._toArray(className).join(" ");
			}
		}
		else {
			if (className) {
				var fake = Core.prototype.removeClass.call({node: {className: classes1}}, className).node.className;
				this.removeClass(classes1);
				if (fake) this.addClass(fake);
			}
			else this.addClass(classes1);
		}
		return this;
	},
	attr: function attr(arg, value) {
		if (value !== undefined) {
			var attr = arg;
			arg = {};
			arg[attr] = value;
		}
		else if (arg.join || arg.split) {
			var attributes = Core._toArray(arg), length = attributes.length, i = -1, j = 0, result = [];
			while (++i < length) result[j++] = this.node[attributes[i]];
			return result.length == 1 ? result[0] : result;
		}
		Core.extend(this.node, arg);
		return this;
	},
	removeAttr: function removeAttr(attrs) {
		var i = (attrs = Core._toArray(attrs)).length;
		while (i--) this.node[attrs[i]] = null;
		return this;
	},
	val: function val(str) {
		var value = "value" in this.node;
		return str !== undefined ? (value ? this.attr({value: str}) : this.text(str)) : (value ? this.node.value : ((value = this.node.firstChild) ? value.nodeValue : ""));
	},
	is: function is(arg, tag) {
		if (!arg) {
			return this.exist();
		}
		if (typeof arg == "string") {
			return this.node.nodeName.toUpperCase() == arg.toUpperCase();
		}
		var result;
		if (tag) {
			result = this.node.nodeName.toUpperCase() == tag.toUpperCase();
		}
		if (result) {
			Core.forEach(arg, function compareProperties(attr, value) {
				return this[attr] == value || (result = false);
			}, this.node);
		}
		return result;
	},
	css: function (change, get) {
		return function css(arg, value) {
			if (value !== undefined) {
				var property = arg;
				arg = {};
				arg[property] = value;
			}
			else if (arg.split || arg.join) {
				var properties = Core._toArray(arg), length = properties.length, i = -1, j = 0, result = [];
				while (++i < length) result[j++] = get(this.node, properties[i]);
				return result.length == 1 ? result[0] : result;
			}
			change(this.node, arg);
			return this;
		};
	}(Core.IE ? function () {
		return function (node, properties) {
			if (properties.opacity != undefined) {
				var alpha = node.filters["DXImageTransform.Microsoft.alpha"] || node.filters.alpha;
				alpha ? alpha.opacity = properties.opacity * 100 : node.style.filter += " progid:DXImageTransform.Microsoft.Alpha(opacity=" + properties.opacity * 100 + ")";
				delete properties.opacity;
			}
			if (properties.cssFloat) {
				properties.styleFloat = properties.cssFloat;
				delete properties.cssFloat;
			}
			Core.extend(node.style, properties);
		};
	}() : function (node, properties) {
		Core.extend(node.style, properties);
	}, Core.IE ? function (specify) {
		return function (node, property) {
			return specify[property] ? specify[property](node) : node.currentStyle[property];
		};
	}({cssFloat: function (node) {
		return node.currentStyle.styleFloat;
	}, backgroundPosition: function (node) {
		return node.currentStyle.backgroundPositionX + " " + node.currentStyle.backgroundPositionY;
	}, opacity: function (node) {
		if (node.filters.length) {
			var alpha = node.filters["DXImageTransform.Microsoft.alpha"] || node.filters.alpha;
			return alpha ? alpha.opacity / 100 : 1;
		}
		else return 1;
	}}) : function (node, property) {
		return document.defaultView.getComputedStyle(node, null)[property];
	}),
	hide: function hide() {
		this.node.style.display = "none";
		return this;
	},
	show: function show(type) {
		this.node.style.display = type || "block";
		return this;
	},
	visible: function visible() {
		return this.node.offsetWidth > 0 || this.node.offsetHeight > 0;
	},
	toggle: function toggle(type) {
		this.node.style.display = this.css(["display"]) == "none" ? type || "block" : "none";
		return this;
	},
	enabled: function enabled(bool) {
		return typeof bool == "boolean" ? (bool ? this.removeAttr(["disabled"]) : this.attr({disabled: "disabled"})) : !this.attr(["disabled"]);
	},
	id: function id(str) {
		if (str !== undefined) {
			delete Core._cache[this.node.id];
			this.node.id = str;
			return this;
		}
		else return this.node.id;
	},
	serialize: function serialize() {
		return this.node.outerHTML || new XMLSerializer().serializeToString(this.node);
	},
	position: element.getBoundingClientRect ? function () {
		var rect = this.node.getBoundingClientRect();
		return {top: Math.round(rect.top +  (window.pageYOffset || element.scrollTop) - (element.clientTop || 0)), left: Math.round(rect.left + (window.pageXOffset || element.scrollLeft) - (element.clientLeft || 0))};
	} : function () {
		var top = 0, left = 0, node = this.node;
		while (node) {
			top += parseInt(node.offsetTop) || 0;
			left += parseInt(node.offsetLeft) || 0;
			node = node.offsetParent;
		}
		return {top: top, left: left};
	},
	find: document.querySelectorAll ? function (attrs, tags) {
		var selector = [], i, j = 0;
		if (attrs.split || attrs.join)  {
			i = (attrs = Core._toArray(attrs)).length;
			while (i--) selector[j++] = Core._attrs[attrs[i]] || attrs[i].toLowerCase();
		}
		else Core.forEach(attrs, function (attr, value) {
			selector[j++] = (Core._attrs[attr] || attr.toLowerCase()) + '="' + value + '"';
		});
		selector = "[" + selector.join("][") + "]";
		if (tags) {
			var complex = [];
			i = (tags = Core._toArray(tags)).length;
			j = 0;
			while (i--) complex[j++] = tags[i] + selector;
			selector = complex.join(",");
		}
		return new Core.list(this.node.querySelectorAll(selector), false);
	} : function (attrs, tags) {
		var i = -1, n = 0, list = this.children(tags, true).items, length = list.length, key, array = [];
		if (attrs.split || attrs.join) {
			var j, k = (attrs = Core._toArray(attrs)).length;
			while (++i < length) {
				j = k;
				key = true;
				while (j--) if (!list[i][attrs[j]]) {
					key = false;
					break;
				}
				if (key) array[n++] = list[i];
			}
		}
		else while (++i < length) {
			key = true;
			Core.forEach(attrs, function (attr, value) {
				return list[i][attr] == value ? true : key = false;
			});
			if (key) array[n++] = list[i];
		}
		return new Core.list(array, false);
	},
	findAttr: document.querySelectorAll ? function (attr, values, tags) {
		var selector = [], i = (values = Core._toArray(values)).length, j = 0, k = (tags = tags ? Core._toArray(tags) : [""]).length, n = i;
		attr = Core._attrs[attr] || attr.toLowerCase();
		while (k--) {
			while (i--) selector[j++] = tags[k] + "[" + attr + '~="' + values[i] + '"]';
			i = n;
		}
		return new Core.list(this.node.querySelectorAll(selector.join(",")), false);
	} : function (attr, values, tags) {
		var i = -1, j, n = 0, k = (values = Core._toArray(values)).length, list = this.children(tags, true).items, length = list.length, key, value, array = [];
		while (++i < length) {
			j = k;
			key = false;
			value = " " + list[i][attr] + " ";
			while (j--) if (value.indexOf(" " + values[j] + " ") != -1) {
				key = true;
				break;
			}
			if (key) array[n++] = list[i];
		}
		return new Core.list(array, false);		
	},
	children: function (find, children, filter) {
		if ("children" in element) {
			children = "children";
			filter = false;
		}
		else children = "childNodes";
		return function (tags, depth) {
			if (tags || depth) {
				var i = -1, list = [];
				if (tags === true || (!tags && depth)) list = this.node.getElementsByTagName("*");
				else if (tags) {
					if (depth) list = (i = (tags = Core._toArray(tags)).length) == 1 ? this.node.getElementsByTagName(tags[0]) : find(this.node, tags, i);
					else {
						var child = this.node[children], length = child.length, j = 0;
						tags = " " + (tags.join ? tags.join(" ") : tags).toUpperCase() + " ";
						while (++i < length) if (tags.indexOf(" " + child[i].tagName + " ") != -1) list[j++] = child[i];
					}
				}
				return new Core.list(list, false);
			}
			else return new Core.list(this.node[children], filter);
		};
	}(document.querySelectorAll ? function (node, tags) {
		return node.querySelectorAll(tags.join(","));
	} : function (node, tags, i) {
		var list = [];
		while (i--) list = list.concat(Core.makeArray(node.getElementsByTagName(tags[i])));
		return list;
	}),
	descendants: function (tags) {
		return this.children(tags, true);
	},
	findClass: document.querySelectorAll ? function (classes, tags) {
		var selector = [];
		classes = Core._toArray(classes);
		if (tags) {
			var i, length = classes.length, j, k = 0;
			i = (tags = Core._toArray(tags)).length;
			while (i--) {
				j = length;
				while (j--) selector[k++] = tags[i] + "." + classes[j];
			}
			selector = selector.join(",");
		}
		else selector = "." + classes.join(",.");
		return new Core.list(this.node.querySelectorAll(selector), false);
	} : document.getElementsByClassName ? function (classes, tags) {
		return !tags && (classes = Core._toArray(classes)).length == 1 ? new Core.list(this.node.getElementsByClassName(classes[0]), false) : this.findAttr("className", classes, tags);
	} : function (classes, tags) {
		return this.findAttr("className", classes, tags);
	}
};
Core.extend(Core.prototype, function (traversal, sibling, child) {
	if ("childElementCount" in element) {
		traversal = {next: "nextElementSibling", prev: "previousElementSibling", first: "firstElementChild", last: "lastElementChild"};
		sibling = function (node, dir, tag) {
			if (tag) {
				tag = tag.toUpperCase();
				while (node = node[dir]) if (node.nodeName == tag) break;
				return node;
			}
			return node[dir];
		};
		child = function (node, dir, tag) {
			return node ? (tag && node.tagName != tag.toUpperCase() ? sibling(node, traversal[dir], tag) : node) : null;
		};
		Core.clear = function (node) {
			node.childElementCount ? this._cache = {} : delete this._cache[node.id];
			return node;
		};
	}
	else {
		traversal = {next: "nextSibling", prev: "previousSibling", first: "firstChild", last: "lastChild"};
		sibling = function (node, dir, tag) {
			if (tag) tag = tag.toUpperCase();
			while (node = node[dir]) if (node.nodeType == 1 && (tag ? node.tagName == tag : true)) break;
			return node;
		};
		child = function (node, dir, tag) {
			return node ? (node.nodeType == 1 && (tag ? tag.toUpperCase() == node.tagName : true) ? node : sibling(node, traversal[dir], tag)) : null;
		};
		Core.clear = function (node) {
			node.hasChildNodes() ? this._cache = {} : delete this._cache[node.id];
			return node;
		};
	}
	return {
		next: function (tag) {
			return new Core(sibling(this.node, traversal.next, tag));
		},
		prev: function (tag) {
			return new Core(sibling(this.node, traversal.prev, tag));
		},
		first: function (tag) {
			return new Core(child(this.node[traversal.first], "next", tag));
		},
		last: function (tag) {
			return new Core(child(this.node[traversal.last], "prev", tag));
		},
		nth: function (index, tags) {
			return this.children(tags).get(index);
		}
	};
}());
Core.list.prototype = {
	isCoreList: true,
	get: function (index) {
		return index === undefined ? this.items : new Core(this.items[index]);
	},
	getLast: function () {
		return new Core(this.items[this.items.length - 1]);
	},
	size: function () {
		return this.items.length;
	},
	add: function (args) {
		if (!this.items.join) {
			this.items = Core.makeArray(this.items);
		}
		if (!args.join && "length" in args) {
			args = Core.makeArray(args);
		}
		this.items = this.items.concat(args);
		return this;
	}
};
Core.extend(Core.list.prototype, function (slice) {
	function check(args) {
		var length = (args = slice.call(args, 1)).length < 2;
		return length ? {method: "call", args: args[0]} : {method: "apply", args: args};
	}
	Core.forEach("resize,scroll,blur,focus,error,abort,onload,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,keydown,keypress,keyup,change,select,submit,reset".split(","), function (listener) {
		return function (type) {
			Core.prototype[type] = function (arg) {
				return arg ? this.bind(type, arg.call ? arg : listener(arg, arguments)) : this.node[type]();
			};
		};
	}(function (method, args) {
		return function () {
			var obj, exec = check(args);
			(obj = $(this))[method][exec.method](obj, exec.args);
		};
	}));
	return {
		filter: function (arg) {
			if (arg.call) return new Core.list(this.items, arg);
			else {
				var obj = new Core(this.items[0]), exec = check(arguments);
				return new Core.list(this.items, exec.method == "call" ? function () {
					obj.node = this;
					return obj[arg](exec.args);
				} : function () {
					obj.node = this;
					return Core.prototype[arg].apply(obj, exec.args);
				});
			}
		},
		each: function (arg) {
			var i = this.items.length;
			if (arg.call) {
				while (i--) if (arg.call(this.items[i], i, this.items) === false) break;
			}
			else {
				var obj = new Core(this.items[0]), exec = check(arguments);
				if (exec.method == "call") while (i--) {
					obj.node = this.items[i];
					obj[arg](exec.args);
				}
				else while (i--) {
					obj.node = this.items[i];
					Core.prototype[arg].apply(obj, exec.args);
				}
			}
			return this;
		}
	};
}(Array.prototype.slice));
Core.prototype.store = Core.list.prototype.store = function () {
	return Core._storage = this;
};
Core.restore = Core.prototype.restore = Core.list.prototype.restore = function () {
	var storage = Core._storage;
	delete Core._storage;
	return storage;
};
Core.timer.prototype = {
	isCoreTimer: true,
	start: function () {
		if (!this.enabled) {
			var timer = this;
			timer.enabled = true;
			(function callee() {
				timer.func.call(timer.thisObj, timer);
				if (timer.enabled) setTimeout(callee, timer.time);
			})();
		}
		return this;
	},
	stop: function () {
		this.enabled = false;
		return this;
	},
	repeat: function (amount, callback, thisObj) {
		if (!this.enabled) {
			var timer = this;
			timer.enabled = true;
			(function callee() {
				timer.func.call(timer.thisObj, timer);
				if (timer.enabled && --amount) setTimeout(callee, timer.time);
				else {
					timer.enabled = false;
					if (callback) callback.call(thisObj || timer.thisObj, timer);
				}
			})();
		}
		return this;
	}
};
(function (listener) {
	Core.observe(window, "load", listener);
	if (Core.IE) {
		try {
			element.doScroll("left");
		}
		catch(error) {
			document.write(unescape('%3CSCRIPT onreadystatechange="if (this.readyState==\'complete\') Core.ready()" defer="defer" src="\/\/:"%3E%3C/SCRIPT%3E'));
		}
	}
	else {
		document.addEventListener("DOMContentLoaded", listener, false);
	}
}(function callee() {
	Core.stopObserving(document, "DOMContentLoaded", callee);
	Core.stopObserving(window, "load", callee);
	Core.ready();
}));
Core.observe(window, "unload", function callee() {
	Core.stopObserving(window, "unload", callee);
	delete Core._cache;
	delete Core._storage;
	delete Core._handlers.guid;
	delete Core._handlers.fid;
	delete Core._handlers.createListener;
	Core.forEach(Core._handlers, function (guid, handler) {
		Core.forEach(handler.events, function (type) {
			Core.stopObserving(handler.node, type, handler.listener);
		}, handler);
	});
	delete Core._handlers;
});

// Создаем короткую ссылку на Core
if (typeof $ == "undefined") {
	window.$ = Core;
}