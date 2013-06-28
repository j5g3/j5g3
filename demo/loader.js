

(function(j5g3) {

var
	NUM = 10,
	LIFE = 25,
	COLOR = '#eee',

	i=0,a=0,
	angle = Math.PI*2/NUM,
	speed = LIFE/NUM,

	loader_clip = j5g3.clip({ line_width: 25, line_join: 'round' }).align('center middle', this.stage),
	text = j5g3.text({ x: -50, y: -10, font: '30px Arial', fill: 'white' }),
	loader = j5g3.loader(),

	tween,
	line
;

	loader.img('img/tunnel.jpg');
	loader.audio('audio/pop.ogg');
	loader.script('pong.js');

	for(; i<NUM; i++, a-=angle)
	{
		line = j5g3.line({
			cx: 70, x2: 150,
			stroke: COLOR, rotation: a
		});

		tween = j5g3.tween({
			target: line, t: i*speed,
			duration: LIFE, from: { alpha: 1 }, to: { alpha: 0.2 }
		});

		loader_clip.add([ line, tween ]);
	}

	loader_clip.add(text);

	loader.on_progress = function(p) {
		text.text = Math.round(p*100) + '%';
	};
	loader.ready(function() { text.text = 'READY'; });

	this.on_destroy = function()
	{
		loader.destroy();
	};

	this.stage.add(loader_clip);
	this.run();
})
