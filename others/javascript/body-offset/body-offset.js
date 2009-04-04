function bodyOffsets() {

	var top = 0;
	var left = 0;

	var doc = document;
	var body = doc.body;
	var documentElement = doc.documentElement;

	var ie = /*@cc_on!@*/false;
	var opera = window.opera && window.opera.version;
	var webkit = navigator.userAgent.toLowerCase().indexOf('webkit') != -1;
	var standards = doc.compatMode === 'CSS1Compat';

	var node = doc.createElement('div');

	var computedStyle = ie ? function(node) {
		return node.currentStyle;
	} : function(node) {
		return doc.defaultView.getComputedStyle(node, null);
	};

	var style = computedStyle(body);

	if(standards) {
		if(node.getBoundingClientRect) {
   		// IE, Firefox 3, Opera 9.5, Google Chrome 2
			var rect = body.getBoundingClientRect();
			top = rect.top + documentElement.scrollTop;
			left = rect.left + documentElement.scrollLeft;
		}
		else {
			// Firefox 2, Opera 9, Safari
			if(style.position == 'static') {
				node.style.cssText = 'position: static; margin: 0; padding: 0; float: none; width: auto; height: auto; border: none;';
				body.insertBefore(node, body.firstChild);
				top = node.offsetTop - (parseInt(style.paddingTop) || 0);
				left = node.offsetLeft - (parseInt(style.paddingLeft) || 0);
				if(opera) {
					top -= parseInt(style.borderTopWidth) || 0;
					left -= parseInt(style.borderLeftWidth) || 0;
				}
				body.removeChild(node);
			}
			else if(style.position == 'relative') {
				if(!webkit) {
					// Opera 9
					if(doc.elementFromPoint) {
						var element, top1;
						node.style.cssText = 'position: absolute; top: 0; left: 0; width: 10px; height: 10px; z-index: 99999;';
						node.specialKey = 1;
						top = parseInt(style.marginTop) || 0;
						top1 = top + (parseInt(style.borderTopWidth) || 0);
						left = -1;
						body.appendChild(node);
						while(element = doc.elementFromPoint(++left, top1)) if(element.specialKey) break;
						body.removeChild(node);
						left -= parseInt(style.borderLeftWidth) || 0;
					}
					else {
						// Firefox 2
						// как победить?
					}
				}
				else {
					// Safari
					top = parseInt(style.marginTop) || 0;
					left = parseInt(style.marginLeft) || 0;
				}
			}
		}
	}
	else {
		// Quirks Mode
	}
	
	return {top: top, left: left};
}