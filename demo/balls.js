
(function (j5g3) {

var 
	MAX_BALLS = 8500,
	RADIUS = j5g3.id('ball').width/2,
	WIDTH = this.stage.width,
	HEIGHT= this.stage.height,
	MAX_X = WIDTH-RADIUS,
	MAX_Y = HEIGHT-RADIUS,

	Ball = j5g3.Image.extend({
		
		source: 'ball',
		
		init: function()
		{
			j5g3.Image.apply(this);
			this.pos(j5g3.rand(MAX_X), j5g3.rand(MAX_Y));
		},

		cx: -RADIUS,
		cy: -RADIUS

	})
;

	for (i = 0; i < MAX_BALLS; i++)
		this.stage.add(new Ball());

	this.run();

})
