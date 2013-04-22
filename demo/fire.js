
(function (j5g3)
{
var 
	LIFE = 20,
	RADIUSMIN = 4,
	RADIUS = 50,
	COUNT = 40,

	SIZE = 5,

	on_emit = function(clip)
	{
		clip.pos(mouse.x-RADIUSMIN+j5g3.rand(RADIUSMIN*2), mouse.y-RADIUSMIN+j5g3.rand(RADIUSMIN*2));
		clip.line_cap = null;
		clip.line_join = null;
		clip.line_width = SIZE;
		clip.red = 255;
		clip.green= 148;
		clip.blue= 30;
		clip.color_property = 'stroke';

		this.add(j5g3.tween({ 
			auto_remove: true, duration: LIFE,
			target: clip, to: { 
				alpha: 0.1, 
				y: mouse.y-RADIUS+j5g3.rand(RADIUS*2), 
				x: mouse.x-RADIUS+j5g3.rand(RADIUS*2),
				red: 255, green: 0, blue: 0
			} 
		}));
	},

	e1 = j5g3.emitter({ 
		source: j5g3.Dot,
		count: COUNT,
		life: LIFE,
		on_emit: on_emit
	}),

	canvas = this.stage.canvas
;
	
	e1.blending = 'lighter';

	this.stage.add([ e1 ]);
	this.run();
})
