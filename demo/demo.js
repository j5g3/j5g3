
function onload()
{
var
	list = j5g3.id('demos'),
	raf  = j5g3.id('raf'),
	url, g3, demoObj,
	demo = location.hash.substr(1),
	onAjax = function(code)
	{
		if (g3)
			g3.destroy();

		demoObj = eval(code); 

		// Clear all styles
		j5g3.id('screen').setAttribute('style', '');

		g3 = j5g3.engine({
			useAnimationFrame: raf.checked,
			startFn: demoObj
		});
	},

	onListChange = function()
	{
		url = (this.value.toLowerCase() + '.js?rnd=' + (new Date()).getTime());
		location.hash = '#' + this.value;

		j5g3.io.get(url, onAjax);
	},

	onRafChange = function()
	{
		list.onchange();
	}
;
	list.onchange = onListChange;
	raf.onchange = onRafChange;


	window.view_source = function()
	{
		url = list.value.toLowerCase() + '.js';
		window.open(url, '_blank');			
	}

	if (demo)
		list.value = demo;

	list.onchange();
}

j5g3.ready(onload);
