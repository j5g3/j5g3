
(function (j5g3)
{
var
	LIFE = 30,
	RADIUSMIN = 1,
	RADIUS = 30,
	COUNT = 50,

	SIZE = 1,

	Particle = j5g3.Dot.extend({

		line_cap: 'round',
		line_join: 'round',
		line_width: SIZE,
		red: 255,
		green: 148,
		blue: 30,
		color_property: 'stroke',

		init: function()
		{
			this.x = RADIUSMIN+j5g3.rand(RADIUSMIN*2);
			this.y = RADIUSMIN+j5g3.rand(RADIUSMIN*2);

			j5g3.Dot.apply(this);
		}

	}),

	on_emit = function(clip)
	{
		this.parent.add(j5g3.tween({
			auto_remove: true, duration: LIFE,
			target: clip, to: {
				alpha: 0,
				y: -RADIUS+j5g3.rand(RADIUS*2),
				x: -RADIUS+j5g3.rand(RADIUS*2),
				red: 255, green: 0, blue: 0
			}
		}));

		e1.x = $input.x; e1.y = $input.y;
		clip.invalidate();
	},

	e1 = j5g3.emitter({
		width: RADIUS*2, height: RADIUS*2,
		source: Particle,
		count: COUNT,
		life: LIFE,
		on_emit: on_emit
	})
;

	e1.blending = 'lighter';

	//this.stage.draw = j5g3.Draw.RootDirty;
	this.stage.add([ e1 ]);
	this.run();
});
