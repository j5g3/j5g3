
(function (j5g3)
{
var
	LIFE = 30,
	RADIUSMIN = 1,
	RADIUS = 30,
	COUNT = 50,

	SIZE = 1,

	Particle = j5g3.Dot.extend({

		width: SIZE,
		height: SIZE,
		line_cap: 'round',
		line_join: 'round',
		line_width: SIZE,
		red: 255,
		green: 148,
		blue: 30,
		color_property: 'stroke',

		init: function()
		{
			this.x = $input.x - RADIUSMIN+j5g3.rand(RADIUSMIN*2);
			this.y = $input.y - RADIUSMIN+j5g3.rand(RADIUSMIN*2);

			j5g3.Dot.apply(this);
		}

	}),

	Tween = j5g3.Tween.extend({
		auto_remove: true, duration: LIFE
	}),

	on_emit = function(clip)
	{
		this.add(new Tween({
			target: clip, to: {
				alpha: 0,
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
});
