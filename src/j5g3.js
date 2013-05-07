/**
 * @license
 *
 * j5g3 v0.9.0 - Javascript Graphics Engine
 * http://j5g3.com
 *
 * Copyright 2010-2012, Giancarlo F Bellido
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
 * Date: 2013-04-05 12:06:30 -0400
 *
 */

(function(window, undefined) {
'use strict';

var
	document = window.document,
	/* This is used by the cache mechanism. It is a canvas element. */
	cache,


	/** 
	 * @namespace 
	 * Creates a new Engine instance on window.load event.
	 */
	j5g3 = function(engine)
	{
		window.addEventListener('load', function()
		{
			new j5g3.Engine(engine);
		});
	},

	f= j5g3.factory = function(Klass)
	{
		return function(properties) { return new Klass(properties); };
	},

	extend = j5g3.extend = function(a, b)
	{
		for (var i in b)
			a[i] = b[i];
	}
;
	/**
	 * j5g3 Base class
	 * @constructor
	 * @param {Object} p
	 */
	j5g3.Class = function j5g3Class(p) {
		this.extend(p);
	};

extend(j5g3, {/** @scope j5g3 */

	/**
	 * Returns a DOM element by ID.
	 *
	 * @param {string} id Id of DOM Element
	 */
	id: function(id) { return document.getElementById(id); },

	/**
	 * Adds a callback to the body onLoad event.
	 */
	ready: function(fn) { window.addEventListener('load', fn, false); },

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
	 * Returns a DOM element.
	 * @namespace
	 *
	 * @param {string} tagname
	 */
	dom: function(tagname)
	{
		return document.createElement(tagname);
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
 * Returns a new DOM Element with tag tag and src attribute src.
 *
 * @param {string} tag
 * @param {string} uri
 *
 */
j5g3.dom.src= function(tag, uri)
{
var
	el = document.createElement(tag)
;
	el.setAttribute('src', uri);
	return el;
};

/**
 * Returns an HTML Image object from a URI uri
 *
 * @param {string} uri
 */
j5g3.dom.image= function(uri)
{
	return j5g3.dom.src('img', uri);
};

/**
 *
 * Uses methods.init as the constructor. If not passed it will define a function
 * and call the base constructor. Sets 'super' as the base class.
 *
 * @param {Object} methods Class instance methods.
 * @param {Object=} static_methods Static Methods.
 *
 */
j5g3.Class.extend = function(methods, static_methods)
{
/*jshint maxstatements:20 */
var
	i,
	_super  = this,
	init   = methods.init || function() { _super.apply(this, arguments); },
	/** @constructor @ignore */
	Subclass= function() { },
	/** @type {Object} */
	method
;
	Subclass.prototype = _super.prototype;

	init.prototype = new Subclass();
	init.extend = j5g3.Class.extend;

	for(i in methods)
		if (methods.hasOwnProperty(i))
		{
			method = Object.getOwnPropertyDescriptor(methods, i);
			Object.defineProperty(init.prototype, i, method);
		}

	for (i in static_methods)
		if (static_methods.hasOwnProperty(i))
		{
			method = Object.getOwnPropertyDescriptor(static_methods, i);
			Object.defineProperty(init, i, method);
		}

	return init;
};

/**
 * Extends this instance with properties from p
 */
j5g3.Class.prototype.extend = function(p)
{
	for (var i in p)
		this[i] = p[i];
};

/**
 * This are all the core drawing algorithms. "this" will point to the current
 * object.
 *
 * @namespace
 */
j5g3.Draw =
{
	/**
	 * Draws nothing
	 */
	Void: function() { },

	/**
	 * Default drawing algorithm.
	 */
	Default: function(context)
	{
		this.begin(context);
		this.paint(context);
		this.end(context);
	},

	/**
	 * Draw with no transformations applied. Faster...
	 */
	NoTransform: function(context)
	{
		this.paint(context);
	},

	/**
	 * Renders to render canvas then draws to main canvas.
	 */
	Root: function()
	{
		var context = this.context;
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.begin(context);
		this.paint(context);
		this.end(context);

		this.screen.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.screen.drawImage(this.renderCanvas, 0, 0);
	},

	/**
	 * Renders screen to buffer then only updates region under
	 * _dx, _dy, _dw, _dh
	 */
	RootDirty: function()
	{
	var
		me = this,
		context = this.context,
		dx = me._dx, dw = me._dw,
		dy = me._dy, dh = me._dh
	;
		if (dw === 0 || dh === 0)
			return;

		context.clearRect(dx, dy, dw, dh);

		me.begin(context);
		me.paint(context);
		me.end(context);

		me.screen.clearRect(dx, dy, dw, dh);
		me.screen.drawImage(me.renderCanvas, dx, dy, dw, dh, dx, dy, dw, dh);

		me._dx = me.width;
		me._dy = me.height;
		me._dh = me._dw = 0;
	},

	/**
	 * Renders directly to canvas.
	 */
	RootDirect: function()
	{
		var context = this.context;
		this.clearRect(0,0,this.canvas.width, this.canvas.height);
		this.begin(context);
		this.paint(context);
		this.end(context);
	},

	/**
	 * Draws Image with no transformations only translation
	 */
	FastImage: function(context)
	{
		context.drawImage(this.source, this.x+this.cx, this.y+this.cy);
	},

	/**
	 * Drawing Algorithm for cached display objects.
	 */
	Cache: function(context)
	{
		context.drawImage(
			this._cache_source, 0, 0, this.width, this.height,
			this.x + this.cx, this.y + this.cy, this.width, this.height
		);
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
	Container: function (context)
	{
	var
		frame = this.frame,
		next = frame
	;
		context.translate(this.cx, this.cy);
		while ((next=next._next) !== frame)
			next.draw(context);
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
	Map: function(context)
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
					s.draw(context);
			}
		}
	},

	/**
	 * Paints an isometric map.
	 */
	Isometric: function(context)
	{
	var
		map = this.map, y = 0, x, l=map.length,
		sprites = this.sprites, cm,
		dx = (this.tw/2|0) + this.offsetX,
		dy = (this.th/2|0) + this.offsetY,
		offset, s
	;
		context.translate(-dx, -dy);

		for (; y<l; y++)
		{
			x = map[y].length;
			cm= map[y];
			offset = (y%2) ? dx : -dx;

			context.translate(x*this.tw-offset, dy);

			while (x--)
			{
				context.translate(-this.tw, 0);
				if ((s = sprites[cm[x]]))
					s.draw(context);
			}

		}

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
		cache_context
	;
		w = w || me.width;
		h = h || me.height;

		// This will also clear the canvas.
		cache_canvas.width = w;
		cache_canvas.height= h;

		cache_context = cache_canvas.getContext('2d', false);
		cache_context.translate(-me.x-me.cx, -me.y-me.cy);
		/*
		cache_context.webkitImageSmoothingEnabled =
		cache_context.imageSmoothingEnabled =
			context.imageSmoothingEnabled;
		*/

		me.clear_cache();
		me.draw(cache_context);

		//image.src = cache_canvas.toDataURL();
		me._cache_source = cache_canvas;

		me._oldPaint= me.draw;
		me.draw = j5g3.Draw.Cache;

		return this;
	},

	/**
	 * Switches context to CACHE context and executes fn.
	 */
	use: function(context, fn, scope)
	{
	var
		result
	;
		// TODO put cache context somewhere?
		result = fn(scope, cache.getContext('2d'));

		return result;
	}

};


/**
 * @namespace
 * Hit test algorithms. Assign to 'at' function.
 */
j5g3.HitTest = {

	Circle: function(x, y, M)
	{
		M = M ? M.product(this.M, this.x, this.y) : this.M.to_m(this.x, this.y);
		M.to_client(x, y);

		return (M.x*M.x+M.y*M.y <= this.radius*this.radius) ? this : false;
	},

	Container: function(x, y, M)
	{
	var
		frame = this.frame,
		previous = frame,
		result
	;
		M = M ? M.product(this.M, this.x, this.y) : this.M.to_m(this.x, this.y);

		while ((previous = previous._previous) !== frame)
			if ((result = previous.at(x, y, M)))
				break;

		return result;
	},

	Rect: function(x, y, M)
	{
		M = M ? M.product(this.M, this.x, this.y) : this.M.to_m(this.x, this.y);
		M.to_client(x, y);

		return ((M.x>0 && M.x<this.width)&&(M.y>0 && M.y<this.height)) ? this : false;
	},

	Polygon: function(x, y, M)
	{
	var
		points = this.points,
		normals = this.normals,
		i = 0, l = points.length,
		dot
	;
		M = M ? M.product(this.M, this.x, this.y) : this.M.to_m(this.x, this.y);
		M.to_client(x, y);

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
 * Light 2D Transformation Matrix for DisplayObjects. Use j5g3.Matrix to 
 * perform operations. e and f are always 0.
 *
 * [ a c ]
 * [ b d ]
 *
 * @extend {j5g3.Class}
 * @class
 */
j5g3.MatrixLite = j5g3.Class.extend(/** @scope j5g3.MatrixLite.prototype */{

	a: 1,
	b: 0,
	c: 0,
	d: 1,

	_cos: 1,
	_sin: 0,

	scaleX: 1,
	scaleY: 1,

	init: function j5g3MatrixLite(a, b, c, d)
	{
		if (a!==undefined)
		{
			this.a = a; this.b = b; this.c = c; this.d = d;
		}
	},

	/** Sets Matrix rotation and calculates a,b,c and d values. */
	setRotation: function(val)
	{
		this._cos = Math.cos(val);
		this._sin = Math.sin(val);

		return this.calc4();
	},

	setScaleX: function(sx)
	{
		this.scaleX = sx;
		return this.calc4();
	},

	setScaleY: function(sy)
	{
		this.scaleY = sy;
		return this.calc4();
	},

	scale: function(sx, sy)
	{
		this.scaleX = sx;
		this.scaleY = sy;
		return this.calc4();
	},

	calc4: function()
	{
		this.a = this.scaleX * this._cos;
		this.b = this.scaleX * this._sin;
		this.c = -this.scaleY * this._sin;
		this.d = this.scaleY * this._cos;
		return this;
	},

	/**
	 * Returns a copy of this matrix as a j5g3.Matrix object.
	 *
	 * @return {j5g3.Matrix}
	 */
	to_m: function(x, y)
	{
		return new j5g3.Matrix(this.a, this.b, this.c, this.d, x || 0, y || 0);
	}
});

/**
 * 2D Transformation Matrix.
 * @class
 * @extend j5g3.Class
 */
j5g3.Matrix = j5g3.Class.extend(/** @scope j5g3.Matrix.prototype */{

	a: 1,
	b: 0,
	c: 0,
	d: 1,
	e: 0,
	f: 0,

	init: function j5g3Matrix(a, b, c, d, e, f)
	{
		if (a!==undefined)
		{
			this.a = a; this.b = b; this.c = c;
			this.d = d; this.e = e; this.f = f;
		}
	},

	multiply: function(g, h, i, j, k, l)
	{
	var
		A = this.a, B = this.b, C = this.c,
		D= this.d
	;
		this.a = A*g + C*h;
		this.b = B*g + D*h;
		this.c = A*i + C*j;
		this.d = B*i + D*j;
		this.e += A*k + C*l;
		this.f += B*k + D*l;

		return this;
	},

	clone: function()
	{
		return j5g3.matrix().multiply(this.a, this.b, this.c, this.d, this.e, this.f);
	},

	/**
	 * Returns a new inverse matrix
	 *
	 * @return {j5g3.Matrix}
	 */
	inverse: function()
	{
	var
		m = this.clone(),
		adbc = this.a*this.d-this.b*this.c
	;
		m.a = this.d / adbc;
		m.b = this.b / -adbc;
		m.c = this.c / -adbc;
		m.d = this.a / adbc;
		m.e = (this.d*this.e-this.c*this.f) / -adbc;
		m.f = (this.b*this.e-this.a*this.f) / adbc;

		return m;
	},

	/**
	 * Multiplies matrix by M and optional x and y
	 *
	 * @return {j5g3.Matrix}
	 */
	product: function(M, x, y)
	{
		return this.clone().multiply(M.a, M.b, M.c, M.d, M.e || x || 0, M.f || y || 0);
	},

	/**
	 * Resets matrix.
	 */
	reset: function()
	{
		this.a = 1; this.b = 0; this.c = 0;
		this.d = 1; this.e = 0; this.f = 0;

		return this;
	},

	/**
	 * Applies only rotation and scaling transformations. Stores it in this.x, this.y.
	 */
	to_world: function(x, y)
	{
		this.x = this.a * x + this.c * y + this.e;
		this.y = this.b * x + this.d * y + this.f;

		return this;
	},

	/**
	 * Finds client x and y and stores it in this.x, this.y respectively.
	 */
	to_client: function(x, y)
	{
	var
		adbc = this.a * this.d - this.b * this.c
	;
		this.x = (this.d*x - this.c*y + this.c*this.f-this.d*this.e)/adbc;
		this.y = (-this.b*x + this.a*y + this.b*this.e-this.a*this.f)/adbc;

		return this;
	}

});

/**
 * @class Base for all classes
 *
 */
j5g3.DisplayObject = j5g3.Class.extend(/** @scope j5g3.DisplayObject.prototype */ {

	/** @type {Image} Used by the draw function to paint the object */
	source: null,

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

	/**
	 * Transformation Matrix
	 */
	M: null,

	/** @type {number} X position */
	x: 0,

	/** @type {number} Y position */
	y: 0,

	/** @type {number} Offset X for rotation. */
	cx: 0,
	/** @type {number} Offset Y  */
	cy: 0,
	/** @type {number|null} Width */
	width: null,
	/** @type {number|null} Height */
	height: null,

	_rotation: 0,

	/** @type {number} Rotation */
	set rotation(val) { this.M.setRotation((this._rotation = val)); },
	get rotation() { return this._rotation; },

	/** @type {number} X Scale */
	set sx(val) {
		this.width *= val;
		this.M.setScaleX(val);
	},
	get sx() { return this.M.scaleX; },

	/** @type {number} Y Scale */
	set sy(val) {
		this.height *= val;
		this.M.setScaleY(val);
	},
	get sy() { return this.M.scaleY; },

	/** @type {number} Alpha transparency value */
	alpha: 1,

	/** @type {string} Blending Mode */
	blending: null,

	/**
	 * @type {string} Stroke style.
	 */
	stroke: null,

	/**
	 * @type {string} Fill Style
	 */
	fill: null,

	/**
	 * @type {string} Font
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

	dirty: true,

	init: function j5g3DisplayObject(properties)
	{
		this.M = new j5g3.MatrixLite();

		this.extend(properties);
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

		context.transform(m.a, m.b, m.c, m.d, me.x, me.y);
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
	draw: j5g3.Draw.Default,

	/**
	 * This property is used to store the old paint method when assigning effects.
	 */
	_paint: null,

	/**
	 * Sets object to dirty and forces paint. Invalidates runs only once.
	 */
	invalidate: function()
	{
		this.parent.invalidate(this);
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
	 * Moves Display Object relative to the current position
	 */
	move: function(x, y)
	{
		this.x += x;
		this.y += y;
		return this;
	},

	/**
	 * Returns true if object is visible
	 */
	visible: function()
	{
		return this.alpha > 0;
	},

	/**
	 * Sets the scaleX and scaleY properties according to w and h
	 */
	stretch: function(w, h)
	{
		return this.scale(w / this.width, h/this.height);
	},

	/**
	 * Encloses Object into a Clip.
	 */
	to_clip: function()
	{
		return j5g3.clip({width: this.width, height: this.height }).add(this);
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
			this.draw = this._oldPaint;
	},

	/**
	 * Sets properties. 
	 */
	set: function(properties)
	{
		this.extend(properties);
		return this;
	},

	/**
	 * Tests if point at x, y is inside the DisplayObject.
	 */
	at: j5g3.HitTest.Rect,

	/**
	 * Sets scaleX and scaleY values.
	 */
	scale: function(sx, sy)
	{
		this.sx = sx;
		this.sy = sy;
		return this;
	},

	/**
	 * Rotates object by a radians.
	 *
	 * @param {number} a
	 */
	rotate: function(a)
	{
		this.rotation += a;
		return this;
	}

});

/**
 * @class Image Class
 *
 * Constructor takes properties object, a string with the id of an
 * Image or an HTML Image Element.
 *
 * @extends j5g3.DisplayObject
 */
j5g3.Image = j5g3.DisplayObject.extend(
/** @scope j5g3.Image.prototype */ {

	init: function j5g3Image(properties)
	{
		switch(j5g3.get_type(properties))
		{
		case 'string': properties = { source: j5g3.id(properties) }; break;
		case 'dom': properties = { source: properties }; break;
		}

		j5g3.DisplayObject.apply(this, [ properties ]);

		if (this.source)
			this.set_source(this.source);
	},

	paint: j5g3.Paint.Image,

	_get_source: function(src)
	{
		return (typeof(src)==='string') ? j5g3.id(src) : src;
	},

	/**
	 * Sets the source. If src is a string it will create an Image object.
	 * NOTE: Chrome and Safari (webkit) loads images and css parallely.
	 * So we have to wait for the image to load in order
	 * to get the correct width and height.
	 */
	set_source: function(src)
	{
		this.source = this._get_source(src);

		if (this.width === null)  this.width = this.source.width;
		if (this.height === null) this.height = this.source.height;
	}

});

/**
 * @class j5g3.Text
 */
j5g3.Text = j5g3.DisplayObject.extend(/** @scope j5g3.Text.prototype */{

	text: '',

	/**
	 * Default line height only for Draw.MultilineText
	 */
	line_height: 12,

	init: function j5g3Text(properties)
	{
		if (typeof properties === 'string')
			properties = { text: properties };

		j5g3.DisplayObject.apply(this, [properties]);
	},

	paint : j5g3.Paint.Text,

	_get_width: function(obj, context)
	{
		obj.begin(context);
		var metrics = context.measureText(obj.text);
		obj.end();

		return metrics.width;
	},

	get_width : function()
	{
		return j5g3.Cache.use(this._get_width, this);
	}
});

/**
 * Display HTML
 * @class
 * @extend j5g3.DisplayObject
 * TODO
 */
j5g3.Html = j5g3.DisplayObject.extend({

	html: '',

	init: function j5g3Html(properties)
	{
		if (typeof(properties) === 'string')
			properties = { html: j5g3.dom(properties).innerHTML };

		j5g3.DisplayObject.apply(this, [ properties ]);
	}

});

/**
 * @class Clip
 */
j5g3.Clip = j5g3.DisplayObject.extend(
/** @scope j5g3.Clip.prototype */ {

	/** @private */
	_frames: null,

	/**
	 * @private
	 *
	 * Stores current frame number
	 */
	_frame: 0,

	/** @private */
	_playing: true,

	init: function j5g3Clip(properties)
	{
		j5g3.DisplayObject.apply(this, [ properties ]);

		this._frames = [];
		this.add_frame();

		if (this.setup!==null)
			this.setup();
	},

	invalidate: function(obj)
	{
		this.parent.invalidate(obj);
	},

	/** Function to call after construction */
	setup: null,

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

		if (this._playing)
		{
			this._frame = (this._frame===this._frames.length-1) ? 0 : (this._frame + 1);
			this.frame = this._frames[this._frame];
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
	stop: function() { this._playing = false; return this;},

	/**
	 * Plays clip.
	 */
	play: function() { this._playing = true; return this; },

	/**
	 * Returns true if clip is playing
	 */
	is_playing: function() { return this._playing; },

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
		frame = { }
	;
		frame._previous = frame._next = frame;

		this._frames.push(frame);
		this.go(this._frames.length-1);

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
		this.go(frame-1);

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
 * Root Clips
 * @class
 * @extend j5g3.Clip
 */
j5g3.Stage = j5g3.Clip.extend(/** @scope j5g3.Stage.prototype */{

	/**
	 * Current canvas element.
	 */
	canvas: null,

	/**
	 * Current drawing canvas context.
	 */
	context: null,

	/**
	 * Context for display canvas.
	 */
	screen: null,

	/**
	 * Canvas used for rendering.
	 */
	renderCanvas: null,

	/**
	 * Enable smoothing.
	 * @default false
	 */
	smoothing: false,

	/**
	 * Dirty Area
	 */
	_dx: 0,
	_dy: 0,
	_dw: 0,
	_dh: 0,

	_init_canvas: function()
	{

		if (!this.canvas)
		{
			this.canvas = j5g3.dom('CANVAS');
			this.canvas.width = this.width;
			this.canvas.height= this.height;
			window.document.body.appendChild(this.canvas);
		}
	},

	init: function j5g3Stage(p)
	{
	var
		me = this
	;
		j5g3.Clip.apply(me, [p]);

		me._init_canvas();

		me.renderCanvas = j5g3.dom('CANVAS');
		me.context = me.renderCanvas.getContext('2d');
		me.screen  = me.canvas.getContext('2d');

		me.resolution(
			me.width || me.canvas.clientWidth || 640,
			me.height || me.canvas.clientHeight || 480
		);

		me._dw = me.width;
		me._dh = me.height;

		me.screen.imageSmoothingEnabled =
		me.context.imageSmoothingEnabled =
		me.screen.webkitImageSmoothingEnabled =
		me.context.webkitImageSmoothingEnabled =
			me.smoothing;
	},

	/**
	 * We override this function because stages cannot be invalidated.
	 */
	invalidate: function(child)
	{
		if (child===undefined)
		{
			this._dx = this._dy = 0;
			this._dh = this.height;
			this._dw = this.width;
			return;
		}

	var
		x = child.x + child.cx,
		y = child.y + child.cy
	;
		if (x < this._dx)
			this._dx = x;
		if (y < this._dy)
			this._dy = y;
		if (child.width > this._dw)
		{
			this._dw = child.width;

			if (this._dx + this._dw > this.width)
				this._dw = this.width - this._dx;
		}

		if (child.height > this._dh)
		{
			this._dh = child.height;
			if (this._dy + this._dh > this.height)
				this._dh = this.height - this._dy;
		}
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

		this.canvas.width = this.renderCanvas.width = w;
		this.canvas.height= this.renderCanvas.height= h;

		return this.size(w, h);
	},

	draw: j5g3.Draw.Root

});

/**
 * @class Tween Class
 *
 * @property {Boolean}             auto_remove    Removes tween from clip at
 *           the end. Defaults to false.
 * @property {j5g3.DisplayObject}  target         Object to animate.
 * @property {Object}              from           Start Value(s)
 * @property {Object}              to             Final Value(s)
 * @property {Number}              duration       Duration of tween
 *           in frames. Default to 100 frames.
 * @property {Number}              repeat         How many times to repeat.
 * @property {Number}              t              Current Time of the animation.
 *
 * @property {function}   on_stop
 *
 */
j5g3.Tween = j5g3.DisplayObject.extend(/**@scope j5g3.Tween.prototype */ {

	auto_remove: false,
	repeat: Infinity,
	duration: 100,
	is_playing: false,
	from: null,
	target: null,
	to:   null,
	t: 0,
	/* EVENTS */
	on_stop: null,

	/**
	 * Callback
	 */
	on_remove: null,

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

	draw: j5g3.Draw.Void,

	/**
	 * Pause Tween
	 */
	pause: function()
	{
		this._olddraw = this.update;
		this.update = null;

		return this;
	},

	resume: function()
	{
		this.update = this._olddraw ? this._olddraw : this.start;

		return this;
	},

	rewind: function() {
		this.repeat -= 1;
		this.t=0;
		this.vf= 0;

		return this;
	},

	/** Recalculates Tween */
	restart: function()
	{
		this.t = 0;
		return this.stop().start();
	},

	stop: function()
	{
		this.pause().rewind();

		if (this.on_stop)
			this.on_stop();

		return this;
	},

	easing: function(p) { return p; },

	apply_tween: function(i, v)
	{
		return this.from[i] + ( this.easing(v) * (this.to[i]-this.from[i]));
	},

	_remove: j5g3.DisplayObject.prototype.remove,

	remove: function()
	{
		if (this.on_remove)
			this.on_remove();

		this._remove();
	},

	_calculate: function()
	{
	var
		me = this,
		target = me.target,
		i
	;
		if (me.duration===me.t)
			me.vf = 1;

		for (i in me.to)
			// TODO See if calling apply_tween affects performance.
			target[i] = me.apply_tween(i, me.vf);

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

		me.update = me._calculate;
		return this;
	}

}, {/** @scope j5g3.Tween */

	/**
	 * Shakes screen.
	 */
	Shake: function(target, radius, duration)
	{
		radius = radius || 3;
		var r2 = radius*2;

		return new j5g3.Tween({
			duration: duration || 10,
			target: target,
			auto_remove: true,
			to: { x: 0, y: 0 },
			apply_tween: function(i, v) { return v===1 ? this.to[i] : -radius+j5g3.rand(r2); }
		});
	}
});

/**
 * @class Sprite
 */
j5g3.Sprite = j5g3.DisplayObject.extend({

	init: function j5g3Sprite(p)
	{
		j5g3.DisplayObject.apply(this, [ p ]);

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
j5g3.Spritesheet = j5g3.Class.extend(/** @scope j5g3.Spritesheet.prototype */ {

	width: 0,
	height: 0,

	/**
	 * Image of the spritesheet. If a string passed it will be converted
	 * to a j5g3.Image
	 */
	source: null,

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
		case 'undefined':
			properties = {};
		}

		switch (j5g3.get_type(properties.source)) {
		case 'string': case 'dom':
			properties.source = new j5g3.Image(properties.source);
			break;
		}

		if (!properties.source)
			throw new Error("Invalid source for Spritesheet.");

		if (properties.width === undefined && properties.source)
			properties.width = properties.source.width;

		if (properties.height === undefined && properties.source)
			properties.height = properties.source.height;

		this.extend(properties);
		this._sprites = [];
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

		return clip.size(w, h);
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
	 * @return {j5g3.Sprite}
	 */
	sprite: function(index)
	{
		return new j5g3.Sprite(this._sprites[index]);
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
j5g3.Emitter = j5g3.Clip.extend(/**@scope j5g3.Emitter.prototype */ {

	init: function j5g3Emitter(p)
	{
		j5g3.Clip.apply(this, [p]);
	},

	/**
	 * Class of the object to Emit.
	 * @default j5g3.Clip
	 *
	 */
	source: j5g3.Clip,

	/**
	 * Function used to replace the draw method for the emitted object.
	 */
	container_draw: function(context)
	{
		if (this._life--)
			this._emitter_draw(context);
		else
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
		clip._emitter_draw = clip.draw;
		clip.draw = this.container_draw;

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

	update: function()
	{
	var
		i = this.count
	;
		while (i--)
			this._emit();
	}

});

/**
 * @class Maps an array to a spritesheet.
 *
 * Properties:
 *
 * @extends j5g3.DisplayObject
 *
 */
j5g3.Map = j5g3.DisplayObject.extend(/**@scope j5g3.Map.prototype */ {

	/** Array of sprites */
	sprites: null,
	/** 2D Array containing the indexes of the sprites */
	map: null,
	/** Tile Width */
	tw: 0,
	/** Tile Height */
	th: 0,

	offsetX: 0,
	offsetY: 0,

	init: function j5g3Map(p)
	{
		j5g3.DisplayObject.apply(this, [p]);

		if (this.map===null)
			this.map = [];
	},

	/**
	 * Gets the top left coordinate of the tile at x,y for isometric maps.
	 */
	to_iso: function(x, y)
	{
	var
		me = this,
		tw2=(this.tw/2 | 0) + this.offsetX,
		th2=(this.th/2 | 0) + this.offsetY,
		offset = (y%2)*tw2,

		nx = x * me.tw - offset | 0,
		ny = y * th2 | 0
		;

		return { x: nx, y: ny };
	},

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
/** @scope j5g3.Action.prototype */ {

	_init: j5g3.Class,

	/**
	 * Code to execute
	 */
	update: null,

	draw: j5g3.Draw.Void,

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

}, /** @scope j5g3.Action */ {

	/**
	 * Rotates object forever. Clockwise by default.
	 *
	 * @param {j5g3.DisplayObject} obj Object to rotate.
	 */
	rotate: function(obj)
	{
		return function() {
			obj.rotation = obj.rotation < 6.1 ? obj.rotation+0.1 : 0;
		};
	}

});

/**
 * @class
 * Engine class
 */
j5g3.Engine = j5g3.Class.extend(/** @scope j5g3.Engine.prototype */{

	version: '0.9.0',

	/* Frames per Second */
	__fps: 31,

	/** Scoped render loop */
	_renderLoopFn: null,
	/** Scoped game loop */
	_gameLoopFn: null,
	/** Render Loop id */
	_renderLoopId: 0,
	/** GameLoopId */
	_gameLoopId: 0,

	/**
	 * Starts the engine.
	 */
	run: function()
	{
	var
		me = this
	;
		me.clear_process();

		me._renderLoopFn = me._renderLoop.bind(me);
		me._renderLoop();

		me._gameLoopFn = me._gameLoop.bind(me);
		me._gameLoopId = window.setInterval(me._gameLoopFn, me.__fps);

		return me;
	},

	clear_process: function()
	{
		window.clearInterval(this._gameLoopId);
		window.cancelAnimationFrame(this._renderLoopId);
	},

	destroy: function()
	{
		this.clear_process();

		this._renderLoopFn = function() { };

		if (this.on_destroy)
			this.on_destroy();
	},

	/**
	 * Game Loop for requestAnimationFrame
	 */
	_renderLoop: function()
	{
		this.stage.draw();
		this._renderLoopId = window.requestAnimationFrame(this._renderLoopFn);
	},

	/**
	 * This is here to allow overriding by Debug.js
	 */
	_gameLoop: function()
	{
		this.stage.update();
	},

	startFn: function() { },

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

		if (config===undefined)
			config = {};

		cache = j5g3.dom('CANVAS');

		me.fps(config.fps || me.__fps);

		delete config.fps;

		j5g3.Class.apply(me, [ config ]);

		if (!me.stage_settings)
			me.stage_settings = {};

		if (!me.stage_settings.canvas)
			me.stage_settings.canvas = j5g3.id('screen');

		if (!me.stage)
			me.stage = new j5g3.Stage(me.stage_settings);

		me.startFn(j5g3, me);
	},

	/**
	 * Pauses game execution
	 */
	pause: function()
	{
		if (this.process)
		{
			window.clearInterval(this.process);
			window.cancelAnimationFrame(this.process);
		}
		this._rafScopedLoop = function() { };
	},

	/**
	 * Resume game execution.
	 */
	resume: function()
	{
		if (this.stage)
			this.stage.play();
	},


	/**
	 * Set the game Frames per Second.
	 */
	fps: function(val)
	{
		if (val===undefined)
			return 1000/this.__fps;

		this.__fps=1000/val;
		return this;
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
	}

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
/** @function 
 * @return {j5g3.Matrix} */
j5g3.matrix = function(a, b, c, d ,e ,f) { return new j5g3.Matrix(a, b, c, d, e, f); };
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
 * @return {j5g3.Html} */
j5g3.html   = f(j5g3.Html);
/** @function 
 * @return {j5g3.Engine} */
j5g3.engine = f(j5g3.Engine);

window.j5g3 = j5g3;

})(this);

