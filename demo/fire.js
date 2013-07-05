
(function (j5g3)
{
var
	LIFE = 20,
	RADIUSMIN = 4,
	RADIUS = 50,
	COUNT = 40,

	SIZE = 5,

	Particle = j5g3.Dot.extend({

		line_cap: null,
		line_join: null,
		line_width: SIZE,
		red: 255,
		green: 148,
		blue: 30,
		color_property: 'stroke',

		init: function()
		{
			this.x = $input.x-RADIUSMIN+j5g3.rand(RADIUSMIN*2);
			this.y = $input.y-RADIUSMIN+j5g3.rand(RADIUSMIN*2);

			j5g3.Dot.apply(this);
		}

	}),

	on_emit = function(clip)
	{
		this.parent.add(j5g3.tween({
			auto_remove: true, duration: LIFE,
			target: clip, to: {
				alpha: 0.1,
				y: $input.y-RADIUS+j5g3.rand(RADIUS*2),
				x: $input.x-RADIUS+j5g3.rand(RADIUS*2),
				red: 255, green: 0, blue: 0
			}
		}));
	},

	e1 = j5g3.emitter({
		source: Particle,
		count: COUNT,
		life: LIFE,
		on_emit: on_emit
	})
;

	e1.blending = 'lighter';

	this.stage.add([ e1 ]);
	this.run();
})
