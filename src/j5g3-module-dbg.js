/*
 * Debug Module for j5g3
 */

/*jshint white:false smarttabs:true */
(function(j5, undefined)
{
var 
	g3 = j5.g3,
	Debug = 

	/**
	 * Debug Module for j5g3
	 */
	j5.g3.Debug = { }, 
	screen,
	i, time
;

	/* Assign klass name to klass property. */
	for(i in g3)
		if (typeof(g3[i])==='function') g3[i].klass = i;

	/* Add Timing and FPS */
	Debug.oldGameLoop = g3.GameEngine.prototype._gameLoop;

	g3.GameEngine.prototype._gameLoop = function()
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

	g3.DisplayObject.prototype.extend = function(props)
	{
		for (var i in props)
		{
			if ((typeof this[i] === 'function') && i.indexOf('on_')!==0)
				j5.warn('Overriding function ' + i); 
			this[i] = props[i];
		}
	};

	g3.Image.prototype._get_source = function(src) 
	{
		var source = (typeof(src)==='string') ? j5.id(src) : src;

		if (source===null)
			throw "Could not load Image '" + src + "'";
		return source;
	};

})(j5);

