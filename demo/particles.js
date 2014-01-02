
(function (j5g3)
{
var
	duration = 50,
	MIN_RADIUS = 60,
	MAX_RADIUS = 200,
	COUNT = 10,

	diamond = j5g3.dom.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPxJREFUeNqckzEKwjAUhlPB6hm8QUd1EbpVRHAS0eO0N3DuIVx0EaSoHbtoR2/gFVorGv/oSwnRIfHBlwba/Pnf63sO53zDGLuCNdgxs/DAAvQZBCL+iQfIwRL4gGl4IAQpKOlM7IgXUMpBS7nhDs4gARUIwAC0lW+eYCLVU24fwi1rkNqe2cfhvSr5FRa3V7JOapGOFgKZPNf4smQWidyoAq6FQPVLYGQhENQ7ysWnwphGQYWvHcxA08KBaKi5mkLwRx8MxSJaeYznVqtHCTL6My7Vp6e5vIGuyD+mvEpq6VDmp+HToOU0eCIih8b5BFbgYmhfuJ6CzkuAAQBw8IUZ2uqgnAAAAABJRU5ErkJggg=="),

	star = j5g3.dom.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAO5JREFUeNpi/P//PwMeEA3EL4B4Ly4FjAQM2APEH4E4GKcKkAE4sD0Q/wXi30BshEsdEx7b04AYJM8CxDmkukANiL/+R4DPQKyCTS0oDJKA5kgBsTgSlodiZPAIiB8C8WsgfgnEr4D4KcgUbyB+/Z908AKInWBOMQXiOyRovgXE+uAYRPKPIhCfIULzKSCWg+lDDxRhIL6LR/NDIBbEF42fgVgIT9SKgiIOWQDdAEsgFsBjACcQW+AzwADNNZ1A3AjE75DEDfElpPnQ5Lscmphg4rJAPAeIfwHxKmQ96AYsBGJnPPkDFN0LkMUAAgwAJMvR40MRRPUAAAAASUVORK5CYII="),

	on_emit= function(clip)
	{
		clip.pos(
			$input.x+j5g3.rand(MIN_RADIUS*2)-MIN_RADIUS,
			$input.y+j5g3.rand(MIN_RADIUS*2)-MIN_RADIUS
			)
			.scale(0.4, 0.4)
		;

		clip.source = ([diamond, star])[j5g3.irand(2)];
		clip.line_width = 6;
		clip.stroke= ([ 'white', 'red', 'yellow', 'cyan' ])[Math.floor(j5g3.rand(4))];
		clip.rotation = j5g3.rand(3);

		this.parent.add(j5g3.tween({
			auto_remove: true, target: clip, duration: duration,
			to: {
				alpha: 0,
				y: $input.y-MAX_RADIUS+j5g3.rand(MAX_RADIUS*2),
				x: $input.x-MAX_RADIUS+j5g3.rand(MAX_RADIUS*2)
			}
		}));
	},

	e1 = j5g3.emitter({ source: j5g3.Dot, count: COUNT, life: duration, on_emit: on_emit }),
	e2 = j5g3.emitter({ source: j5g3.Image, count: COUNT, life: duration, on_emit: on_emit }),

	canvas = this.stage.canvas
;
	canvas.style.backgroundColor = 'black';

	this.stage.add([ e1, e2 ]);

	this.run();

});