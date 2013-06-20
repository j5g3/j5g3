
(function (j5g3)
{
var
	effect, y = 30, x = 40,
	txt = j5g3.fx.Text,
	fx
;

	for (fx in txt)
	{
		this.stage.add(j5g3.text({
			text: fx,
			fill: 'red',
			stroke: 'red',
			x: x, y: y+=54, font: '44px Arial',
			line_width: 4,
			_paint: j5g3.Paint.Text,
			paint: txt[fx]
		}));
	}

	this.fps = 0;
	this.run();
})
