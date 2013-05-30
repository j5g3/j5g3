(function (j5g3, engine)
{
var
	MAX_BALLS = 1050,
	RADIUS = j5g3.id('ball').width/2,
	MAX_SPEED = 5,
	WIDTH = this.stage.width,
	HEIGHT= this.stage.height,
	MAX_X = WIDTH-RADIUS,
	MAX_Y = HEIGHT-RADIUS,
	
	layer1 = j5g3.stage({
		width: this.stage.width,
		height: this.stage.height,
		canvas: j5g3.id('background'),
		draw: j5g3.Draw.RootDirty
	}),
	
	cont = j5g3.clip(),
	
	background = j5g3.image('tunnel')
		.stretch(this.stage.width, this.stage.height),
	text = j5g3.text({ font: '30px sans-serif', y: 40, x: 10, fill: '#eee' }),
	
	Ball = j5g3.Image.extend({
		
		source: 'ball',
		cx: -RADIUS,
		cy: -RADIUS,
		vx: 6,
		vy: 6,

		init: function()
		{
			j5g3.Image.apply(this);
			
			this.pos(j5g3.irand(MAX_X), j5g3.irand(MAX_Y));
		},
		
		update: function()
		{
			this.x += this.vx;
			this.y += this.vy;
			
			if (this.x > MAX_X)
			{
				this.vx = -this.vx;
				this.x = MAX_X;
			} else if (this.x < RADIUS)
			{
				this.vx = -this.vx;
				this.x = RADIUS;
			}
			if (this.y > MAX_Y)
			{
				this.vy = -this.vy;
				this.y = MAX_Y;
			} else if (this.y < RADIUS)
			{
				this.vy = -this.vy;
				this.y = RADIUS;
			}
		},

		draw: j5g3.Draw.FastImage
	}),

	i,
	
	layers = false
;
	this.stage.add([ layer1, cont ]);
	
	for (i = 0; i < MAX_BALLS; i++)
		this.stage.add(new Ball());

	mouse.click = function() {
		
		layers = !layers;
		if (layers)
		{
			text.set({ text: 'Layers Enabled' });
			layer1.add([ background, text ]);
		}
		else
		{
			text.set({ text: 'Layers Disabled' }).remove();
			cont.add([ background, text ]);
		}
		layer1.invalidate();
	};
	
	mouse.click();
	
	this.run();
})
