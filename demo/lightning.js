(function(j5g3) {
var
	ox = this.stage.width/2,
	oy = this.stage.height/2,

	light = function(x, y)
	{
	var
		clip = j5g3.clip({ stroke: '#eef' })
	;
		clip.add([
			j5g3.line({ cx: ox, cy: oy, x2: x, y2: y }),
			j5g3.line({ alpha: 0.5, line_width: 3, cx: ox, cy: oy, x2: x, y2: y }),
			j5g3.line({ alpha: 0.3, line_width: 6, cx: ox, cy: oy, x2: x, y2: y }),
			j5g3.tween({
				duration: 5,
				auto_remove: true,
				on_remove: function()
				{
					clip.remove();
				}
			})
		]);

		stage.add(clip);
	},
	stage = this.stage
;

	$input.buttonY = function()
	{
		light(this.x, this.y);
	};
	stage.canvas.style.backgroundColor = '#000';

	this.run();
})