
function onload()
{
var
	list = j5.id('demos'),
	url, g3, demoObj,
	demo = location.hash.substr(1),
	onAjax = function(code)
	{
		if (g3)
			g3.destroy();

		demoObj = eval(code); 

		// Clear all styles
		j5.id('screen').setAttribute('style', '');

		g3 = j5.g3(demoObj);
	}
;
	list.onchange = function()
	{
		url = (this.value.toLowerCase() + '.js?rnd=' + (new Date()).getTime());
		location.hash = '#' + this.value;


		j5.io.get(url, onAjax);
	}

	window.view_source = function()
	{
		url = list.value.toLowerCase() + '.js';
		window.open(url, '_blank');			
	}

	if (demo)
		list.value = demo;

	list.onchange();
}

j5.ready(onload);
