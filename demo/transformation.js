
(function (j5g3)
{
var
	stage = this.stage,
	plain = j5g3.text('PLAIN').pos(200, 60),
	reverse = j5g3.text('REVERSE').pos(200, 100).scale(-1, 1),
	rotate = j5g3.text('45 Deg').pos(200, 180).rotate(-Math.PI/4),
	inverse = j5g3.text('BACKWARDS').pos(200, 240).scale(1, -1),
	all = j5g3.text('REVERSE 45 Deg').pos(200, 280).scale(-1, -1).rotate(-Math.PI/4)
;

	stage.font = '30px sans-serif';
	stage.fill= '#eee';

	stage.add([ plain, reverse, rotate, inverse, all ]);

	this.fps = 0;
	this.run();
})
