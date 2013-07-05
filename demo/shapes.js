
(function (j5g3)
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
		return 'rgb(' + j5g3.irand(255) + ',' + j5g3.irand(255) + ', ' + j5g3.irand(255) + ')';
	},
	create = function()
	{
		p = {
			radius: 40 + j5g3.irand(30),
			x: 50 + j5g3.irand(560),
			y: 50 + j5g3.irand(400),
			fill: get_color(),
			sx: j5g3.rand(3),
			sy: j5g3.rand(3),
			line_width: 1,
			stroke: get_color(),
			rotation: j5g3.rand(Math.PI*2)
		};

		sides = 1 + j5g3.irand(8);

		polygons.push(sides===2 ? j5g3.circle(p) : (sides===1 ? j5g3.rect(p) : j5g3.Polygon.create(sides, p)));
		return polygons[polygons.length-1];
	},

	old,

	on_mouse = function()
	{
		if (old)
		{
			old.line_width = 1;
			stage.canvas.style.cursor = '';
		}

		if ((old = stage.at(this.x, this.y)))
		{
			old.line_width = 5;
			stage.canvas.style.cursor = 'pointer';
		}
	}

;
	for (i=0; i<MAX; i++)
		this.stage.add(create());

	$input.move = on_mouse;

	stage.scale(0.7, 0.7);
	stage.pos(100,50);

	this.run();
})
