
(function (j5, g3)
{
var 
	effect, y = 30, x = 40,
	stage = this.stage,
	txt = j5.fx.Text,
	fx
;
	
	for (fx in txt)
	{
		stage.add(g3.text({ 
			text: fx, 
			fill: 'red', 
			stroke: 'red',
			x: x, y: y+=54, font: '44px Arial',
			line_width: 4,
			_paint: g3.Paint.Text,
			paint: txt[fx]
		}));
	}
	
	this.fps(0).run();
})
