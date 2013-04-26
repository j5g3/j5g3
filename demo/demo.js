
function onload()
{
var
	list = j5g3.id('demos'),
	url, g3, demoObj,
	xhr = new window.XMLHttpRequest(),
	demo = location.hash.substr(1),
	mouse = mice(j5g3.id('screen')),
	
	onAjax = function(code)
	{
		if (g3)
			g3.destroy();
			
		mouse.move = mouse.click = null;

		demoObj = eval(code); 

		// Clear all styles
		j5g3.id('screen').setAttribute('style', '');

		g3 = j5g3.engine(demoObj);
	}
;
	list.onchange = function()
	{
		url = (this.value.toLowerCase() + '.js?rnd=' + (new Date()).getTime());
		location.hash = '#' + this.value;

		xhr.onreadystatechange = function() {
			if (xhr.readyState===4)
				onAjax(xhr.responseText);
		};
		xhr.open('GET', url);
		xhr.send();
	};

	window.view_source = function()
	{
		url = list.value.toLowerCase() + '.js';
		window.open(url, '_blank');			
	};

	if (demo)
		list.value = demo;

	list.onchange();
}

j5g3.ready(onload);
