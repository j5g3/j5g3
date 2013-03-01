
(function (j5, g3)
{
var
	MAX = 10,

	sides, p,
	polygons = [],
	result = [],
	stage = this.stage,
	i = 0, a, z,
	coll,

	get_color = function()
	{
		return 'rgb(' + j5.irand(255) + ',' + j5.irand(255) + ', ' + j5.irand(255) + ')';
	},
	create = function()
	{
		p = {
			radius: 40 + j5.irand(30),
			x: 50 + j5.irand(560),
			y: 50 + j5.irand(400),
			fill: get_color(),
			scaleX: j5.rand(3),
			scaleY: j5.rand(3),
			line_width: 1,
			stroke: get_color(),
			rotation: j5.rand(Math.PI*2)
		};
		
		sides = 1 + j5.irand(8);

		polygons.push(sides===2 ? g3.circle(p) : (sides===1 ? g3.rect(p) : g3.Polygon.create(sides, p)));
		return polygons[polygons.length-1];
	},
	
	old,

	on_mouse = function(ev)
	{
		if (old) old.line_width = 1; 
		if (old = stage.at(ev.layerX, ev.layerY))
			old.line_width = 5;
	}

;
	for (i=0; i<MAX; i++)
		this.stage.add(create());

	stage.canvas.addEventListener('mousemove', on_mouse);
	stage.scale(0.7, 0.7);
	stage.pos(100,50);

	this.on_destroy = function()
	{
		stage.canvas.removeEventListener('mousemove', on_mouse);
	}

	this.fps(32).run();
})
