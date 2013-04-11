
(function (j5g3)
{
var 
	ss = j5g3.spritesheet('batman').grid(6, 7),
	to = { x: 280 },
	y = -10,
	x = 0,
	a, easing
;
	for (easing in j5g3.Easing)
	{
		a = ss.clip([ 16,17,18,19,20,21,22,23,24,25 ]).pos(x, y+=20).scale(0.2, 0.2);

		this.stage.add([ 
			a, 
			j5g3.tween({ target: a, to: to, easing: j5g3.fx.Easing[easing] }),
			j5g3.text({ text: easing, y: y+20, x: x+100, font: '20px Serif' })
		]);

		if (y > 440) { 
			y = -10; x += 330; to = { x: 600 }
		}
	};

	this.stage.canvas.style.backgroundColor = '#eee';

	this.fps(32).run();
})
