
(function (j5g3)
{
var
	ss = j5g3.spritesheet('batman').grid(6, 7),
	map = j5g3.map({
		y: 150,
		x: 110,
		cx: -100,
		cy: -100,
		tw: 100,
		th: 100,
		width: 400,
		height: 300,

		sprites: ss.sprites(),
		map: [
			[0, 1, 2, 3, 4, 5],
			[6, 7, 8, 9, 10, 11],
			[12, 13, 14, 15, 16, 17],
			[18, 19, 20, 21, 22, 23]
		]
	}),
	text = j5g3.text({
		y: 40,
		font: '30px sans-serif',
		fill: '#eee'
	}),
	cache = true
;

	$input.click = function() {
		if (cache)
		{
			map.clear_cache();
			text.text = 'Cache Disabled';
		} else
		{
			map.cache();
			text.text = 'Cache Enabled';
		}

		cache = !cache;
	};

	$input.click();

	this.stage.add([ map, text ]);
	this.run();
})