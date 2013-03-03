
/*
 * Here we show another way to initialize the application.
 * We demonstrate:
 * - Scaling
 * - Image Initialization
 * - Rotation
 * - Actions
 */

({
	startFn: function (j5g3)
	{
	var 
		img = new j5g3.Image({ source: 'j5g3', x: 0, y: 200}),
		rotate = new j5g3.Clip({ 
			x: 300, y: 100,
			scaleX: 0.5, scaleY: 0.5
		}).add(new j5g3.Image({source: 'j5g3', x:-125, y: -50})),

		skew = j5g3.clip({ x: 300, y: 150, scaleX: 0.3 }).add(j5g3.image('j5g3')),
		skew2= j5g3.clip({ x: 300, y: 250, scaleX: 0.3 }).add(j5g3.image('j5g3')),
		update = j5g3.Action.rotate(rotate),

		sx=0, sy=0,
		do_skew = j5g3.action(function() { skew.skewX = (sx+=0.05); skew2.skewY = (sy+=0.05); })
	;

		this.stage.canvas.style.backgroundColor = 'white';

		this.stage.add(['j5g3', {source: 'j5g3', y:200, scaleY:-1}, rotate, update, img, skew, skew2, do_skew]);
		this.run();
	},

	on_destroy: function()
	{
		this.stage.canvas.style.backgroundColor = '';
	}
})

