/* js-core AJAX module, version 0.3.0
   Copyright (c) 2009 Dmitry Korobkin
   Released under the MIT License
   More information: http://www.js-core.ru/
   Warning: do not use timeout for more then 2 XHR at one time!
*/
Core.ajax = function() {
	if(this.ajax) return new this.ajax();
	this.xhr = typeof XMLHttpRequest == "undefined" ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest;
	return this;
};
Core.ajax.type = {
	html: 'text/html',
	text: 'text/plain',
	xml: 'application/xml, text/xml',
	json: 'application/json, text/javascript',
	script: 'text/javascript, application/javascript',
	'default': 'application/x-www-form-urlencoded'
};
Core.ajax.accept = '*\/*';
Core.ajax.prototype.open = function(params) {
	Core.extend(this, {
		method: params.method || 'GET',
		url: params.url || location.href,
		async: params.async !== false,
		user: params.user || null,
		password: params.password || null,
		params: params.params || null,
		processData: params.processData === true,
		timeout: params.timeout || 0,
		contentType: Core.ajax.type[params.contentType] || Core.ajax.type['default'],
		dataType: Core.ajax.type[params.dataType] ? Core.ajax.type[params.dataType] + ', *\/*' : Core.ajax.accept,
		requestHeaders: params.requestHeaders || null,
		success: params.success,
		error: params.error
	});
	if(this.params) {
		var process = this.process;
		params = [];
		Core.forEach(this.params, function(key, value) {
			params.push([key, '=', process ? encodeURIComponent(value) : value].join(''));
		});
		this.params = params.join('&');
	}
	try {
		this.xhr.open(this.method, this.method == 'GET' && this.params ? this.url + '?' + this.params : this.url, this.async, this.user, this.password);
		this.xhr.setRequestHeader('Accept', this.dataType);
		this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		this.xhr.setRequestHeader('Content-Type', this.contentType);
		var ajax = this;
		if(this.requestHeaders) Core.forEach(this.requestHeaders, function(key, value) {
			ajax.xhr.setRequestHeader(key, value);
		});
		this.xhr.send(this.params);
		(function() {
			if(ajax.xhr.readyState == 4) {
				if(ajax.xhr.status == 200 || ajax.xhr.status == 0 && ajax.success) ajax.success(ajax.xhr.responseText);
				else if(ajax.error && !ajax.aborted) ajax.error(ajax.xhr.statusText);
			}
			else if(!ajax.aborted) setTimeout(arguments.callee, 20);
		})();
		if(this.async && this.timeout) setTimeout(function() {
			if(ajax.xhr.readyState != 4) {
				ajax.xhr.abort();
				ajax.aborted = true;
				if(ajax.error) ajax.error('Time is out');
			}
		}, this.timeout);
	}
	catch(error) {
		if(this.error) this.error(error);
	}
};
Core.get = function(params, success, error) {
	new Core.ajax().open(Core.extend(params, {success: success, error: error}));
	return this;
};
Core.post = function(params, success, error) {
	new Core.ajax().open(Core.extend(params, {method: 'POST', success: success, error: error}));
	return this;
};
Core.getJSON = function(params, callback, error) {
	new Core.ajax().open(Core.extend(params, {dataType: 'json', success: function(response) {
		try {
			// todo remove eval
			callback(window.JSON && JSON.parse ? JSON.parse(response) : eval('(' + response + ')'));
		}
		catch(error) {
			if(this.error) this.error(error);
		}
	}, error: error}));
	return this;
};
Core.prototype.load = function(params, success, error) {
	var _this = this;
	new Core.ajax().open(Core.extend(params, {success: function(response) {
		var control = /^INPUT|BUTTON|TEXTAREA$/;
		_this[control.test(_this.node.tagName) ? 'val' : 'html'](response);
		if(success) success.call(_this.node, response, this.xhr);
	}, error: function(response) {
		if(error) error.call(_this.node, response, this.xhr);
	}}));
	return this;
};

