
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
		return 'rgb(' + (128+j5g3.irand(128)) + ',' + (128+j5g3.irand(128)) + ', ' + (128+j5g3.irand(128)) + ')';
	},
	create = function()
	{
		p = {
			radius: 20 + j5g3.irand(30),
			x: 50 + j5g3.irand(560),
			y: 50 + j5g3.irand(400),
			stroke: get_color(),
			sx: 1+j5g3.rand(1),
			sy: 1+j5g3.rand(1),
			rotation: j5g3.irand(3.14)
		};
		
		sides = 2; 

		polygons.push(sides===2 ? j5g3.circle(p) : j5g3.Polygon.create(sides, p));
		return polygons[polygons.length-1];
	},

	do_collision = function(a, b)
	{
		coll = j5g3.p4.CollisionTest.test(a, b, result);

		for (z=0; z<result.length; z+=5)
		{
			stage.add([
				j5g3.line({ x: a.x, y: a.y, x2: b.x-a.x, y2: b.y-a.y, line_width: 5, stroke: '#eee' }),
				j5g3.line({ 
					x: a.x+result[z], 
					y: a.y+result[z+1], 
					x2: result[z+2]*result[z+4], 
					y2: result[z+3]*result[z+4], 
					line_width: 5, 
					stroke: '#f00'
				})
			]);
		}

		result = []
	}
;
	stage.scale(0.5, 0.5).pos(150, 100);

	for (i=0; i<MAX; i++)
		this.stage.add(create());

	for (i=0; i<MAX; i++)
		for (a = MAX-1; a>i; a--)
			do_collision(polygons[i], polygons[a]);
	
	this.run();
})
