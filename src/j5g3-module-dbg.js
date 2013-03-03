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
	i,

	loop = function(fn)
	{
		return function()
		{
			this._oldTime = this._time;
			this._time = (new Date()).getTime();

			fn.apply(this);

			if (!screen)
			    screen = this.stage.canvas.getContext('2d');

			screen.save();
			screen.fillStyle = '#009900';
			screen.font = 'bold 18px Arial';
			screen.translate(0, 20);
			screen.fillText(Math.floor(1000/(this._time-this._oldTime)) + " FPS", 0, 0);
			screen.restore();
		};
	},

	proto = j5g3.Engine.prototype
;

	/* Assign klass name to klass property. */
	for(i in j5g3)
		if (typeof(j5g3[i])==='function') j5g3[i].klass = i;

	/* Add Timing and FPS */
	Debug.oldGameLoop = proto._gameLoop;
	Debug.oldRafGameLoop = proto._rafGameLoop;

	proto._gameLoop = loop(Debug.oldGameLoop);
	proto._rafGameLoop = loop(Debug.oldRafGameLoop);

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

