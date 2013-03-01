
(function (j5, g3)
{
var 
	x=0, y=0,

	LIFE = 20,
	RADIUSMIN = 4,
	RADIUS = 50,
	COUNT = 40,

	SIZE = 5,

	on_emit = function(clip)
	{
		clip.pos(x-RADIUSMIN+j5.rand(RADIUSMIN*2), y-RADIUSMIN+j5.rand(RADIUSMIN*2));
		clip.line_cap = null;
		clip.line_join = null;
		clip.line_width = SIZE;
		clip.red = 255;
		clip.green= 148;
		clip.blue= 30;
		clip.color_property = 'stroke';

		this.add(g3.tween({ 
			auto_remove: true, duration: LIFE,
			target: clip, to: { 
				alpha: 0.1, 
				y: y-RADIUS+j5.rand(RADIUS*2), 
				x: x-RADIUS+j5.rand(RADIUS*2),
				red: 255, green: 0, blue: 0
			} 
		}));
	},

	e1 = g3.emitter({ 
		//source: g3.dot({ lineWidth: SIZE, lineCap: null, lineJoin: null}), 
		container_class: g3.Dot,
		count: COUNT,
		life: LIFE,
		on_emit: on_emit
	}),

	mouse = function(evt)
	{
		x = evt.layerX; y = evt.layerY;
	},

	canvas = this.stage.canvas
;

	canvas.addEventListener('mousemove', mouse);
	e1.blending = 'lighter';

	this.on_destroy = function() {
		canvas.removeEventListener('mousemove', mouse);
	}

	this.stage.add([ e1 ]);
	this.run();
})
