
(function(j5g3) {
var
	LW = 8,
	NUM = 50,
	STEP = 5,

	i=0,

	on_emit = function(clip)
	{
		clip.radius = 1;
		clip.stroke= j5g3.hsla(i<255 ? i+=STEP : i=0, 80, 50);
		clip.line_width = LW;
		clip.cx = clip.cy = -1;

		this.parent.add(j5g3.tween({
			target: clip, duration: NUM,
			auto_remove: true, to: {
				alpha: 0,
				radius: NUM*LW,
				cx: -NUM*LW,
				cy: -NUM*LW
			}
		}));
	},

	emitter = j5g3.emitter({
		source: j5g3.Circle,
		count: 1,
		life: NUM,
		x: this.stage.width/2,
		y: this.stage.height/2,
		on_emit: on_emit
	})
;

	this.fps = 60;
	this.stage.add(emitter);
	this.run();
})
