/*
 * Debug Module for j5g3
 */

(function(j5g3, undefined)
{
var
	Debug =

	/**
	 * Debug Module for j5g3
	 */
	j5g3.Debug = { },
	screen,
	i, time
;

	/* Assign klass name to klass property. */
	for(i in j5g3)
		if (typeof(j5g3[i])==='function') j5g3[i].klass = i;

	/* Add Timing and FPS */
	Debug.oldGameLoop = j5g3.Engine.prototype._gameLoop;

	j5g3.Engine.prototype._gameLoop = function()
	{
		time = (new Date()).getTime();
		Debug.oldGameLoop.apply(this);
		time = (new Date()).getTime() - time;

		var
		    afps = 1000/time,
		    fps = this.fps()
		;
		if (!screen)
		    screen = this.stage.canvas.getContext('2d');

		screen.save();
		screen.fillStyle = '#009900';
		screen.font = 'bold 18px Arial';
		screen.translate(0, 20);
		screen.fillText(Math.round(fps < afps ? fps : afps) + " FPS", 0, 0);
		screen.restore();
	};

	j5g3.DisplayObject.prototype.extend = function(props)
	{
		for (var i in props)
		{
			if ((typeof this[i] === 'function') && i.indexOf('on_')!==0)
				j5g3.warn('Overriding function ' + i);
			this[i] = props[i];
		}
	};

	j5g3.Image.prototype._get_source = function(src)
	{
		var source = (typeof(src)==='string') ? j5g3.id(src) : src;

		if (source===null)
			throw "Could not load Image '" + src + "'";
		return source;
	};

})(this.j5g3);

