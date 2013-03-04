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
	j5g3.dbg = {

		error: function(msg)
		{
			throw new Error(msg);
		},

		override: function(Klass, property, fn)
		{
		var
			name = Klass.name + '.' + property
		;
			Debug[name] = Klass.prototype[property];
			Klass.prototype['__' + property] = Debug[name];

			Klass.prototype[property] = fn;
		}
	},

	screen,

	loop = function(fn)
	{
		return function()
		{
			this._oldTime = this._time;
			this._time = (new Date()).getTime();

			fn.apply(this);

			if (screen===undefined)
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
	/* Add Timing and FPS */
	Debug.oldGameLoop = proto._gameLoop;
	Debug.oldRafGameLoop = proto._rafGameLoop;

	proto._gameLoop = loop(Debug.oldGameLoop);
	proto._rafGameLoop = loop(Debug.oldRafGameLoop);

	Debug.override(j5g3.DisplayObject, 'remove', function()
	{
		if (this.parent === null)
		{
			j5g3.log(this);
			Debug.error("Trying to remove object without parent.");
		}

		this.__remove();
	});

	Debug.override(j5g3.DisplayObject, 'stretch', function(sx, sy)
	{
		if (!this.width || !this.height)
			Debug.error("Objects without width or height cannot be stretched.");

		return this.__stretch(sx, sy);
	});

	j5g3.DisplayObject.prototype.extend = function(props)
	{
		for (var i in props)
		{
			if ((typeof this[i] === 'function') && i.indexOf('on_')!==0)
				j5g3.warn('Overriding function ' + i, this);

			if (i[0]==='_')
				j5g3.warn('Overriding private member ' + i, this);

			this[i] = props[i];
		}
	};

	j5g3.Image.prototype._get_source = function(src)
	{
		var source = (typeof(src)==='string') ? j5g3.id(src) : src;

		if (source===null)
			Debug.error("Could not load Image '" + src + "'");
		return source;
	};

})(this.j5g3);

