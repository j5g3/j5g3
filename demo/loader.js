

(function(j5g3) {

var
	NUM = 10,
	LIFE = 25,
	COLOR = '#eee',

	i=0,a=0,
	angle = Math.PI*2/NUM,
	speed = LIFE/NUM,

	loader = j5g3.clip({ line_width: 25, line_join: 'round' }).align('center middle', this.stage),
	line
;
	
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

		loader.add([ line, tween ]);
	}

	this.stage.add(loader);
	this.fps(32).run();
})
