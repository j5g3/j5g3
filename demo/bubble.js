(function(j5g3) {
var
	ROWS = 12,
	COLS = 15,
	COLORS = [ 'red', 'green', 'yellow', 'blue', 'white' ],
	TW = this.stage.width / COLS,
	TH = this.stage.height / ROWS,

	sprites = [null],
	selected = [],
	i,
	map = j5g3.ary(COLS, ROWS, 0), 
	stage = this.stage,

	compare = function(s, x, y)
	{
		return !map[y][x].stroke && s.fill === map[y][x].fill;
	},

	select = function(x, y, sprite)
	{
		sprite = map[y][x];
		sprite.stroke = '#eee';
		selected.push(sprite);

		if (y > 0 && compare(sprite, x, y-1))
			select(x, y-1);
		if (y < (ROWS-1) && compare(sprite, x, y+1))
			select(x, y+1);
		if (x < (COLS-1) && compare(sprite, x+1, y))
			select(x+1, y);
		if (x > 0 && compare(sprite, x-1, y))
			select(x-1, y);
	},

	pop = function(x, y)
	{
		for (i=0; i<selected.length; i++)
			selected[i].remove();
			
		selected = [];
	},

	reset = function()
	{
		for (i=0; i<selected.length; i++)
			selected[i].stroke = null; 

		selected = [];
	},

	mouse = function(ev)
	{
		reset();
		select(Math.floor(ev.layerX/TW), Math.floor(ev.layerY/TH));
	},

	click = function(ev)
	{
		pop(Math.floor(ev.layerX/TW), Math.floor(ev.layerY/TH));
	}
;
	for (i=0; i<ROWS; i++)
		for (a=0; a<COLS; a++)
			map[i][a] = j5g3.circle({ 
				x: TW/2 + a*TW, y: TH/2 + i*TH,
				radius: (TW>TH ? TH : TW)/2 - 2, 
				line_width: 3,
				fill: COLORS[j5g3.irand(COLORS.length)]
			});
	
	stage.canvas.addEventListener('mousemove', mouse);
	stage.canvas.addEventListener('click', click);

	this.on_destroy = function() {
		stage.canvas.removeEventListener('mousemove', mouse);
		stage.canvas.removeEventListener('click', click);
	}

	stage.add(map);
	
	this.fps(32).run();
})
