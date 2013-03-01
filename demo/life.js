(function(j5, g3)
{
var
	COLS = 80,
	ROWS = 60,
	START = 1000,
	COLORS = 40,
	STARTCOLOR = 180,
	MINLIGHT = 30,
	MAXLIGHT = 100,

	W = this.stage.width / COLS,
	H = this.stage.height / ROWS,

	a, x, y,

	map = g3.map({ 
		map: j5.ary(COLS, ROWS, 0),
		_map: j5.ary(COLS, ROWS, 0),
		tw: W,
		th: H,
		sprites: [ null ]
	}), 

	get = function(x, y)
	{
		x = x === COLS ? 0 : (x === -1 ? COLS-1 : x);
		y = y === ROWS ? 0 : (y === -1 ? ROWS-1 : y);

		return (map.map[y] && map.map[y][x] && 1) || 0;
	},

	neighbours = function(x, y)
	{
		return get(x-1, y-1) + get(x, y-1) + get(x+1, y-1) + get(x+1, y) +
			get(x+1, y+1) + get(x, y+1) + get(x-1, y+1) + get(x-1, y);
	},

	update = function()
	{
		for (y=0; y<ROWS; y++)
			for (x=0; x<COLS; x++)
			{
				a = neighbours(x, y);
				map._map[y][x] = (a === 2 && map.map[y][x] || a===3) ? 
					(map.map[y][x]<COLORS ? map.map[y][x]+1 : COLORS)
				: 
					0;
			}

		a = map.map;
		map.map = map._map;
		map._map = a;
	}
;

	for (a=0; a<START; a++)
		map.map[j5.irand(ROWS)][j5.irand(COLS)] = 1;

	// Generate Colors
	//x = Math.round((255-STARTCOLOR) / COLORS);
	// x is lightning change
	x = Math.round((MAXLIGHT-MINLIGHT)/COLORS);
	// y is the hue change
	y = Math.round(360/COLORS);
	for (a=1; a<=COLORS; a++)
	{
		//y = STARTCOLOR + x * a;
		map.sprites.push(g3.rect({ 
			fill: g3.hsla(STARTCOLOR + y*a, 100, MINLIGHT + x*a),
			width: W, height: H
		}));
	}
	
	this.stage.add([ map, update ]);

	this.fps(32).run();
})
