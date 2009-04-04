window.onload = function() {

	var pos = bodyOffsets(), node = document.createElement('div');
	node.className = 'rect';
	node.style.top = pos.top + 'px';
	node.style.left = pos.left + 'px';
	//document.body.appendChild(node);
	document.documentElement.appendChild(node);
};