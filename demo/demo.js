
function onload()
{
var
	// GLOBALS
	$loader = j5g3.loader(),
	$input,
	$engine,

	// LOCALS
	list = j5g3.id('demos'),
	demo = location.hash.substr(1),
	code,

	get_url = function()
	{
		return list.value.toLowerCase() + '.js?rnd=' + (new Date()).getTime();
	},

	onAjax = function()
	{
		if ($engine)
			$engine.destroy();

		if ($input)
			$input.destroy();

		// Clear all styles
		j5g3.id('screen').setAttribute('style', '');

		$input = j5g3.in('screen');
		$engine = j5g3.engine(eval(code.raw));
	}
;

	list.onchange = function()
	{
		location.hash = '#' + this.value;

		code = $loader.data(get_url());
		$loader.ready(onAjax);
	};

	window.view_source = function()
	{
		window.open(get_url(), '_blank');
	};

	if (demo)
		list.value = demo;

	list.onchange();
}

j5g3.ready(onload);
