
(function (j5, g3)
{
var
	/** @const */ MAP_WIDTH = 21,
	/** @const */ MAP_HEIGHT= 69,
	/** @const */ MAX_POINTS = 8,
	/** @const */ DELAY = 200,
	/** @const */ MOUSE_MOVE = 150,
	/** @const */ MOUSE_RATE = 0.1,

	terrain = g3.spritesheet('iso-terrain').grid(10, 10, 1),

	i, a,
	pt, x, y, prev,

	/* Initialize Map to zero so the animation is possible */
	mapa = j5.ary(MAP_WIDTH, MAP_HEIGHT, 0), 
	rand = j5.irand,
	stage = this.stage,

	/**
	 * points Array of points to modify. [x, y, sprite_index array]
	 */
	expand = function(points)
	{
		var pts = [];

		a = points.length;
		while (a--) {
			pt = points[a];
			x  = pt[0]; y=pt[1];

			if (mapa[y][x])
				continue;

			mapa[y][x]= pt[2][rand(pt[2].length)];
			i=y%2;


			if (x>0 && y>0) pts.push([x-i, y-1, pt[2]]);
			if (y>0 && x<MAP_WIDTH-1+i) pts.push([x+1-i, y-1, pt[2]]);

			if (x<MAP_WIDTH-1+i && y<MAP_HEIGHT-1) pts.push([x+1-i, y+1, pt[2]]);
			if (y<MAP_HEIGHT-1 && x>0) pts.push([x-i,y+1, pt[2]]);
		}

		if (pts.length)
			setTimeout(function() { expand(pts); }, DELAY);
	},
	
	points = [],

	/* Generate a 11x30 map */
	genmap = function()
	{
		for (i=0; i<MAX_POINTS; i++)
		{
			points.push(
				[ rand(MAP_WIDTH), rand(MAP_HEIGHT), [6, 7]],
				[ rand(MAP_WIDTH), rand(MAP_HEIGHT), [2, 3]],
				[ rand(MAP_WIDTH), rand(MAP_HEIGHT), [4, 5]],
				[ rand(MAP_WIDTH), rand(MAP_HEIGHT), [8, 9]]
			);
		}
		
		expand(points);
	},

	rateX=0, rateY=0,

	mouse = function(ev)
	{
		if (ev.layerX > stage.width-MOUSE_MOVE)
			rateX = -ev.layerX + stage.width-MOUSE_MOVE;
		else if (ev.layerX < MOUSE_MOVE)
			rateX = MOUSE_MOVE - ev.layerX;
		else
			rateX = 0;

		if (ev.layerY > stage.height-MOUSE_MOVE) 
			rateY = -ev.layerY + stage.height-MOUSE_MOVE;
		else if (ev.layerY < MOUSE_MOVE)
			rateY = MOUSE_MOVE - ev.layerY;
		else
			rateY = 0;
	},

	update = function()
	{
		map.x += rateX * MOUSE_RATE;
		map.y += rateY * MOUSE_RATE;

		if (map.x < -stage.width) map.x = -stage.width;
		else if (map.x > -32) map.x = -32;
		if (map.y < -stage.height) map.y = -stage.height;
		else if (map.y > -16) map.y = -16;
	},

	map = g3.map({ 
		x: -32, y: -16, 
		sprites: terrain.sprites, 
		th: 32,
		tw: 64,
		map: mapa, 
		offsetX: -1, offsetY: -1,
		width: stage.width,
		height: stage.height
	})
;
	stage.canvas.addEventListener('mousemove', mouse);

	this.on_destroy = function() {
		stage.canvas.removeEventListener('mousemove', mouse);
	}

	map.paint = g3.Paint.Isometric;
	stage.add([map, update]);
	setTimeout(genmap, 250);
	this.run();
})
