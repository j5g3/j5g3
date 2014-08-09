/**
 * j5g3 - Javascript Graphics Engine
 * http://j5g3.com
 *
 * Copyright 2010-2014, Giancarlo F Bellido
 *
 * j5g3 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * j5g3 is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with j5g3. If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function(window, j5g3, undefined) {
'use strict';

var
	/* This is used by the cache mechanism. It is a canvas element. */
	cache = j5g3.dom('CANVAS'),
	f = j5g3.factory
;


function compute(obj, property)
{
	do {
		if (obj[property] !== null)
			return obj[property];
		if (obj instanceof j5g3.Stage)
			break;

	} while ((obj = obj.parent));
}

j5g3.extend(j5g3, /** @lends j5g3 */ {

	/**
	 * @return {number} A random number from 0 to max
	 */
	rand: function(max) { return Math.random() * max; },

	/**
	 * @return {number} A random integer number from 0 to max.
	 */
	irand: function(max) { return Math.random() * max | 0; },

	/**
	 * Creates an array of w*h dimensions initialized with value v
	 *
	 * @return {Array} Array
	 */
	ary: function(w, h, v)
	{
	/*jshint maxdepth:4 */
		var result = [], x;

		if (h)
			while (h--)
			{
				result[h] = [];
				for (x=0; x<w; x++)
					result[h][x]=v;
			}
		else
			while (w--)
				result.push(v);

		return result;
	},

	/**
	 * Returns a canvas with w, h dimensions.
	 */
	canvas: function(w, h)
	{
	var
		result = j5g3.dom('CANVAS')
	;
		result.setAttribute('width', w);
		result.setAttribute('height', h);

		return result;
	},

	/**
	 * Gets type of obj. It returns 'dom' for HTML DOM objects, 'audio'
	 * for HTMLAudioElement's and 'j5g3' for j5g3.Class descendants.
	 *
	 * @return {String}
	 */
	get_type: function(obj)
	{
		var result = typeof(obj);

		if (result === 'object')
		{
			if (obj === null) return 'null';
			if (obj instanceof Array) return 'array';
			if (obj instanceof j5g3.Class) return 'j5g3';

			if (obj instanceof window.HTMLElement) return 'dom';
			if (obj instanceof window.Image) return 'dom';
			if (obj instanceof window.HTMLAudioElement) return 'audio';
		}

		return result;
	},

	/** Returns a CanvasGradient object. */
	gradient: function(x, y, w, h)
	{
		return cache.getContext('2d').createLinearGradient(x,y,w,h);
	},

	/** @return {String} A rgba CSS color string */
	rgba: function(r, g, b, a)
	{
		if (a===undefined)
			a = 1;

		return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	},

	/** @return {String} A hsla CSS color string */
	hsla: function(h, s, l, a)
	{
		if (a===undefined)
			a = 1;

		return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
	}

});

/**
 * These are all the core rendering algorithms. "this" will point to the current
 * object.
 *
 * @namespace
 */
j5g3.Render =
{
	/**
	 * Draws nothing
	 */
	Void: function() { },

	/**
	 * Default drawing algorithm.
	 */
	Default: function(context, BB)
	{
		if (this.dirty || BB.intersect(this.box))
		{
			this.begin(context);
			this.paint(context, BB);
			this.end(context);
			this.dirty = false;
		}
	},

	/**
	 * Draw with no transformations applied. Faster...
	 */
	NoTransform: function(context)
	{
		this.paint(context);
	},

	/**
	 * Draws Image with no transformations only translation
	 */
	FastImage: function(context)
	{
		context.drawImage(this.source, this.x+this.cx, this.y+this.cy);
	}

};

/**
 * Paint Algorithms. Use this to draw you custom objects after all
 * transformation are applied. Replace the Draw function to add extra
 * steps to the draw process.
 *
 * @namespace
 */
j5g3.Paint = {

	/**
	 * Paints image stored in this.source.
	 */
	Image: function (context)
	{
		context.drawImage(this.source, this.cx, this.cy);
	},

	/**
	 * Image scaled.
	 */
	ImageScaled: function(context)
	{
		context.drawImage(this.source, this.cx, this.cy, this.width, this.height);
	},

	/**
	 * Paints a section of the Image and repeats if necessary
	 */
	ImageRepeat: function(context)
	{
		context.drawImage(this.source, -this.cx, -this.cy, this.width, this.height,
			0, 0, this.width, this.height);
	},

	/**
	 * Drawing function for Sprites
	 */
	Sprite: function (context)
	{
	var
		src = this.source
	;
		context.drawImage(
			src.image, src.x, src.y, src.w, src.h,
			this.cx, this.cy, this.width, this.height
		);
	},

	/**
	 * Paint function for Clips and other containers.
	 */
	Container: function (context, BB)
	{
	var
		frame = this.frame,
		next = frame
	;
		if (this.cx || this.cy)
			context.translate(this.cx, this.cy);

		while ((next=next._next) !== frame)
			next.render(context, BB);
	},

	/**
	 * Draws text using fillText
	 */
	Text: function(context)
	{
		context.fillText(this.text, this.cx, this.cy);
	},

	/**
	 * Draws text with multiline support.
	 */
	MultilineText: function(context)
	{
	var
		text = this.text.split("\n"),
		i = 0,
		l = text.length,
		y = 0
	;
		for (;i<l;i++)
		{
			context.fillText(text[i], this.cx, this.cy + y);
			y += this.line_height;
		}
	},

	/**
	 * Draws text using strokeText function.
	 */
	TextStroke: function(context)
	{
		context.strokeText(this.text, this.cx, this.cy);
	},

	/**
	 * Draws text using fill and stroke
	 */
	TextStrokeFill: function(context)
	{
		context.fillText(this.text, this.cx, this.cy);
		context.strokeText(this.text, this.cx, this.cy);
	},

	/**
	 * Paints a 2D map.
	 */
	Map: function(context, BB)
	{
		var map = this.map, y = map.length, x, sprites = this.sprites, s, cm;

		context.translate(this.cx, this.cy+y*this.th);

		while (y--)
		{
			x = map[y].length;
			cm= map[y];

			context.translate(x*this.tw, -this.th);

			while (x--)
			{
				context.translate(-this.tw, 0);
				if ((s = sprites[cm[x]]))
					s.render(context, BB);
			}
		}
	},

	/**
	 * Paints an isometric map.
	 */
	Isometric: function(context, BB)
	{
	var
		map = this.map, y = 0, x, l=map.length,
		sprites = this.sprites, cm,
		dx = (this.tw/2|0) + this.offsetX,
		dy = (this.th/2|0) + this.offsetY,
		offset, s
	;
		context.translate(this.cx, this.cy-dy);
		offset = dx;

		for (; y<l; y++)
		{
			x = map[y].length;
			cm= map[y];
			offset = -offset;

			context.translate(x*this.tw-offset, dy);

			while (x--)
			{
				context.translate(-this.tw, 0);
				if ((s = sprites[cm[x]]))
					s.render(context, BB);
			}

		}

	},

	/**
	 * Drawing Algorithm for cached display objects.
	 */
	Cache: function(context)
	{
		context.drawImage(this._cache_source, this.cx, this.cy);
	}

};

/**
 *
 * @namespace
 *
 * Caching algorithms for j5g3.DisplayObjects
 *
 */
j5g3.Cache = {

	/**
	 * Caches content into a separate canvas. TODO Optimize
	 */
	Canvas: function(w, h)
	{
	var
		me = this,
		cache_canvas = j5g3.dom('CANVAS'),
		cache_context,
		M = me.M, BB = new j5g3.BoundingBox()
	;
		// This will also clear the canvas.
		cache_canvas.width = w || me.width;
		cache_canvas.height= h || me.height;

		cache_context = cache_canvas.getContext('2d');
		cache_context.translate(-me.cx, -me.cy);

		me.clear_cache();
		me.dirty = true;
		me.M = new j5g3.Matrix();
		BB.set(0,0,me.width, me.height);
		me.render(cache_context, BB);
		me.M = M;

		me._cache_source = cache_canvas;

		me._oldPaint= me.paint;
		me.paint = j5g3.Paint.Cache;

		return this;
	},

	/**
	 * Switches context to CACHE context and executes fn.
	 */
	use: function(fn, scope)
	{
		return fn(scope, cache.getContext('2d'));
	}

};


/**
 * @namespace
 * Hit test algorithms. Assign to 'at' function.
 */
j5g3.HitTest = {

	/**
	 * Always returns false
	 */
	Void: function()
	{
		return false;
	},

	/**
	 * Circle HitTest
	 */
	Circle: function(x, y)
	{
	var
		M = this.box.M.to_client(x, y),
		r = this.radius
	;
		x = M.x-r;
		y = M.y-r;

		return (x*x+y*y <= r*r) ? this : false;
	},

	/**
	 * Test hit in all children.
	 */
	Container: function(x, y)
	{
	var
		frame = this.frame,
		previous = frame,
		result
	;
		while ((previous = previous._previous) !== frame)
			if ((result = previous.at(x, y)))
				break;

		return result;
	},

	/**
	 * Rectangle HitTest
	 */
	Rect: function(x, y)
	{
		var M = this.box.M.to_client(x, y);

		return ((M.x>0 && M.x<this.width)&&(M.y>0 && M.y<this.height)) ? this : false;
	},

	/**
	 * Polygon HitTest
	 */
	Polygon: function(x, y)
	{
	var
		points = this.points,
		normals = this.normals,
		i = 0, l = points.length,
		dot,
		M = this.box.M.to_client(x, y)
	;

		for (; i<l; i+=2)
		{
			dot = normals[i]*(M.x-points[i]) + normals[i+1]*(M.y-points[i+1]);
			if (dot > 0.0)
				return false;
		}

		return this;
	}

};

/**
 * @class
 *
 */
j5g3.DisplayObject = j5g3.Class.extend(/** @lends j5g3.DisplayObject.prototype */ {

	/**
	 * Next display object to render
	 * @type {j5g3.DisplayObject}
	 */
	_next: null,

	/**
	 * Previous display object
	 * @type {j5g3.DisplayObject}
	 */
	_previous: null,

	/**
	 * Parent clip
	 * @type {j5g3.Clip}
	 */
	parent: null,

	/// @type {j5g3.Matrix} Transformation Matrix
	M: null,

	/// @type {j5g3.BoundingBox} Bounding box in World coordinates
	box: null,

	/** X position @type {number} */
	set x(val) { this.M.e = val; this.M.dirty = true; },
	get x() { return this.M.e; },

	/** Y position @type {number} */
	set y(val) { this.M.f = val; this.M.dirty = true; },
	get y() { return this.M.f; },

	/** Offset X for rotation.  @type {number} */
	cx: 0,
	/** Offset Y @type {number} */
	cy: 0,

	/** @private @type {number|null} */
	width: null,
	/** @private @type {number|null} */
	height: null,

	_rotation: 0,

	dirty: true,

	/** Rotation @type {number} */
	set rotation(val)
	{
		this.M.setRotation((this._rotation = val));
	},
	get rotation() { return this._rotation; },

	/** X Scale @type {number} */
	set sx(val) {
		this.M.setScaleX(val);
	},
	get sx() { return this.M.sx; },

	/** Y Scale @type {number} */
	set sy(val) {
		this.M.setScaleY(val);
	},
	get sy() { return this.M.sy; },

	/** ALpha transparency value @type {number} */
	alpha: 1,

	/** Blending Mode. @type {string} */
	blending: null,

	/**
	 * Stroke Style. @type {string}
	 */
	stroke: null,

	/**
	 * Fill Style @type {string}
	 */
	fill: null,

	/**
	 * Font @type {string}
	 */
	font: null,

	/** Line Width for children */
	line_width: null,
	/** Line Cap for children */
	line_cap: null,
	/** Line join for children */
	line_join: null,
	/** Miter limit */
	miter_limit: null,

	init: function j5g3DisplayObject(properties)
	{
		this.M = new j5g3.Matrix();
		this.extend(properties);
		this.box = new j5g3.BoundingBox();
	},

	set: function(p)
	{
		for (var i in p)
			this[i] = p[i];

		return this;
	},

	invalidate: function()
	{
		this.dirty = true;
		return this;
	},

	/**
	 * Save Transform Matrix and apply transformations.
	 */
	begin: function(context)
	{
	var
		me = this,
		m = this.M
	;
		context.save();

		if (me.alpha!==1) context.globalAlpha *= me.alpha;
		if (me.fill!==null) context.fillStyle = me.fill;
		if (me.stroke!==null) context.strokeStyle = me.stroke;
		if (me.font!==null) context.font = me.font;
		if (me.blending!==null) context.globalCompositeOperation = me.blending;

		if (me.line_width!==null) context.lineWidth = me.line_width;
		if (me.line_cap!==null) context.lineCap = me.line_cap;
		if (me.line_join!==null) context.lineJoin = me.line_join;
		if (me.miter_limit!==null) context.miterLimit = me.miter_limit;

		if (!m.identity)
			context.transform(m.a, m.b, m.c, m.d, m.e, m.f);
		else if (m.f !==0 || m.e !== 0)
			context.translate(m.e, m.f);
	},

	/**
	 * Restores Transform Matrix
	 */
	end: function(context)
	{
		context.restore();
	},

	/**
	 * Applies Transformations and paints Object in the screen.
	 * To define your custom DisplayObject class implement the paint()
	 * function. Replace this function if you need to add extra
	 * functionality to the draw process, ie: transformations or keyboard handling.
	 */
	render: j5g3.Render.Default,

	/**
	 * This property is used to store the old paint method when assigning effects.
	 */
	_paint: null,

	validate: function(BB, force)
	{
		if (this.dirty || force)
		{
			BB.union(this.box);

			if (BB.M.dirty || this.M.dirty)
			{
				this.box.transform(this, BB.M);
				BB.union(this.box);
				this.box.M.dirty = this.M.dirty = false;
			}
			BB.dirty = this.dirty = true;
		}
	},

	/**
	 * Runs logic
	 * @type {Function}
	 */
	update: null,

	/**
	 * Removes DisplayObject from container
	 */
	remove: function()
	{
		if (this.parent)
		{
			this._previous._next = this._next;
			this._next._previous = this._previous;

			this.parent.dirty = true;
			this.parent = this._previous = null;
		}
		return this;
	},

	/**
	 * Sets position of the object according to alignment and container.
	 */
	align: function(alignment, container)
	{
		container = container || this.parent;

		switch (alignment) {
		case 'center':  this.x = container.width / 2; break;
		case 'left':    this.x = 0; break;
		case 'right':   this.x = container.width - this.width; break;
		case 'middle':  this.y = container.height / 2; break;
		case 'center middle':
			this.pos(container.width/2, container.height/2);
			break;
		case 'origin':  this.pos(-this.width/2, -this.height/2); break;
		case 'origin top': this.pos(-this.width/2, -this.height); break;
		case 'origin bottom': this.pos(-this.width/2, 0); break;
		}
		return this;
	},

	/**
	 * Sets x and y
	 */
	pos: function(x, y)
	{
		this.x = x;
		this.y = y;
		return this;
	},

	/**
	 * Sets width and height.
	 */
	size: function(w, h)
	{
		this.width = w;
		this.height = h;
		return this;
	},

	/**
	 * Sets the scaleX and scaleY properties according to w and h
	 */
	stretch: function(w, h)
	{
		return this.scale(w / this.width, h/this.height);
	},

	/**
	 * Cache DisplayObject for faster drawing.
	 */
	cache: j5g3.Cache.Canvas,

	/**
	 * Restores Paint Method
	 */
	clear_cache: function()
	{
		if (this._oldPaint)
			this.paint = this._oldPaint;
	},

	/**
	 * Tests if point at x, y is inside the DisplayObject.
	 */
	at: j5g3.HitTest.Rect,

	/**
	 * Sets sx and sy values. If either sx or sy are NaN, they will be
	 * ignored.
	 */
	scale: function(sx, sy)
	{
		if (sy===undefined)
			sy = sx;

		this.sx = sx || 0;
		this.sy = sy || 0;

		return this;
	}

});

/**
 * @class
 *
 * Constructor takes properties object, a string with the id of an
 * Image or an HTML Image Element.
 *
 * @extends j5g3.DisplayObject
 */
j5g3.Image = j5g3.DisplayObject.extend(
/** @lends j5g3.Image.prototype */ {

	init: function j5g3Image(properties)
	{
		switch(j5g3.get_type(properties))
		{
		case 'string': properties = { source: j5g3.id(properties) }; break;
		case 'dom': properties = { source: properties }; break;
		}

		j5g3.DisplayObject.call(this, properties);
	},

	paint: j5g3.Paint.Image,

	get source()
	{
		return this.__source;
	},

	/**
	 * Sets the source. If src is a string it will create an Image object.
	 * NOTE: Chrome and Safari (webkit) loads images and css parallely.
	 * So we have to wait for the image to load in order
	 * to get the correct width and height.
	 */
	set source(src)
	{
		src = this.__source = (typeof(src)==='string') ? j5g3.id(src) : src;

		if (this.width === null)  this.width = src.naturalWidth || src.width;
		if (this.height === null) this.height = src.naturalHeight || src.height;
	}

});

/**
 * @class j5g3.Text
 */
j5g3.Text = j5g3.DisplayObject.extend(/** @lends j5g3.Text.prototype */{

	/**
	 * Text to display
	 */
	text: '',

	/**
	 * Default line height only for Paint.MultilineText. Leave as null for auto.
	 */
	line_height: null,

	_align: null,

	/**
	 * Calculates Text Width and sets cx value based on align.
	 */
	align_text: function(align)
	{
		this.measure();
		var width = this.width;

		if (align==='left')
			this.cx = 0;
		else if (align==='center')
			this.cx = -width/2;
		else if (align==='right')
			this.cx = -width;

		return this;
	},

	init: function j5g3Text(properties)
	{
		if (typeof properties === 'string')
			properties = { text: properties };

		j5g3.DisplayObject.call(this, properties);
	},

	_paint: j5g3.Paint.Text,
	paint : j5g3.Paint.Text,

	_measure: function(obj, context)
	{
	var
		text = (""+obj.text).split("\n"),
		metrics,
		l = text.length,
		max = 0,
		font = compute(obj, 'font')
	;
		obj.begin(context);

		if (font)
			context.font = font;

		while (l--)
		{
			metrics = context.measureText(text[l]);
			if (metrics.width > max)
				max = metrics.width;
		}

		if (obj.line_height===null)
			obj.line_height = parseInt(context.font.match(/\d+/), 10);

		obj.width = max;
		obj.height = obj.line_height*text.length;

		obj.end(context);

		return obj;
	},

	_begin: j5g3.DisplayObject.prototype.begin,

	begin: function(context)
	{
		context.textBaseline = 'top';
		this._begin(context);
	},

	measure: function()
	{
		return j5g3.Cache.use(this._measure, this);
	}
});

/**
 * @class
 */
j5g3.Clip = j5g3.DisplayObject.extend(
/** @lends j5g3.Clip.prototype */ {

	/** @private */
	_frames: null,

	/**
	 * Stores current frame number
	 */
	_frame: 0,

	/**
	 * Number of frames.
	 */
	length: null,

	/** @private */
	playing: true,

	/** Time scale */
	st: 1,

	/// Dirty Box.
	dbox: null,

	/**
	 * @private
	 * It will initialize object without calling setup()
	 */
	_init: function(properties)
	{
		j5g3.DisplayObject.call(this, properties);

		this._frames = [];
		this.add_frame();
		this.dbox = new j5g3.BoundingBox();
		this.dbox.M = this.box.M;
	},

	init: function j5g3Clip(properties)
	{
		this._init(properties);

		if (this.setup!==null)
			this.setup();
	},

	/** Function to call after construction */
	setup: null,

	validate: function(BB, force)
	{
	var
		me = this,
		next = me.frame,
		dbox = me.dbox.reset()
	;
		if (BB.M.dirty || me.M.dirty)
			dbox.transform(me, BB.M);

		while ((next = next._next) !== me.frame)
			if (next.validate)
				next.validate(dbox, me.dirty || force);

		if (dbox.dirty)
		{
			BB.union(me.box);
			BB.union(dbox);
			me.dbox = me.box;
			me.box = dbox;

			BB.dirty = true;
			me.box.dirty = false;
		}
		me.box.M.dirty = me.M.dirty = false;
	},

	/**
	 * Runs clip logic and advances frame.
	*/
	update: function()
	{
	var
		frame = this.frame,
		next = frame
	;
		if (this.update_frame)
			this.update_frame();

		while ((next=next._next) !== frame)
			if (next.update !== null)
				next.update();

		if (this.playing)
		{
			if ((this._frame += this.st) >= this.length)
				this._frame = 0;

			next = this._frames[this._frame|0];

			if (next !== this.frame)
			{
				this.frame = next;
				this.dirty = true;
			}
		}
	},

	/**
	 * Current frame objects.
	 */
	frame: null,

	paint: j5g3.Paint.Container,

	/**
	 * Stops clip.
	 */
	stop: function() { this.playing = false; return this;},

	/**
	 * Plays clip.
	 */
	play: function() { this.playing = true; return this; },

	/**
	 * Adds display_objects to current frame.
	 * If function is passed it converts it to an Action object.
	 */
	add: function(display_object)
	{
		switch (j5g3.get_type(display_object)) {
		case 'function':
			display_object = new j5g3.Action(display_object);
			break;
		case 'string':
			display_object = new j5g3.Image({ source: display_object });
			break;
		case 'array':
			for (var i=0; i < display_object.length; i++)
				this.add(display_object[i]);
			return this;
		case 'audio':
			// TODO
			break;
		case 'dom': case 'object':
			display_object = new j5g3.Image(display_object);
			break;
		case 'undefined': case 'null':
			throw "Trying to add undefined object to clip.";
		}

		return this.add_object(display_object);
	},

	/**
	 * Adds a DisplayObject to the clip. Faster than add().
	 */
	add_object: function(display_object)
	{
	var
		frame = this.frame
	;
		if (display_object.parent)
			display_object.remove();

		frame._previous._next = display_object;
		display_object._previous = frame._previous;
		display_object._next = frame;
		display_object.parent = this;
		frame._previous = display_object;

		return this;
	},

	/**
	 * Adds a frame with objects inside.
	 */
	add_frame: function(objects)
	{
	var
		frame = {}
	;
		frame._previous = frame._next = frame;
		this._frames.push(frame);
		this.go((this.length =this._frames.length)-1);

		return objects ? this.add(objects) : this;
	},

	/**
	 * Returns true if current frame is empty
	 */
	is_frame_empty: function()
	{
		return this.frame._next === this.frame;
	},

	/**
	 * Removes frame
	 */
	remove_frame: function(frame)
	{
		frame = frame===undefined ? this._frame : frame;
		this._frames.splice(frame, 1);
		this.go(frame>0 ? frame-1 : 0);
		this.length = this._frames.length;

		return this;
	},

	/**
	 * Goes to frame
	 */
	go: function(frame)
	{
		this.frame = this._frames[this._frame = frame];
		return this;
	},

	/**
	 * Iterates over all the clip's children. Note: Not in order.
	 */
	each: function(fn)
	{
	var
		l = this._frames.length,
		frame, next
	;
		while (l--)
		{
			next = frame = this._frames[l];
			while ((next=next._next) !== frame)
				fn(next);
		}

		return this;
	},

	/**
	 * Compares all objects in the clip.
	 *
	 * @param fn Callback function. It is passed the two objects
	 * to compare.
	 */
	each_pair: function(fn)
	{
	var
		frame = this.frame,
		next = frame, i
	;
		while ((next=i=next._next) !== frame)
			while ((i=i._next) !== frame)
				fn(next, i);
	},

	/**
	 * Aligns all children
	 */
	align_children : function(alignment)
	{
		return this.each(function(c) { if (c.align) c.align(alignment); });
	},

	/**
	 * Returns element at position x,y
	 */
	at: j5g3.HitTest.Container

});

/**
 * A Stage represent a Canvas element and it's responsible for drawing and updating
 * its children.
 * @class
 * @extend j5g3.Clip
 */
j5g3.Stage = j5g3.Clip.extend(/** @lends j5g3.Stage.prototype */{

	/**
	 * Current canvas element.
	 */
	canvas: null,

	/**
	 * Current drawing canvas context.
	 */
	context: null,

	/**
	 * Where to add the canvas element if none is specified
	 */
	container: false,

	/**
	 * Treat the stage as background. If true and no canvas property is specified,
	 * it will create one and set it behind the main stage. It will also set it
	 * as opaque(no transparency).
	 */
	background: false,

	/**
	 * Context for display canvas.
	 */
	screen: null,

	/**
	 * Canvas used for rendering.
	 */
	renderCanvas: null,

	_init_container: function()
	{
		if (this.container===false)
		{
			this.container = window.document.body;
			return this.container;
		}

		if (j5g3.get_type(this.container)==='dom')
			return this.container;

		var c = this.container = j5g3.dom('DIV');
		c.className = 'j5g3-stage';
		window.document.body.appendChild(c);
		return c;
	},

	_init_canvas: function()
	{
	var
		container = this._init_container()
	;
		if (!this.canvas)
		{
			this.canvas = j5g3.canvas(this.width, this.height);

			if (this.background)
			{
				this.canvas.setAttribute('moz-opaque', true);
				container.insertBefore(this.canvas, container.firstChild);
			} else
				container.appendChild(this.canvas);
		}

		if (this.width===null)
			this.width = this.canvas.width;
		if (this.height===null)
			this.height= this.canvas.height;

		if (!this.renderCanvas)
			this.renderCanvas = j5g3.dom('CANVAS');
	},

	_init_context: function()
	{
		this.context = this.renderCanvas.getContext('2d', { opaque: this.background });
		this.screen  = this.canvas.getContext('2d', { opaque: this.background });
	},

	init: function j5g3Stage(p)
	{
	var
		me = this
	;
		j5g3.Clip.call(me, p);

		me._init_canvas();
		me.dbox.M = me.box.M = me.M;

		me.resolution(
			me.width || me.canvas.clientWidth || 640,
			me.height || me.canvas.clientHeight || 480
		);
		me._init_context();
	},

	/**
	 * Sets Screen Resolution and Root Width and Height
	 *
	 * @param {number} w Width
	 * @param {number} h Height
	 */
	resolution: function(w, h)
	{
		if (w === 0 || h === 0)
			throw new Error("Invalid stage resolution: " + w + 'x' + h);

		this.renderCanvas.width = this.canvas.width = w;
		this.renderCanvas.height = this.canvas.height= h;

		return this.size(w, h);
	},

	/**
	 * Renders screen to buffer then only updates region under
	 * dirty box
	 */
	render: function()
	{
	var
		me = this,
		context = this.context,
		dx = me.dbox.x, dw = me.dbox.w,
		dy = me.dbox.y, dh = me.dbox.h
	;
		if (dw !== 0 && dh !== 0)
		{
			context.clearRect(dx, dy, dw, dh);

			me.begin(context);
			me.paint(context, me.dbox);
			me.end(context);

			me.dirty = false;

			me.screen.clearRect(dx, dy, dw, dh);
			me.screen.drawImage(me.renderCanvas, dx, dy, dw, dh, dx, dy, dw, dh);
		}
	},

	validate: function()
	{
	var
		next = this.frame,
		me = this,
		x,y,w,h,
		BB = me.dbox
	;
		BB.reset();

		while ((next = next._next) !== me.frame)
			if (next.validate)
				next.validate(BB, me.dirty);

		if (BB.w && BB.h)
		{
			x = BB.x; y = BB.y; w = BB.w; h = BB.h;
			BB.union(me.box);
			BB.clip(0, 0, me.width, me.height);
			me.box.set(x, y, w, h);
		}
		me.M.dirty = false;
		return me;
	}

});

/**
 * @class Tween Class
 */
j5g3.Tween = j5g3.Class.extend(/**@lends j5g3.Tween.prototype */ {

	/**
	 * If true it will remove itself after the animation
	 * is done
	 */
	auto_remove: false,

	/**
	 * How many times to repeat animation
	 */
	repeat: Infinity,

	/**
	 * Duration of the animation, in frames
	 */
	duration: 100,

	/**
	 * Starting values
	 */
	from: null,
	/**
	 * Target to animate
	 */
	target: null,
	/**
	 * Final Values for animation
	 */
	to:   null,

	/**
	 * Current time, in number of frames
	 */
	t: 0,

	/* Fired when tween stops. @event */
	on_stop: null,

	/**
	 * Callback
	 */
	on_remove: null,

	/// How long to wait before starting the animation.
	delay: 0,

	/**
	 * @param {(j5g3.DisplayObject|Object)} properties DisplayObject
	 *        or an Object containing properties.
	 */
	init: function j5g3Tween(properties)
	{
		if (properties instanceof j5g3.Class)
			properties = { target: properties };

		this.update = this.start;
		this.extend(properties);
	},

	render: j5g3.Render.Void,

	/**
	 * Pause Tween
	 */
	pause: function()
	{
		this._olddraw = this.update;
		this.update = null;

		return this;
	},

	/**
	 * Resume animation if paused.
	 */
	resume: function()
	{
		this.update = this._olddraw ? this._olddraw : this.start;

		return this;
	},

	/**
	 * Restart animation
	 */
	rewind: function()
	{
		this.repeat -= 1;
		this.t=0;
		this.vf= 0;
		this.__delay = this.delay;

		return this;
	},

	/** Recalculates Tween */
	restart: function()
	{
		this.t = 0;
		return this.stop().start();
	},

	/**
	 * Stops animation
	 */
	stop: function()
	{
		this.pause().rewind();

		if (this.on_stop)
			this.on_stop();

		return this;
	},

	/**
	 * Easing function to use. See j5g3.Easing
	 */
	easing: function(p) { return p; },

	apply_tween: function(i, v)
	{
		return this.from[i] + ( this.easing(v) * (this.to[i]-this.from[i]));
	},

	_remove: j5g3.DisplayObject.prototype.remove,

	/**
	 * Removes from container and stops animation.
	 */
	remove: function()
	{
		if (this.on_remove)
			this.on_remove();

		this._remove();
	},

	/** @private */
	_calculate: function()
	{
	var
		me = this,
		target = me.target,
		i
	;
		if (me.__delay)
		{
			me.__delay--;
			return;
		}

		if (me.duration===me.t)
			me.vf = 1;

		for (i in me.to)
			target[i] = me.apply_tween(i, me.vf);

		target.dirty = true;

		if (me.t<me.duration)
		{
			me.t++;
			me.vf += me.v;
		} else
		{
			if (me.auto_remove)
				me.remove();
			else if (me.repeat)
				me.rewind();
			else
				me.stop();
		}
	},

	/**
	 * Sets up Tween to act on next Frame draw
	 */
	start: function()
	{
	var
		me = this,
		to = me.to, i, target=me.target
	;

		// Setup function it will be replaced after setting up.
		if (me.from === null)
		{
			me.from = {};
			for (i in to)
				me.from[i] = target[i];
		}

		me.v = 1 / me.duration;
		me.vf= 0;
		me.__delay = me.delay;

		me.update = me._calculate;
		me.update();
		return this;
	},

	at: j5g3.HitTest.Void

});

/**
 * @class
 */
j5g3.Sprite = j5g3.DisplayObject.extend({

	init: function j5g3Sprite(p)
	{
		j5g3.DisplayObject.call(this, p);

		if (!this.source)
			throw new Error("Invalid source property for Sprite");
		if (this.width===null)
			this.width = this.source.w;
		if (this.height===null)
			this.height = this.source.h;
	},

	paint: j5g3.Paint.Sprite

});

/**
 * @class Spritesheet Class
 *
 * Constructor can take properties object, a string with the filename, an
 * HTML Image or j5g3 Image.
 *
 */
j5g3.Spritesheet = j5g3.Class.extend(/** @lends j5g3.Spritesheet.prototype */ {

	width: null,
	height: null,

	/**
	 * @private
	 */
	_sprites: null,

	init: function j5g3Spritesheet(properties)
	{
		switch (j5g3.get_type(properties)) {
		case 'string': case 'dom': case 'j5g3':
			properties = { source: properties };
			break;
		}

		j5g3.Class.call(this, properties);
	},

	size: function(w, h)
	{
		this.width = w;
		this.height = h;
		return this;
	},

	/**
	 * Image of the spritesheet. If a string passed it will be converted
	 * to a j5g3.Image
	 */
	set source(val)
	{
	var
		src
	;
		switch (j5g3.get_type(val)) {
		case 'string': case 'dom':
			src = new j5g3.Image(val);
			break;
		default:
			src = val;
		}

		if (!src)
			throw new Error("Invalid source for Spritesheet.");

		if (this.width === null && src)
			this.width = src.width;

		if (this.height === null && src)
			this.height = src.height;

		this._source = src;
		this._sprites = [];
	},

	get source()
	{
		return this._source;
	},

	/**
	 * Returns array containing sprites
	 */
	select: function(sprites)
	{
	var
		result = []
	;
		this.each(sprites, function(s) { result.push(s); });

		return result;
	},

	/**
	 * Iterates thorugh sprites.
	 */
	each: function(sprites, fn)
	{
	var
		i=0, l=sprites.length
	;
		for (; i < l; i++)
			fn(this.sprite(sprites[i]));

		return this;
	},

	/**
	 * Creates clip from spritesheet indexes.
	 *
	 * @param {Array} sprites Array of sprites to insert into clip.
	 */
	clip: function(sprites)
	{
	var
		clip = j5g3.clip().remove_frame(),
		w=0, h=0
	;
		this.each(sprites, function(sprite) {
			clip.add_frame(sprite);

			if (sprite.width > w) w = sprite.width;
			if (sprite.height> h) h = sprite.height;
		});

		return clip.size(w, h).go(0);
	},

	/**
	 * Cuts a sprite and returns the ss object.
	 */
	push: function(x, y, w, h)
	{
		this.slice(x, y, w, h);
		return this;
	},

	/**
	 * Creates a new slice, inserts it into the sprite list and returns
	 * its ID. The ID can be used by the sprite function.
	 */
	slice: function(x, y, w, h)
	{
		return this._sprites.push({
			width: w, height: h,
			source: { image: this.source.source, x: x, y: y, w: w, h: h }
		})-1;
	},

	/**
	 * Returns a Sprite object from a section of the Spritesheet. It also adds
	 * it to the sprites list.
	 */
	cut: function(x, y, w, h)
	{
		return this.sprite(this.slice(x,y,w,h));
	},

	/**
	 * Divides spritesheet into a grid of y rows and x columns and a
	 * border of b. By default b is 0.
	 */
	grid: function(x, y, b)
	{
		b = b || 0;

	var
		b2 = 2*b,
		w = this.width / x - b2 | 0,
		h = this.height / y - b2 | 0,
		r,c
	;

		for (r=0; r < y; r++)
			for (c=0; c < x; c++)
				this.slice(c*(w+b2)+b, r*(h+b2)+b, w, h);

		return this;
	},

	/**
	 * Returns a new Sprite object based on index
	 *
	 * @param {number} index Sprite Index.
	 * @param Klass Optional class. j5g3.Sprite by default.
	 *
	 * @return {j5g3.Sprite}
	 */
	sprite: function(index, Klass)
	{
		Klass = Klass || j5g3.Sprite;
		return new Klass(this._sprites[index]);
	},

	/**
	 * Returns all sprites as objects in an array.
	 *
	 * @return {Array}
	 */
	sprites: function()
	{
	var
		i = 0,
		l = this._sprites.length,
		sprites = []
	;
		for (; i<l; i++)
			sprites.push(this.sprite(i));

		return sprites;
	},

	/**
	 * Returns a map with the sprites property set and the tw and th specified.
	 */
	map: function(tw, th)
	{
		return new j5g3.Map({ sprites: this.sprites(), tw: tw, th: th });
	}

});

/**
 * @class Particle Emitter
 *
 * @extends j5g3.Clip
 */
j5g3.Emitter = j5g3.Clip.extend(/**@lends j5g3.Emitter.prototype */ {

	init: function j5g3Emitter(p)
	{
		j5g3.Clip.apply(this, [p]);
	},

	/**
	 * Class of the object to Emit.
	 */
	source: j5g3.Clip,

	/**
	 * Function used to replace the update method for the emitted object.
	 */
	container_update: function()
	{
		if (this._life--)
		{
			if (this._emitter_update!==null)
				this._emitter_update();
		} else
			this.remove();
	},

	/**
	 * Life of the particle, in frames.
	 */
	life: 10,

	/**
	 * Callback to execute every time a particle is spawn.
	 */
	on_emit: null,

	/**
	 * Number of particles to emit by frame.
	 */
	count: 1,

	/**
	 * By default creates a clip containing 'source' for 'life' frames.
	 */
	spawn: function()
	{
	var
		clip = new this.source()
	;
		clip._life = this.life;
		// TODO see if this might cause conflict later.
		clip._emitter_update = clip.update;
		clip.update = this.container_update;

		return clip;
	},

	_emit: function()
	{
	var
		clip = this.spawn()
	;
		this.add_object(clip);

		if (this.on_emit)
			this.on_emit(clip);
	},

	update_frame: function()
	{
	var
		i = this.count
	;
		while (i--)
			this._emit();
	}

});

/**
 * @class
 * @extends j5g3.DisplayObject
 *
 * Maps an array to a spritesheet.
 *
 */
j5g3.Map = j5g3.DisplayObject.extend(/**@lends j5g3.Map.prototype */ {

	/** Array of sprites */
	sprites: null,
	/** 2D Array containing the indexes of the sprites */
	map: null,
	/** Tile Width */
	tw: 0,
	/** Tile Height */
	th: 0,

	/** Offset X */
	offsetX: 0,
	/** Offset Y */
	offsetY: 0,

	init: function j5g3Map(p)
	{
		j5g3.DisplayObject.call(this, p);

		if (this.map===null)
			this.map = [];
	},

	/**
	 * Gets the top left coordinate of the tile at x,y for isometric maps.
	 */
	/*
	to_iso: function(x, y)
	{
	var
		me = this,
		tw2=(this.tw/2 | 0) + this.offsetX,
		th2=(this.th/2 | 0) + this.offsetY,
		offset = (y%2) ? 0 : -tw2,

		nx = (x * me.tw - offset | 0) - this.cx,
		ny = (y * th2 | 0) - this.cy
		;

		return { x: nx, y: ny };
	},
	*/

	paint: j5g3.Paint.Map

});

/**
 * Executes code on FrameEnter.
 *
 * @class
 * @extends j5g3.Class
 *
 */
j5g3.Action = j5g3.Class.extend(
/** @lends j5g3.Action.prototype */ {

	_init: j5g3.Class,

	/**
	 * Code to execute
	 */
	update: null,

	render: j5g3.Render.Void,

	init: function j5g3Action(p)
	{
		if (j5g3.get_type(p)==='function')
			p = { update: p };

		this._init(p);
	},

	/**
	 * Remove action from parent clip.
	 */
	remove: j5g3.DisplayObject.prototype.remove

});

/**
 * @class
 * Engine class
 */
j5g3.Engine = j5g3.Class.extend(/** @lends j5g3.Engine.prototype */{

	version: '1.0.0',

	/* Frames per Second */
	__fps: null,

	/** Scoped render loop */
	_renderLoopFn: null,
	/** Scoped game loop */
	_gameLoopFn: null,
	/** Render Loop id */
	_renderLoopId: 0,
	/** GameLoopId */
	_gameLoopId: 0,

	/// true if engine is not currently running
	paused: true,

	/// @type {Array} Array of layers. Includes the main stage.
	layers: null,

	/// Main Layer. By default it will be a j5g3.Stage object.
	stage: null,

	/**
	 * Starts the engine.
	 */
	run: function()
	{
	var
		me = this
	;
		me.clear_process();

		if (this.__fps)
		{
			// NOTE: Closures are faster than Function.bind()
			me._renderLoopFn = function() { me._renderLoop(); };
			me._gameLoopFn = function() {
				me._gameLoop();
				me._renderLoopId = window.requestAnimationFrame(me._renderLoopFn);
			};
			me._gameLoopId = window.setInterval(me._gameLoopFn, me.__fps);
		} else
		{
			me._gameLoopFn = function() {
				me._gameLoop();
				me._renderLoop();
				me._renderLoopId = window.requestAnimationFrame(me._gameLoopFn);
			};
			me._gameLoopFn();
		}

		me.paused = false;

		return me;
	},

	clear_process: function()
	{
		window.clearInterval(this._gameLoopId);
		window.cancelAnimationFrame(this._renderLoopId);
	},

	/**
	 * Stops the engine and destroys it.
	 */
	destroy: function()
	{
		this.pause();

		if (this.on_destroy)
			this.on_destroy();
	},

	/**
	 * @Private Render Loop for requestAnimationFrame
	 */
	_renderLoop: function()
	{
		var i=0, l=this.layers.length;

		for (;i<l; i++)
			this.layers[i].validate().render();
	},

	/**
	 * @private Game Loop. Runs Logic and Updates all clips.
	 */
	_gameLoop: function()
	{
		var i=0, l=this.layers.length;

		for (;i<l; i++)
			this.layers[i].update();
	},

	/**
	 * Callback. It is called after the engine is initialized. Replace this
	 * with your own function.
	 *
	 * @param j5g3 The j5g3 namespace.
	 * @param me The engine object.
	 */
	startFn: function(/* j5g3, me */) { },

	/**
	 * Starts Engine. Creates Main stage. By default uses the canvas
	 * with id 'screen'.
	 */
	init: function j5g3Engine(config)
	{
	var
		me = this
	;
		if (typeof(config)==='function')
			config = { startFn: config };
		else if (config===undefined)
			config = {};

		cache.style.display = 'none';
		cache.setAttribute('id', 'j5g3-cache');
		window.document.body.appendChild(cache);

		j5g3.Class.apply(me, [ config ]);

		if (!me.layers)
			me.layers = [];

		if (!me.stage_settings)
			me.stage_settings = {};

		if (!me.stage_settings.canvas)
			me.stage_settings.canvas = j5g3.id('screen');

		if (!me.stage)
			me.stage = me.layers.length > 0 ? me.layers[1] : new j5g3.Stage(me.stage_settings);

		me.layers.push(me.stage);

		me.startFn(j5g3, me);
	},

	/**
	 * Pauses game execution
	 */
	pause: function()
	{
		this.clear_process();
		this._renderLoopFn = function() { };
		this.paused = true;

		return this;
	},


	/**
	 * Set the game Frames per Second.
	 */
	set fps(val)
	{
		this.__fps=1000/val;

		if (!this.paused)
			this.pause().run();
	},

	/**
	 * Gets current fps
	 */
	get fps()
	{
		return 1000/this.__fps;
	},

	/**
	 * Creates a new ImageData object with width w and height h.
	 *
	 * @param {number} w id|Width. Defaults to screen canvas width.
	 *                   If its an id it will return the imagedata of that image.
	 * @param {number} h Height. Defaults to screen canvas height
	 */
	imagedata: function(w, h)
	{
	var
		img, ctx
	;
		switch(j5g3.get_type(w)) {
		case 'string':
			img = j5g3.id(w); break;
		case 'dom':
			img = w; break;
		case 'j5g3':
			img = w.source; break;
		}

		if (img)
		{
			cache.width = img.width;
			cache.height= img.height;
			ctx = cache.getContext('2d');
			ctx.drawImage(img, 0, 0);
			return ctx.getImageData(0, 0, img.width, img.height);
		}

		return this.stage.context.createImageData(
			w || this.stage.canvas.width, h || this.stage.canvas.height
		);
	},

	/**
	 * Creates a new layer.
	 *
	 * @param {string|object} Initialization object for stage or canvas id string.
	 */
	layer: function(p)
	{
	var
		stage = this.stage, layer, lp
	;
		if (typeof(p)==='string')
			p = { canvas: j5g3.id(p) };

		j5g3.extend(lp = {
			width: stage.width,
			height: stage.height,
			container: stage.container,
			renderCanvas: stage.renderCanvas
		}, p);

		layer = new j5g3.Stage(lp);
		this.layers.push(layer);

		return layer;
	},


});

/** @namespace j5g3 Easing algorithms */
j5g3.Easing= (function()
{
var
	E = {}, i, result = {},

	fnFactory = function(i, fn)
	{
		result['EaseIn' + i] = fn;
		result['EaseOut' + i] = function(p) { return 1 - fn(1-p); };
		result['EaseInOut' + i] = function(p) {
			return p < 0.5 ?
				fn( p * 2 ) / 2 :
				fn( p * -2 + 2 ) / -2 + 1;
		};
	}
;
	(['Quad', 'Cubic', 'Quart', 'Quint', 'Expo']).forEach(function(name, i) {
		E[name] = function(p) {
			return Math.pow(p, i+2);
		};
	});

	E.Sine = function (p) { return 1 - Math.cos( p * Math.PI / 2 ); };
	E.Circ = function (p) { return 1 - Math.sqrt( 1 - p * p ); };
	E.Elastic =  function(p) { return p === 0 || p === 1 ? p :
		-Math.pow(2, 8 * (p - 1)) * Math.sin(( (p - 1) * 80 - 7.5) * Math.PI / 15);
	};
	E.Back = function(p) { return p * p * ( 3 * p - 2 ); };
	E.Bounce = function (p) {
		var pow2, result,
		bounce = 4;

		while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}

		result = 1 / Math.pow( 4, 3 - bounce ) - 7.5625 *
			Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );

		return result;
	};

	for (i in E)
		fnFactory(i, E[i]);

	result.Linear = function(p) { return p; };
	result.Swing = function(p) { return ( -Math.cos(p*Math.PI) / 2 ) + 0.5; };

	return result;
})();


// Shortcuts

/**
 * @function
 * @return {j5g3.Action}
 */
j5g3.action = f(j5g3.Action);
/** @function
 * @return {j5g3.Clip} */
j5g3.clip   = f(j5g3.Clip);
/** @function
 * @return {j5g3.Image} */
j5g3.image  = f(j5g3.Image);
/** @function
 * @return {j5g3.Sprite} */
j5g3.sprite = f(j5g3.Sprite);
/** @function
 * @return {j5g3.Spritesheet} */
j5g3.spritesheet = f(j5g3.Spritesheet);
/** @function
 * @return {j5g3.Text} */
j5g3.text   = f(j5g3.Text);

/** @function
 * @return {j5g3.Stage}
 */
j5g3.stage = f(j5g3.Stage);

/**
 * Returns a Multiline Text object
 * @return {j5g3.Text}
 */
j5g3.mtext  = function(p) { var t = new j5g3.Text(p); t.paint = j5g3.Paint.MultilineText; return t; };

/**
 * Returns a Stroke/Fill Text object
 * @return {j5g3.Text}
 */
j5g3.sftext  = function(p) { var t = new j5g3.Text(p); t.paint = j5g3.Paint.TextStrokeFill; return t; };

/** @function
 * @return {j5g3.Tween} */
j5g3.tween  = f(j5g3.Tween);
/** @function
 * @return {j5g3.Emitter} */
j5g3.emitter= f(j5g3.Emitter);
/** @function
 * @return {j5g3.Map} */
j5g3.map    = f(j5g3.Map);

/** @function
 * @return {j5g3.Engine} */
j5g3.engine = f(j5g3.Engine);


})(this, this.j5g3);

