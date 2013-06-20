
(function(j5g3) {

var
	image = j5g3.image('earth').pos(180, 0),
	reflection = j5g3.image('earth').set({ x: 180, y: 269*2, sy: -1, alpha: 0.8 }),
	gradient = j5g3.gradient(0, 0, 0, 269),

	mask = j5g3.rect({
		x: 180, y:269, width: 266, height: 269,
		fill: gradient
	})
;

	gradient.addColorStop(0.5, '#000');
	gradient.addColorStop(0, 'transparent');

	this.stage.add([image, reflection, mask]);

	this.fps = 0;
	this.run();
})
