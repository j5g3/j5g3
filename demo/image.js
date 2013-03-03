
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
	img = new j5g3.Image({ source: 'j5g3', x: 250, y: 220, scaleX: -1}),
	rotate = new j5g3.Clip({ 
		x: 300, y: 100,
		scaleX: 0.5, scaleY: 0.5
	}).add(new j5g3.Image({source: 'j5g3', x:-125, y: -50})),

	update = j5g3.Action.rotate(rotate),

	sx=0, sy=0
;

	this.stage.canvas.style.backgroundColor = 'white';
	this.stage.add(['j5g3', { source: 'j5g3', y:200, scaleY:-1 }, rotate, update, img ]);

	this.run();
})

