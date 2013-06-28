(function(j5g3) {
var
	ROWS = 15,
	COLS = 16,
	COLORS = [ 'red', 'green', 'yellow', 'blue', 'white' ],
	TW = this.stage.width / COLS,
	TH = this.stage.height / ROWS,
	GRAVITY = TH/4,

	Bubble = j5g3.Circle.extend({

		line_width: 3,
		gravityY: 0,
		gravityX: 0,

		init: function Bubble(p)
		{
			j5g3.Circle.apply(this, [ p ]);

			this.radius = (TW>TH ? TH : TW)/2 - 2;
			this.fill = COLORS[j5g3.irand(COLORS.length)];
		},

		_paint: j5g3.Circle.prototype.paint,

		paint: function(context)
		{
			if (this.gravityY>0)
			{
				this.gravityY -= GRAVITY;
				this.y += GRAVITY;
			} else
				this.gravityY=0;

			if (this.gravityX>0)
			{
				this.gravityX -= GRAVITY;
				this.x += GRAVITY;
			} else
				this.gravityX = 0;

			this._paint(context);
		}
	}),

	Board = j5g3.Clip.extend({

		selected: null,

		compare: function(s, x, y)
		{
			return this.map[y][x] && !this.map[y][x].stroke && s.fill === this.map[y][x].fill;
		},

		select: function(x, y, sprite)
		{
			sprite = this.map[y][x];

			if (!sprite)
				return;

			sprite.stroke = '#eee';
			this.selected.push(sprite);

			if (y > 0 && this.compare(sprite, x, y-1))
				this.select(x, y-1);
			if (y < (ROWS-1) && this.compare(sprite, x, y+1))
				this.select(x, y+1);
			if (x < (COLS-1) && this.compare(sprite, x+1, y))
				this.select(x+1, y);
			if (x > 0 && this.compare(sprite, x-1, y))
				this.select(x-1, y);

			this.points.text = this.getPoints(this.selected.length);
		},

		popBubble: function(bubble)
		{
		var
			col = bubble.boardX,
			row, b
		;
			bubble.remove();
			for (row = bubble.boardY; row>0; row--)
			{
				if ((b = this.map[row-1][col]))
				{
					b.gravityY += TH;
					b.boardY += 1;
				}
				this.map[row][col] = this.map[row-1][col];
			}

			this.map[0][col] = null;
		},

		getPoints: function(n)
		{
			return Math.pow(n, 2);
		},

		removeColumn: function(col)
		{
		var
			x,y,bubble
		;
			for (x=col; x>=0; x--)
				for (y=0; y<ROWS; y++)
				{
					bubble = this.map[y][x-1];

					this.map[y][x] = bubble;
					if (bubble)
					{
						bubble.boardX = x;
						bubble.gravityX += TW;
					}
				}
		},

		checkColumns: function()
		{
		var
			x, y
		;
			main: for (x=1; x<COLS; x++)
			{
				for (y=0; y<ROWS; y++)
					if (this.map[y][x])
						continue main;
				this.removeColumn(x);
			}
		},

		pop: function()
		{
			if (this.selected.length > 1)
			{
				this.selected.forEach(this.popBubble.bind(this));
				this.score.text = parseInt(this.score.text, 10) + this.getPoints(this.selected.length);
				this.checkColumns();
				this.select(this.selected[0].boardX, this.selected[0].boardY);
			}
		},

		reset: function()
		{
			for (i=0; i<this.selected.length; i++)
				this.selected[i].stroke = null;

			this.selected = [];
		},

		init: function Board(p)
		{
		var
			i, a
		;
			j5g3.Clip.apply(this, [p]);

			this.map = j5g3.ary(COLS, ROWS, 0);
			this.points = j5g3.text({ text: '0', font: '18px Arial', fill: 'white', x: 550, y: 22 });
			this.score = j5g3.text({ text: '0', font: '30px Arial', fill: 'yellow', x: 300, y: 36 });

			this.selected = [];

			this.add([ this.points, this.score ]);

			for (i=2; i<ROWS; i++)
			{
				for (a=0; a<COLS; a++)
					this.map[i][a] = new Bubble({
						boardX: a,
						boardY: i,
						x: TW/2 + a*TW,
						y: TH/2 + i*TH
					});
				this.add(this.map[i]);
			}

		}
	}),

	Game = j5g3.Class.extend({

		canvas: null,

		onMouseMove: function()
		{
			this.board.reset();
			this.board.select(Math.floor(mouse.x/TW), Math.floor(mouse.y/TH));
		},

		onClick: function()
		{
			this.board.pop();
		},

		init: function(engine)
		{
			this.canvas = engine.stage.canvas;
			mouse.move = this.onMouseMove.bind(this);
			mouse.buttonY = this.onClick.bind(this);

			this.engine = engine;
			this.board = new Board();

			engine.stage.add(this.board);
			engine.fps = 32;
		},

		run: function()
		{
			this.engine.run();
		}
	}),

	game = new Game(this)
;

	game.run();

})
