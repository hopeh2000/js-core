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
	if(! this.isCore) {
		return new Core(arg);
	}
	this.node = Core.id(arg);
	return this;
}

// Ссылки для быстрого доступа
/**
 * Ссылка на window
 * @private
 */
Core.win = this;
/**
 * Ссылка на document
 * @private
 */
Core.doc = this.document;
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
 * @argument {Object} [context] Контекст вызова функции (по умолчанию window)
 * @type Array|Object
 * @returns Исходный массив или объект
 */
Core.forEach = function(obj, func, context) {
	var length = obj.length, i, key;
	context = context || Core.win;
	if(length === undefined) {
		for(key in obj) {
			if(obj.hasOwnProperty(key)) {
				// func → function(key, value, object) { this → context }
				if(func.call(context, key, obj[key], obj) === false) {
					break;
				}
			}
		}
	}
	else {
		i = -1;
		while(++i < length) {
			// func → function(element, index, array, length) { this → context }
			if(func.call(context, obj[i], i, obj, length) === false) {
				break;
			}
		}
	}
	return obj;
};

/**
 * Копирует свойства одного объекта в другой.
 * @argument {Object} obj Объект, в который копируются свойства
 * @argument {Object} hash Объект, чьи свойства копируются
 * @type Object
 * @returns Исходный объект
 */
Core.extend = function(obj, hash) {
	this.forEach(hash, function(key, value) {
		obj[key] = value;
	});
	return obj;
};

Core.extend(Core, {

	/**
	 *
	 *
	 * @private
	 */
	cache: {},

	/**
	 *
	 *
	 * @private
	 */
	id: function(arg) {
		return typeof arg == "string" ? this.cache[arg] || (this.cache[arg] = this.doc.getElementById(arg)) : arg;
	},

	/**
	 *
	 *
	 * @private
	 */
	create: function(arg) {
		return typeof arg == "string" ? this.doc.createElement(arg) : arg;
	},

	/**
	 *
	 *
	 * @private
	 */
	insert: function(node, arg, before) {
		return node.insertBefore(this.create(arg), before);
	},

	/**
	 *
	 *
	 * @private
	 */
	bind: this.addEventListener ? function(node, type, listener) {
		node.addEventListener(type, listener, false);
	} : function(node, type, listener) {
		node.attachEvent("on" + type, listener);
	},
	unbind: this.removeEventListener ? function(node, type, listener) {
		node.removeEventListener(type, listener, false);
	} : function(node, type, listener) {
		node.detachEvent("on" + type, listener);
	},
	isEmpty: function(obj) {
		var empty = true;
		this.forEach(obj, function() {
			return empty = false;
		});
		return empty;
	},
	handlers: {
		guid: 1,
		fid: 1,
		createListener: function(guid) {
			return function(event) {
				Core.forEach(Core.handlers[guid].events[(event || (event = Core.win.event)).type], function(fid, func) {
					if(func.call(this, event) === false) {
						Core.preventDefault(event);
					}
				}, Core.handlers[guid].link);
			};
		}
	},
	attrs: {
		htmlFor: "for",
		className: "class"
	},
	toArray: function(arg) {
		if(typeof arg == "string") {
			var i = -1, j = 0, array = arg.split(" "), length = array.length;
			arg = [];
			while(++i < length) {
				if(array[i]) {
					arg[j++] = array[i];
				}
			}
		}
		return arg;
	},
	ready: function(ready, list, i) {
		return function(func) {
			if(func) {
				ready ? func() : list.push(func);
			}
			else if(! ready) {
				ready = true;
				var length = list.length;
				while(++i < length) {
					list[i]();
				}
				list = null;
			}
		};
	}(false, [], -1),
	context: function(func, context) {
		return function _func(arg) {
			return func.call(context, arg);
		};
	},
	parse: function(html) {
		var node = this.doc.createElement("div");
		node.innerHTML = html;
		return new this(node.firstChild);
	},
	n: function(tag) {
		return new this(this.doc.createElement(tag));
	},
	tag: function(tags) {
		return new this(this.doc).children(tags, true);
	},
	find: function(attrs, tags) {
		return new this(this.doc).find(attrs, tags);
	},
	findAttr: function(attr, values, tags) {
		return new this(this.doc).findAttr(attr, values, tags);
	},
	findClass: function(classes, tags) {
		return new this(this.doc).findClass(classes, tags);
	},
	makeArray: Core.IE ? function(list) {
		var i = -1, length = list.length, array = [];
		while(++i < length) {
			array[i] = list[i];
		}
		return array;
	} : function(list) {
		return Array.prototype.slice.call(list);
	},
	list: function(items, filter) {
		if(! this.isCoreList) {
			return new Core.list(items, filter);
		}
		if(filter === false) {
			this.items = items || [];
		}
		else {
			var i = -1, j = 0, k = 0, length = items.length;
			this.items = [];
			while(++i < length) {
				if(items[i].nodeType == 1 && (filter ? filter.call(items[i], j++) : true)) {
					this.items[k++] = items[i];
				}
			}
		}
		return this;
	},
	timer: function(time, func, context) {
		return this.isCoreTimer ? Core.extend(this, {time: time, func: func, context: context, enabled: false}) : new Core.timer(time, func, context);
	},
	preventDefault: Core.IE ? function(event) {
		event.returnValue = false;
	} : function(event) {
		event.preventDefault();
	},
	stopPropagation: Core.IE ? function(event) {
		event.cancelBubble = true;
	} : function(event) {
		event.stopPropagation();
	},
	stop: function(event) {
		Core.preventDefault(event);
		Core.stopPropagation(event);
	},
	target: function(target) {
		return function(event) {
			return event[target];
		};
	}(Core.IE ? "srcElement" : "target"),
	relatedTarget: Core.IE ? function(event) {
		return event.fromElement === event.srcElement ? event.toElement : event.fromElement;
	} : function(event) {
		return event.relatedTarget;
	},
	mouseButton: function(property, middle) {
		return function(event) {
			return event[property] < 2 ? 1 : event[property] == middle ? 3 : 2;
		};
	}(Core.IE ? "button" : "which", Core.IE ? 4 : 2),
	trim: String.prototype.trim ? function(str) {
		return str.trim();
	} : function(str) {
		return str.replace(/^\s+|\s+$/g, "");
	},
	trimLeft: String.prototype.trimLeft ? function(str) {
		return str.trimLeft();
	} : function(str) {
		return str.replace(/^\s+/, "");
	},
	trimRight: String.prototype.trimRight ? function(str) {
		return str.trimRight();
	} : function(str) {
		return str.replace(/\s+$/, "");
	},
	computedStyle: Core.IE ? function(node) {
		return node.currentStyle;
	} : function(node) {
		return this.doc.defaultView.getComputedStyle(node, null);
	}
});
(function(calc) {
	if(Core.IE) {
		Core.pageX = function(event) {
			return event.clientX + calc("Left");
		};
		Core.pageY = function(event) {
			return event.clientY + calc("Top");
		};
	}
	else {
		Core.pageX = function(event) {
			return event.pageX;
		};
		Core.pageY = function(event) {
			return event.pageY;
		};
	}
})(function(side) {
	return (element["scroll" + side] || 0) - (element["client" + side] || 0);
});
Core.prototype = {
	isCore: true,
	parent: function(tag) {
		var node = this.node.parentNode;
		if(tag) {
			tag = tag.toLowerCase();
			do {
				if(node.nodeName.toLowerCase() == tag) {
					break;
				}
				node = node.parentNode;
			}
			while(node);
		}
		return new Core(node);
	},
	append: function(arg) {
		return new Core(this.node.appendChild(Core.create(arg)));
	},
	prepend: function(arg) {
		return new Core(Core.insert(this.node, arg, this.node.firstChild));
	},
	after: function(arg) {
		return new Core(Core.insert(this.node.parentNode, arg, this.node.nextSibling));
	},
	before: function(arg) {
		return new Core(Core.insert(this.node.parentNode, arg, this.node));
	},
	appendTo: function(arg) {
		(arg = new Core(arg)).node.appendChild(this.node);
		return arg;
	},
	prependTo: function(arg) {
		Core.insert((arg = new Core(arg)).node, this.node, arg.node.firstChild);
		return arg;
	},
	insertAfter: function(arg) {
		var node = Core.id(arg);
		return new Core(Core.insert(node.parentNode, this.node, node.nextSibling));
	},
	insertBefore: function(arg) {
		var node = Core.id(arg);
		return new Core(Core.insert(node.parentNode, this.node, node));
	},
	clone: function(cloneChild, cloneHandlers) {
		cloneChild = cloneChild !== false;
		cloneHandlers = cloneHandlers !== false;
		var list = cloneChild ? this.children(true).add(this.node) : new Core.list([this.node]), clone, guid, handler, data = {};
		list.each(function(index) {
			guid = this.guid;
			this.guid = null;
			if(guid && Core.handlers[guid]) {
				Core.forEach(Core.handlers[guid].events, function(type) {
					Core.unbind(this, type, Core.handlers[guid].listener);
				}, this);
				data[guid] = index;
			}
		});
		clone = new Core(this.node.cloneNode(cloneChild));
		list = cloneChild ? clone.children(true).add(clone.node) : new Core.list([clone.node]);
		Core.forEach(data, function(guid, index) {
			(handler = Core.handlers[guid]).link.guid = guid;
			Core.forEach(handler.events, function(type) {
				Core.bind(this.link, type, this.listener);
			}, handler);
			if(cloneHandlers) {
				list.get(index).copyHandlers(handler.link);
			}
		});
		return clone;
	},
	replace: function(arg) {
		arg = this.before(arg);
		this.remove();
		return arg;
	},
	wrap: Core.IE ? function(arg, side) {
		return new Core(this.node.applyElement(Core.create(arg), side));
	} : function(arg, side) {
		if(side === "inside") {
			var nodes = Core.doc.createDocumentFragment();
			Core.forEach(Core.makeArray(this.node.childNodes), function(node) {
				nodes.appendChild(node);
			});
			return new Core(nodes).appendTo(this.append(arg).node);
		}
		return this.appendTo(this.before(arg).node);
	},
	el: function(arg) {
		return arg ? this.replace(Core.id(arg)) : this.node;
	},
	empty: function() {
		this.children(true).each("remove", false);
		while(this.node.firstChild) this.node.removeChild(this.node.firstChild);
		return this;
	},
	remove: function(child) {
		if(child !== false) this.empty();
		Core.clear(this.unbind().node).parentNode.removeChild(this.node);
		return this;
	},
	html: function(str) {
		if(str !== undefined) {
			this.empty().node.innerHTML = str;
			return this;
		}
		else return this.node.innerHTML;
	},
	text: function(str) {
		if(str !== undefined) {
			this.empty().node.appendChild(Core.doc.createTextNode(str));
			return this;
		}
		else return this.node.innerText || this.node.textContent;
	},
	bind: function(type, func) {
		var guid = this.node.guid || (this.node.guid = Core.handlers.guid++);
		if(!Core.handlers[guid]) Core.handlers[guid] = {
			link: this.node,
			listener: Core.handlers.createListener(guid),
			events: {}
		};
		if(type && !Core.handlers[guid].events[type]) {
			Core.handlers[guid].events[type] = {};
			Core.bind(this.node, type, Core.handlers[guid].listener);
		}
		if(func) {
			if(!func.fid) func.fid = Core.handlers.fid++;
			Core.handlers[guid].events[type][func.fid] = func;
		}
		else return Core.handlers[guid];
		return this;
	},
	unbind: function(type, listener) {
		var handler = Core.handlers[this.node.guid], events;
		if(handler) {
			events = handler.events;
			if(listener) {
				if(events[type]) delete events[type][listener.fid];
				if(Core.isEmpty(events[type])) return this.unbind(type);
			}
			else if(type) {
				delete events[type];
				Core.unbind(this.node, type, handler.listener);
				if(Core.isEmpty(handler.events)) delete Core.handlers[this.node.guid];
			}
			else {
				Core.forEach(events, function(type) {
					Core.unbind(this, type, handler.listener);
				}, this.node);
				delete Core.handlers[this.node.guid];
			}
		}
		return this;
	},
	copyHandlers: function(arg, type) {
		var handler = Core.handlers[Core.id(arg).guid], current, node;
		if(handler) {
			current = this.bind(type);
			node = this.node;
			if(type) Core.extend(current.events[type], handler.events[type]);
			else Core.forEach(handler.events, function(type, list) {
				if(!this.events[type]) {
					this.events[type] = list;
					Core.bind(node, type, this.listener);
				}
				else Core.extend(this.events[type], list);
			}, current);
		}
		return this;
	},
	exist: function(exist, die) {
		if(exist && this.node) exist.call(this.node);
		else if(die && !this.node) die();
		return !!this.node;
	},
	hasClass: function(arg) {
		if(arg) {
			var className = " " + this.node.className + " ", exist = true;
			Core.forEach(Core.toArray(arg), function(str) {
				return className.indexOf(" " + str + " ") == -1 ? exist = false : true;
			});
			return exist;
		}
		else return !!this.node.className;
	},
	addClass: function(classes) {
		var className = this.node.className, modified = false;
		if(className) {
			className = " " + className + " ";
			Core.forEach(Core.toArray(classes), function(str) {
				if(className.indexOf(" " + str + " ") == - 1) {
					className += str + " ";
					modified = true;
				}
			});
			if(modified) this.node.className = Core.toArray(className).join(" ");
		}
		else this.node.className = classes;
		return this;
	},
	removeClass: function(classes) {
		if(classes) {
			var modified = false, i = 0, className = [];
			classes = " " + (classes.join ? classes.join(" ") : classes) + " ";
			Core.forEach(Core.toArray(this.node.className), function(str) {
				if(classes.indexOf(" " + str + " ") == -1) className[i++] = str;
				else modified = true;
			});
			if(modified) this.node.className = className.join(" ");
		}
		else this.node.className = "";
		return this;
	},
	toggleClass: function(classes1, classes2) {
		var className = this.node.className;
		if(classes2) {
			if(className) {
				var i = 0;
				classes2 = Core.toArray(classes2);
				className = " " + className + " ";
				Core.forEach(Core.toArray(classes1), function(str) {
					className = className.replace(" " + str + " ", " " + classes2[i++] + " ");
				});
				this.node.className = Core.toArray(className).join(" ");
			}
		}
		else {
			if(className) {
				var fake = Core.prototype.removeClass.call({node: {className: classes1}}, className).node.className;
				this.removeClass(classes1);
				if(fake) this.addClass(fake);
			}
			else this.addClass(classes1);
		}
		return this;
	},
	attr: function(arg, value) {
		if(value !== undefined) {
			var attr = arg;
			arg = {};
			arg[attr] = value;
		}
		else if(arg.join || arg.split) {
			var attributes = Core.toArray(arg), length = attributes.length, i = -1, j = 0, result = [];
			while(++i < length) result[j++] = this.node[attributes[i]];
			return result.length == 1 ? result[0] : result;
		}
		Core.extend(this.node, arg);
		return this;
	},
	removeAttr: function(attrs) {
		var i = (attrs = Core.toArray(attrs)).length;
		while(i--) this.node[attrs[i]] = null;
		return this;
	},
	val: function(str) {
		var value = "value" in this.node;
		return str !== undefined ? (value ? this.attr({value: str}) : this.text(str)) : (value ? this.node.value : ((value = this.node.firstChild) ? value.nodeValue : ""));
	},
	is: function(arg, tag) {
		if(arg) {
			if(typeof arg == "string") return this.node.tagName == arg.toUpperCase();
			var key = true;
			if(tag) arg.tagName = tag.toUpperCase();
			Core.forEach(arg, function(attr, value) {
				return this[attr] == value ? true : key = false;
			}, this.node);
			return key;
		}
		else return this.exist();
	},
	css: function(change, get) {
		return function(arg, value) {
			if(value !== undefined) {
				var property = arg;
				arg = {};
				arg[property] = value;
			}
			else if(arg.split || arg.join) {
				var properties = Core.toArray(arg), length = properties.length, i = -1, j = 0, result = [];
				while(++i < length) result[j++] = get(this.node, properties[i]);
				return result.length == 1 ? result[0] : result;
			}
			change(this.node, arg);
			return this;
		};
	}(Core.IE ? function() {
		return function(node, properties) {
			if(properties.opacity != undefined) {
				var alpha = node.filters["DXImageTransform.Microsoft.alpha"] || node.filters.alpha;
				alpha ? alpha.opacity = properties.opacity * 100 : node.style.filter += " progid:DXImageTransform.Microsoft.Alpha(opacity=" + properties.opacity * 100 + ")";
				delete properties.opacity;
			}
			if(properties.cssFloat) {
				properties.styleFloat = properties.cssFloat;
				delete properties.cssFloat;
			}
			Core.extend(node.style, properties);
		};
	}() : function(node, properties) {
		Core.extend(node.style, properties);
	}, Core.IE ? function(specify) {
		return function(node, property) {
			return specify[property] ? specify[property](node) : node.currentStyle[property];
		};
	}({cssFloat: function(node) {
		return node.currentStyle.styleFloat;
	}, backgroundPosition: function(node) {
		return node.currentStyle.backgroundPositionX + " " + node.currentStyle.backgroundPositionY;
	}, opacity: function(node) {
		if(node.filters.length) {
			var alpha = node.filters["DXImageTransform.Microsoft.alpha"] || node.filters.alpha;
			return alpha ? alpha.opacity / 100 : 1;
		}
		else return 1;
	}}) : function(node, property) {
		return Core.doc.defaultView.getComputedStyle(node, null)[property];
	}),
	hide: function() {
		this.node.style.display = "none";
		return this;
	},
	show: function(type) {
		this.node.style.display = type || "block";
		return this;
	},
	visible: function() {
		return this.node.offsetWidth > 0 || this.node.offsetHeight > 0;
	},
	toggle: function(type) {
		this.node.style.display = this.css(["display"]) == "none" ? type || "block" : "none";
		return this;
	},
	enabled: function(bool) {
		return typeof bool == "boolean" ? (bool ? this.removeAttr(["disabled"]) : this.attr({disabled: "disabled"})) : !this.attr(["disabled"]);
	},
	id: function(str) {
		if(str !== undefined) {
			delete Core.cache[this.node.id];
			this.node.id = str;
			return this;
		}
		else return this.node.id;
	},
	serialize: function() {
		return this.node.outerHTML || new XMLSerializer().serializeToString(this.node);
	},
	position: element.getBoundingClientRect ? function() {
		var rect = this.node.getBoundingClientRect();
		return {top: Math.round(rect.top +  (Core.win.pageYOffset || element.scrollTop) - (element.clientTop || 0)), left: Math.round(rect.left + (Core.win.pageXOffset || element.scrollLeft) - (element.clientLeft || 0))};
	} : function() {
		var top = 0, left = 0, node = this.node;
		while(node) {
			top += parseInt(node.offsetTop) || 0;
			left += parseInt(node.offsetLeft) || 0;
			node = node.offsetParent;
		}
		return {top: top, left: left};
	},
	find: Core.doc.querySelectorAll ? function(attrs, tags) {
		var selector = [], i, j = 0;
		if(attrs.split || attrs.join)  {
			i = (attrs = Core.toArray(attrs)).length;
			while(i--) selector[j++] = Core.attrs[attrs[i]] || attrs[i].toLowerCase();
		}
		else Core.forEach(attrs, function(attr, value) {
			selector[j++] = (Core.attrs[attr] || attr.toLowerCase()) + '="' + value + '"';
		});
		selector = "[" + selector.join("][") + "]";
		if(tags) {
			var complex = [];
			i = (tags = Core.toArray(tags)).length;
			j = 0;
			while(i--) complex[j++] = tags[i] + selector;
			selector = complex.join(",");
		}
		return new Core.list(this.node.querySelectorAll(selector), false);
	} : function(attrs, tags) {
		var i = -1, n = 0, list = this.children(tags, true).items, length = list.length, key, array = [];
		if(attrs.split || attrs.join) {
			var j, k = (attrs = Core.toArray(attrs)).length;
			while(++i < length) {
				j = k;
				key = true;
				while(j--) if(!list[i][attrs[j]]) {
					key = false;
					break;
				}
				if(key) array[n++] = list[i];
			}
		}
		else while(++i < length) {
			key = true;
			Core.forEach(attrs, function(attr, value) {
				return list[i][attr] == value ? true : key = false;
			});
			if(key) array[n++] = list[i];
		}
		return new Core.list(array, false);
	},
	findAttr: Core.doc.querySelectorAll ? function(attr, values, tags) {
		var selector = [], i = (values = Core.toArray(values)).length, j = 0, k = (tags = tags ? Core.toArray(tags) : [""]).length, n = i;
		attr = Core.attrs[attr] || attr.toLowerCase();
		while(k--) {
			while(i--) selector[j++] = tags[k] + "[" + attr + '~="' + values[i] + '"]';
			i = n;
		}
		return new Core.list(this.node.querySelectorAll(selector.join(",")), false);
	} : function(attr, values, tags) {
		var i = -1, j, n = 0, k = (values = Core.toArray(values)).length, list = this.children(tags, true).items, length = list.length, key, value, array = [];
		while(++i < length) {
			j = k;
			key = false;
			value = " " + list[i][attr] + " ";
			while(j--) if(value.indexOf(" " + values[j] + " ") != -1) {
				key = true;
				break;
			}
			if(key) array[n++] = list[i];
		}
		return new Core.list(array, false);		
	},
	children: function(find, children, filter) {
		if("children" in element) {
			children = "children";
			filter = false;
		}
		else children = "childNodes";
		return function(tags, depth) {
			if(tags || depth) {
				var i = -1, list = [];
				if(tags === true || (!tags && depth)) list = this.node.getElementsByTagName("*");
				else if(tags) {
					if(depth) list = (i = (tags = Core.toArray(tags)).length) == 1 ? this.node.getElementsByTagName(tags[0]) : find(this.node, tags, i);
					else {
						var child = this.node[children], length = child.length, j = 0;
						tags = " " + (tags.join ? tags.join(" ") : tags).toUpperCase() + " ";
						while(++i < length) if(tags.indexOf(" " + child[i].tagName + " ") != -1) list[j++] = child[i];
					}
				}
				return new Core.list(list, false);
			}
			else return new Core.list(this.node[children], filter);
		};
	}(Core.doc.querySelectorAll ? function(node, tags) {
		return node.querySelectorAll(tags.join(","));
	} : function(node, tags, i) {
		var list = [];
		while(i--) list = list.concat(Core.makeArray(node.getElementsByTagName(tags[i])));
		return list;
	}),
	descendants: function(tags) {
		return this.children(tags, true);
	},
	findClass: Core.doc.querySelectorAll ? function(classes, tags) {
		var selector = [];
		classes = Core.toArray(classes);
		if(tags) {
			var i, length = classes.length, j, k = 0;
			i = (tags = Core.toArray(tags)).length;
			while(i--) {
				j = length;
				while(j--) selector[k++] = tags[i] + "." + classes[j];
			}
			selector = selector.join(",");
		}
		else selector = "." + classes.join(",.");
		return new Core.list(this.node.querySelectorAll(selector), false);
	} : Core.doc.getElementsByClassName ? function(classes, tags) {
		return !tags && (classes = Core.toArray(classes)).length == 1 ? new Core.list(this.node.getElementsByClassName(classes[0]), false) : this.findAttr("className", classes, tags);
	} : function(classes, tags) {
		return this.findAttr("className", classes, tags);
	}
};
Core.extend(Core.prototype, function(traversal, sibling, child) {
	if("childElementCount" in element) {
		traversal = {next: "nextElementSibling", prev: "previousElementSibling", first: "firstElementChild", last: "lastElementChild"};
		sibling = function(node, dir, tag) {
			if(tag) {
				tag = tag.toUpperCase();
				while(node = node[dir]) if(node.nodeName == tag) break;
				return node;
			}
			return node[dir];
		};
		child = function(node, dir, tag) {
			return node ? (tag && node.tagName != tag.toUpperCase() ? sibling(node, traversal[dir], tag) : node) : null;
		};
		Core.clear = function(node) {
			node.childElementCount ? this.cache = {} : delete this.cache[node.id];
			return node;
		};
	}
	else {
		traversal = {next: "nextSibling", prev: "previousSibling", first: "firstChild", last: "lastChild"};
		sibling = function(node, dir, tag) {
			if(tag) tag = tag.toUpperCase();
			while(node = node[dir]) if(node.nodeType == 1 && (tag ? node.tagName == tag : true)) break;
			return node;
		};
		child = function(node, dir, tag) {
			return node ? (node.nodeType == 1 && (tag ? tag.toUpperCase() == node.tagName : true) ? node : sibling(node, traversal[dir], tag)) : null;
		};
		Core.clear = function(node) {
			node.hasChildNodes() ? this.cache = {} : delete this.cache[node.id];
			return node;
		};
	}
	return {
		next: function(tag) {
			return new Core(sibling(this.node, traversal.next, tag));
		},
		prev: function(tag) {
			return new Core(sibling(this.node, traversal.prev, tag));
		},
		first: function(tag) {
			return new Core(child(this.node[traversal.first], "next", tag));
		},
		last: function(tag) {
			return new Core(child(this.node[traversal.last], "prev", tag));
		},
		nth: function(index, tags) {
			return this.children(tags).get(index);
		}
	};
}());
Core.list.prototype = {
	isCoreList: true,
	get: function(index) {
		return index === undefined ? this.items : new Core(this.items[index]);
	},
	getLast: function() {
		return new Core(this.items[this.items.length - 1]);
	},
	size: function() {
		return this.items.length;
	},
	add: function(args) {
		if(! this.items.join) {
			this.items = Core.makeArray(this.items);
		}
		if(! args.join && "length" in args) {
			args = Core.makeArray(args);
		}
		this.items = this.items.concat(args);
		return this;
	}
};
Core.extend(Core.list.prototype, function(slice) {
	function check(args) {
		var length = (args = slice.call(args, 1)).length < 2;
		return length ? {method: "call", args: args[0]} : {method: "apply", args: args};
	}
	Core.forEach("resize,scroll,blur,focus,error,abort,onload,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,keydown,keypress,keyup,change,select,submit,reset".split(","), function(listener) {
		return function(type) {
			Core.prototype[type] = function(arg) {
				return arg ? this.bind(type, arg.call ? arg : listener(arg, arguments)) : this.node[type]();
			};
		};
	}(function(method, args) {
		return function() {
			var obj, exec = check(args);
			(obj = $(this))[method][exec.method](obj, exec.args);
		};
	}));
	return {
		filter: function(arg) {
			if(arg.call) return new Core.list(this.items, arg);
			else {
				var obj = new Core(this.items[0]), exec = check(arguments);
				return new Core.list(this.items, exec.method == "call" ? function() {
					obj.node = this;
					return obj[arg](exec.args);
				} : function() {
					obj.node = this;
					return Core.prototype[arg].apply(obj, exec.args);
				});
			}
		},
		each: function(arg) {
			var i = this.items.length;
			if(arg.call) {
				while(i--) if(arg.call(this.items[i], i, this.items) === false) break;
			}
			else {
				var obj = new Core(this.items[0]), exec = check(arguments);
				if(exec.method == "call") while(i--) {
					obj.node = this.items[i];
					obj[arg](exec.args);
				}
				else while(i--) {
					obj.node = this.items[i];
					Core.prototype[arg].apply(obj, exec.args);
				}
			}
			return this;
		}
	};
}(Array.prototype.slice));
Core.prototype.store = Core.list.prototype.store = function() {
	return Core.storage = this;
};
Core.restore = Core.prototype.restore = Core.list.prototype.restore = function() {
	var storage = Core.storage;
	delete Core.storage;
	return storage;
};
Core.timer.prototype = {
	isCoreTimer: true,
	start: function() {
		if(!this.enabled) {
			var timer = this;
			timer.enabled = true;
			(function callee() {
				timer.func.call(timer.context, timer);
				if(timer.enabled) setTimeout(callee, timer.time);
			})();
		}
		return this;
	},
	stop: function() {
		this.enabled = false;
		return this;
	},
	repeat: function(amount, callback, context) {
		if(!this.enabled) {
			var timer = this;
			timer.enabled = true;
			(function callee() {
				timer.func.call(timer.context, timer);
				if(timer.enabled && --amount) setTimeout(callee, timer.time);
				else {
					timer.enabled = false;
					if(callback) callback.call(context || timer.context, timer);
				}
			})();
		}
		return this;
	}
};
(function(listener) {
	Core.bind(Core.win, "load", listener);
	if(Core.IE) {
		try {
			element.doScroll("left");
		}
		catch(error) {
			Core.doc.write(unescape('%3CSCRIPT onreadystatechange="if(this.readyState==\'complete\') Core.ready()" defer="defer" src="\/\/:"%3E%3C/SCRIPT%3E'));
		}
	}
	else {
		Core.doc.addEventListener("DOMContentLoaded", listener, false);
	}
}(function callee() {
	Core.unbind(Core.doc, "DOMContentLoaded", callee);
	Core.unbind(Core.win, "load", callee);
	Core.ready();
}));
Core.bind(Core.win, "unload", function callee() {
	Core.unbind(Core.win, "unload", callee);
	delete Core.cache;
	delete Core.storage;
	delete Core.handlers.guid;
	delete Core.handlers.fid;
	delete Core.handlers.createListener;
	Core.forEach(Core.handlers, function(guid, handler) {
		Core.forEach(handler.events, function(type) {
			Core.unbind(handler.link, type, handler.listener);
		}, handler);
	});
	delete Core.handlers;
});

// Создаем короткую ссылку на Core
if(typeof $ == "undefined") {
	this.$ = Core;
}