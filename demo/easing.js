
(function (j5, g3)
{
var 
	ss = g3.spritesheet('batman').grid(6, 7),
	
	to= { x: 280 },
	me = this,
	y = -10,
	x = 0,

	t = g3.text({ x: 610, y: 14 }),

	add = function(easing)
	{
	var
		a = ss.clip(16,17,18,19,20,21,22,23,24,25).pos(x, y+=20).scaleT(2).scale(0.2, 0.2)
	;
		me.stage.add([ 
			a, 
			g3.tween({ target: a, to: to, easing: j5.fx.Easing[easing] }),
			g3.text({ text: easing, y: y+20, x: x+100, font: '20px Serif' })
		]);

		if (y > 440) { 
			y = -10; x += 330; to = { x: 600 }
		}
	},
	i
;
	for (i in j5.fx.Easing)
		add(i);

	this.stage.add([ t, function() { t.text = 't=' + me.stage.frames[0][1].t; }]);
	this.stage.canvas.style.backgroundColor = 'white';

	this.fps(32).run();
})
