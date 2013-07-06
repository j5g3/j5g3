
/*
 * Here we show another way to initialize the application.
 * We demonstrate:
 * - Scaling
 * - Image Initialization
 * - Rotation
 * - Actions
 */

(function (j5g3)
{
var
	logo = $loader.img('img/j5g3.png'),
	img = new j5g3.Image({ source: logo, x: 250, y: 220, sx: -1}),
	rotate = new j5g3.Clip({
		x: 300, y: 100,
		sx: 0.5, sy: 0.5
	}).add(new j5g3.Image({source: logo, x:-125, y: -50})),

	update = j5g3.Action.rotate(rotate),

	sx=0, sy=0
;

	this.stage.canvas.style.backgroundColor = 'white';
	this.stage.add([logo, { source: logo, y:200, sy:-1 }, rotate, update, img ]);

	this.run();
});

