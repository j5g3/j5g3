
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
		return 'rgb(' + (128+j5.irand(128)) + ',' + (128+j5.irand(128)) + ', ' + (128+j5.irand(128)) + ')';
	},
	create = function()
	{
		p = {
			radius: 20 + j5.irand(30),
			x: 50 + j5.irand(560),
			y: 50 + j5.irand(400),
			stroke: get_color(),
			scaleX: 1+j5.rand(1),
			scaleY: 1+j5.rand(1),
			rotation: j5.irand(3.14)
		};
		
		sides = 2; 

		polygons.push(sides===2 ? g3.circle(p) : g3.Polygon.create(sides, p));
		return polygons[polygons.length-1];
	},

	do_collision = function(a, b)
	{
		coll = j5.p4.CollisionTest.test(a, b, result);

		for (z=0; z<result.length; z+=5)
		{
			stage.add([
				g3.line({ x: a.x, y: a.y, x2: b.x-a.x, y2: b.y-a.y, line_width: 5, stroke: '#eee' }),
				g3.line({ 
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
