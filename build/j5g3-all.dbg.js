/*!
* @license
*
* j5g3 0.9.0 - Javascript Graphics Engine
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
* Date: Thu Jul 24 2014 01:52:26 GMT-0500 (CDT)
*
*/
(function(window, document, undefined) {
'use strict';

/**
 * Creates a new Engine instance on window.load event.
 *
 * @param engine Engine settings.
 * @namespace j5g3
 */
function j5g3(engine)
{
	window.addEventListener('load', function()
	{
		new j5g3.Engine(engine);
	});
}

window.j5g3 = j5g3;

/**
 * Extends object a with properties from object b
 */
j5g3.extend = function(a, b)
{
	for (var i in b)
		a[i] = b[i];
};

j5g3.extend(j5g3, {

	/**
	 * j5g3 Base class
	 * @constructor
	 * @param {Object} p
	 */
	Class: function j5g3Class(p) {
		this.extend(p);
	},

	factory: function(Klass)
	{
		return function(properties) { return new Klass(properties); };
	},

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
	 * Returns a DOM element.
	 *
	 * @param {string} tagname
	 */
	dom: function(tagname)
	{
		return document.createElement(tagname);
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
	Subclass= function() { },
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

})(this, this.document);

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
 * These are all the core drawing algorithms. "this" will point to the current
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
		context.clearRect(0,0,this.width, this.height);
		this.begin(context);
		this.paint(context);
		this.end(context);
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

		me._dx = me._dy = null;
		me._dh = me._dw = 0;
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
		// This will also clear the canvas.
		cache_canvas.width = w || me.width;
		cache_canvas.height= h || me.height;

		cache_context = cache_canvas.getContext('2d', false);
		cache_context.translate(-me.x-me.cx, -me.y-me.cy);

		me.clear_cache();
		me.draw(cache_context);

		me._cache_source = cache_canvas;

		me._oldPaint= me.draw;
		me.draw = j5g3.Draw.Cache;

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
	Circle: function(x, y, M)
	{
		M = M ? M.product(this.M, this.x, this.y) : this.M.to_m(this.x, this.y);
		M.to_client(x, y);

		return (M.x*M.x+M.y*M.y <= this.radius*this.radius) ? this : false;
	},

	/**
	 * Test hit in all children.
	 */
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

	/**
	 * Rectangle HitTest
	 */
	Rect: function(x, y, M)
	{
		M = M ? M.product(this.M, this.x, this.y) : this.M.to_m(this.x, this.y);
		M.to_client(x, y);

		return ((M.x>0 && M.x<this.width)&&(M.y>0 && M.y<this.height)) ? this : false;
	},

	/**
	 * Polygon HitTest
	 */
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
j5g3.MatrixLite = j5g3.Class.extend(/** @lends j5g3.MatrixLite.prototype */{

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

	/**
	 * Sets scaleX value
	 */
	setScaleX: function(sx)
	{
		this.scaleX = sx;
		return this.calc4();
	},

	/**
	 * Sets scaleY value
	 */
	setScaleY: function(sy)
	{
		this.scaleY = sy;
		return this.calc4();
	},

	/**
	 * Sets the scale x and y values.
	 */
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
j5g3.Matrix = j5g3.Class.extend(/** @lends j5g3.Matrix.prototype */{
	/*jshint maxparams:6 */

	/** a component */
	a: 1,
	/** b component */
	b: 0,
	/** c component */
	c: 0,
	/** d component */
	d: 1,
	/** e component */
	e: 0,
	/** f component */
	f: 0,

	init: function j5g3Matrix(a, b, c, d, e, f)
	{
		if (a!==undefined)
		{
			this.a = a; this.b = b; this.c = c;
			this.d = d; this.e = e; this.f = f;
		}
	},

	translate: function(x, y)
	{
		this.e += x;
		this.f += y;
	},

	/**
	 * Multiply matric values
	 */
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

	/**
	 * Returns a new matrix
	 */
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
 * @class
 *
 */
j5g3.DisplayObject = j5g3.Class.extend(/** @lends j5g3.DisplayObject.prototype */ {

	/**
	 * Used by the draw function to paint the object
	 * @type {j5g3.Image}
	 */
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

	/** X position @type {number} */
	x: 0,

	/** Y position @type {number} */
	y: 0,

	/** Offset X for rotation.  @type {number} */
	cx: 0,
	/** Offset Y @type {number} */
	cy: 0,
	/** @type {number|null} */
	width: null,
	/** @type {number|null} */
	height: null,

	_rotation: 0,

	/** Rotation @type {number} */
	set rotation(val) { this.M.setRotation((this._rotation = val)); },
	get rotation() { return this._rotation; },

	/** X Scale @type {number} */
	set sx(val) {
		this.M.setScaleX(val);
	},
	get sx() { return this.M.scaleX; },

	/** Y Scale @type {number} */
	set sy(val) {
		this.M.setScaleY(val);
	},
	get sy() { return this.M.scaleY; },

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
	 * Sets scaleX and scaleY values. If either sx or sy are NaN, they will be
	 * ignored.
	 */
	scale: function(sx, sy)
	{
		if (sy===undefined)
			sy = sx;

		if (!window.isNaN(sx))
			this.sx = sx;
		if (!window.isNaN(sy))
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

		if (this.width === null)  this.width = this.source.naturalWidth || this.source.width;
		if (this.height === null) this.height = this.source.naturalHeight || this.source.height;
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
	 * Default line height only for Draw.MultilineText. Leave as null for auto.
	 */
	line_height: null,

	_align: null,

	/**
	 * Calculates Text Width and sets cx value based on align.
	 */
	align_text: function(align)
	{
		var width = this.measure();

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

		if (this.line_height===null)
			this.measure();
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
			obj.line_height = parseInt(context.font, 10);

		obj.end(context);

		return max;
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

	/**
	 * @private
	 * It will initialize object without calling setup()
	 */
	_init: function(properties)
	{
		j5g3.DisplayObject.call(this, properties);

		this._frames = [];
		this.add_frame();
	},

	init: function j5g3Clip(properties)
	{
		this._init(properties);

		if (this.setup!==null)
			this.setup();
	},

	/**
	 * Invalidates this object for redraw
	 */
	invalidate: function(obj)
	{
		this.parent.invalidate(obj || this);
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

		if (this.playing)
		{
			if ((this._frame += this.st) >= this.length)
				this._frame = 0;

			this.frame = this._frames[this._frame|0];
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
				this.canvas.setAttribute('mox-opaque', true);
				container.insertBefore(this.canvas, container.firstChild);
			} else
				container.appendChild(this.canvas);
		}

		if (this.width===null)
			this.width = this.canvas.width;
		if (this.height===null)
			this.height= this.canvas.height;
	},

	_init_context: function()
	{
		this.context = this.canvas.getContext('2d', { opaque: this.background });
	},

	init: function j5g3Stage(p)
	{
	var
		me = this
	;
		j5g3.Clip.call(me, p);

		me._init_canvas();

		me.resolution(
			me.width || me.canvas.clientWidth || 640,
			me.height || me.canvas.clientHeight || 480
		);
		me._init_context();
	},

	invalidate: function() { },

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

		this.canvas.width = w;
		this.canvas.height= h;

		return this.size(w, h);
	},

	draw: j5g3.Draw.Root

});


/**
 * @class
 * A more complex stage. Will require a call to invalidate in order to draw.
 */
j5g3.StageDirty = j5g3.Stage.extend(/** @lends j5g3.StageDirty# */{

	/**
	 * Context for display canvas.
	 */
	screen: null,

	/**
	 * Canvas used for rendering.
	 */
	renderCanvas: null,

	draw: j5g3.Draw.RootDirty,

	/**
	 * Dirty Area
	 */
	_dx: 0,
	_dy: 0,
	_dw: 0,
	_dh: 0,

	_init_canvas: function()
	{
		j5g3.Stage.prototype._init_canvas.call(this);
		this.renderCanvas = j5g3.dom('CANVAS');
	},

	_init_context: function()
	{
		this.context = this.renderCanvas.getContext('2d');
		this.screen  = this.canvas.getContext('2d');
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
		if (this._dx===null)
			this._dx = x;
		else if (x < this._dx)
		{
			this._dw += this._dx-x;
			this._dx = x;
		}
		if (this._dy===null)
			this._dy = y;
		if (y < this._dy)
		{
			this._dh += this._dy-y;
			this._dy = y;
		}
		if (x+child.width > this._dx + this._dw)
		{
			this._dw = x+child.width-this._dx;

			if (this._dx + this._dw > this.width)
				this._dw = this.width - this._dx;
		}

		if (y+child.height > this._dy + this._dh)
		{
			this._dh = y+child.height-this._dy;
			if (this._dy + this._dh > this.height)
				this._dh = this.height - this._dy;
		}
	},


	resolution: function(w, h)
	{
		this._dw = this.renderCanvas.width = w;
		this._dh = this.renderCanvas.height= h;

		return j5g3.Stage.prototype.resolution.call(this, w, h);
	}

});

/**
 * @class Tween Class
 */
j5g3.Tween = j5g3.DisplayObject.extend(/**@lends j5g3.Tween.prototype */ {

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

	/**
	 * @param {(j5g3.DisplayObject|Object)} properties DisplayObject
	 *        or an Object containing properties.
	 */
	init: function j5g3Tween(properties)
	{
		if (properties instanceof j5g3.Class)
			properties = { target: properties };

		this.update = this.start;

		j5g3.DisplayObject.apply(this, [ properties ]);
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
		offset = (y%2) ? 0 : -tw2,

		nx = (x * me.tw - offset | 0) - this.cx,
		ny = (y * th2 | 0) - this.cy
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
/** @lends j5g3.Action.prototype */ {

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

}, /** @lends j5g3.Action */ {

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
j5g3.Engine = j5g3.Class.extend(/** @lends j5g3.Engine.prototype */{

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

		// NOTE: Closures are faster than Function.bind()
		me._renderLoopFn = function() { me._renderLoop(); };
		me._renderLoop();

		me._gameLoopFn = function() { me._gameLoop(); };
		me._gameLoopId = window.setInterval(me._gameLoopFn, me.__fps);

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
	 * Game Loop for requestAnimationFrame
	 */
	_renderLoop: function()
	{
		var i=0, l=this.layers.length;

		for (;i<l; i++)
			this.layers[i].draw();

		this._renderLoopId = window.requestAnimationFrame(this._renderLoopFn);
	},

	/**
	 * This is here to allow overriding by Debug.js
	 */
	_gameLoop: function()
	{
		var i=0, l=this.layers.length;

		for (;i<l; i++)
			this.layers[i].draw();

		this.stage.update();
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
	},

	/**
	 * Resume game execution.
	 */
	resume: function()
	{
		if (this.paused)
			this.run();
	},


	/**
	 * Set the game Frames per Second.
	 */
	set fps(val)
	{
		this.__fps=1000/val;
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
			container: stage.container
		}, p);

		layer = new j5g3.StageDirty(lp);
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
 * @return {j5g3.Engine} */
j5g3.engine = f(j5g3.Engine);


})(this, this.j5g3);


(function(window, j5g3, undefined) {

/**
 * @class
 * @extend j5g3.Class
 * @requires j5g3-support.js
 */
j5g3.Loader = j5g3.Class.extend(/** @lends j5g3.Loader.prototype */{

	EVENT: {
		'IMG': 'load',
		'AUDIO': 'canplaythrough',
		'SCRIPT': 'load'
	},

	sources: null,

	/**
	 * How often to check if objects are ready
	 */
	delay: 250,

	/**
	 * Current loader progress
	 */
	progress: 0,
	start: null,

	/**
	 * Number of objects loaded.
	 */
	length: 0,

	/** Called everytime progress changes */
	on_progress: null,
	/** Fires when one asset is loaded. */
	on_source: null,
	/**Fires when all assets are loaded. */
	on_ready: null,

	init: function j5g3Loader(p)
	{
		j5g3.Class.apply(this, [ p ]);

		this.sources = {};
		this.start = new Date();
	},

	_check_ready: function()
	{
	var
		i, ready=0, length=0, me=this
	;
		for (i in this.sources)
		{
			length++;
			if (this.sources.hasOwnProperty(i) && this.sources[i].ready)
				ready++;
		}

		this.progress = ready ? (ready/length) : 0;

		if (this.on_progress)
			this.on_progress(this.progress);

		if (length===ready)
		{
			if (this.on_ready) this.on_ready();
		}
		else
			this._timeout = window.setTimeout(function() { me._check_ready(); }, this.delay);
	},

	el: function(tag, src)
	{
	var
		me = this,
		result = this.sources[src], source
	;
		if (!result)
		{
			result = j5g3.dom(tag);
			this.sources[src] = source = { el: result };

			result.addEventListener(this.EVENT[tag], function() {
				source.ready = true;
				if (me.on_source)
					me.on_source(source);
			}, false);

			result.addEventListener('error', function() {
				source.ready = true;
				window.console.warn('Could not load asset: ' + src);
			}, false);

			result.setAttribute('src', src);

			this.length++;
		} else
			result = result.el;

		return result;
	},

	/**
	 * Load image. @return DOM object
	 */
	img: function(src)
	{
		return this.el('IMG', src);
	},

	/**
	 * Loads audio file. Automatically selects the right type if
	 * the current one is not supported. Returns a DOM object.
	 */
	audio: function(src)
	{
	var
		ext = src.split('.').pop()
	;
		if (!j5g3.support.audio[ext])
			src = src.replace(
				new RegExp("\\."+ext+'$'),
				'.' + j5g3.support.audio.preferred);
		return this.el('AUDIO', src);
	},

	/**
	 * Loads data from URL using AJAX and optionally parses it if
	 * a parser is passed.
	 */
	data: function(src, parser)
	{
	var
		me = this,
		xhr = new window.XMLHttpRequest(),
		result = this.sources[src]
	;
		if (!result)
		{
			result = this.sources[src] = {
				source: src,
				request: xhr
			};

			xhr.onreadystatechange = function() {
				if (xhr.readyState===4)
				{
					result.ready = true;
					result.raw = xhr.responseText;

					if (parser)
						parser(result);

					if (me.on_source)
						me.on_source(xhr);
				}
			};

			xhr.open('GET', src);
			xhr.send();
		}

		return result;
	},

	/**
	 * Loads JSON data, returns an object with the json property
	 * set as the parsed JSON.
	 */
	json: function(src)
	{
		return this.data(src, function(result) {
			result.json = JSON.parse(result.raw);
		});
	},

	/**
	 * Loads a script and executes it. All scripts are loaded asynchronously.
	 */
	script: function(src)
	{
	var
		result = this.el('SCRIPT', src)
	;
		window.document.head.appendChild(result);
		return result;
	},

	/**
	 * Starts loader and calls callback when all objects are loaded.
	 */
	ready: function(callback)
	{
		if (callback)
			this.on_ready = callback;

		this._check_ready();
	},

	/**
	 * Stops and destroys Loader
	 */
	destroy: function()
	{
		window.clearTimeout(this._timeout);
	}

});

/**
 *  @method
 *  @return a new j5g3.Loader object
*/
j5g3.loader = j5g3.factory(j5g3.Loader);

})(this, this.j5g3);

(function(j5g3, undefined) {
'use strict';

/**
 * Collision Object.
 * @class
 * @extend {j5g3.Class}
 */
j5g3.Collision = j5g3.Class.extend(/** @lends j5g3.Collision.prototype */{

	/** Object querying the collition */
	A: null,
	/** Object colliding with */
	B: null,

	/** Collision Normal X component */
	nx: 0,
	/** Collision Normal Y component */
	ny: 0,
	/** Penetration */
	penetration: 0,
	/** Number of contacts */
	length: 0,

	/** Distance of midpoints */
	tx: 0,
	/** Distance of midpoints */
	ty: 0,

	'0': null,
	'1': null,
	'2': null,
	'3': null,
	'4': null,
	'5': null,
	'6': null,

	/**
	 * Checks for collision and fills collision data.
	 */
	query: null

});

/**
 * Circle Collision. Requires a radius property.
 */
j5g3.Collision.Circle = j5g3.Collision.extend({

	query: function(A, B)
	{
	var
		r = A.radius + B.radius,
		x1 = A.x + A.radius + A.cx,
		y1 = A.y + A.radius + A.cy,
		dx= x1 - B.radius - B.cx - B.x,
		dy= y1 - B.radius - B.cy - B.y,
		mag = dx*dx+dy*dy,
		me = this
	;
		if ((me.collides = r*r > mag))
		{
			mag = Math.sqrt(mag);
			me.A = A;
			me.B = B;
			me.nx = dx/mag;
			me.ny = dy/mag;
			me.penetration = r-mag;
			me[0] = x1 - dx / 2;
			me[1] = y1 - dy / 2;

			return true;
		}
	}

});

/**
 * AABB collision algorithm.
 * TODO apply transformations
 */
j5g3.Collision.AABB = j5g3.Collision.extend({

	query: function(A, B)
	{
	var
		x1 = A.x + A.cx, x2 = B.x + B.cx,
		y1 = A.y + A.cy, y2 = B.y + B.cy,

		r1 = x1 + A.width,
		r2 = x2 + B.width,
		b1 = y1 + A.height,
		b2 = y2 + B.height,

		tx, ty,
		coll = this
	;
		coll.collides = !(x2 >= r1 || r2 <= x1 || y2 >= b1 || b2 <= y1);

		if (coll.collides)
		{
			coll.B = B;
			tx = coll.tx = (r2/2) - (r1/2);
			ty = coll.ty = (b2/2) - (b1/2);

			coll[0] = Math.max(x1, x2);
			coll[1] = Math.max(y1, y2);
			coll[2] = Math.min(r1, r2);
			coll[3] = Math.min(b1, b2);

			if (coll[2]-coll[0] < coll[3]-coll[1])
			{
				coll.nx = tx < 0 ? -1 : 1;
				coll.ny = 0;
				coll.penetration = tx<0 ? coll[2]-x1: r1-coll[0];
			} else
			{
				coll.ny = ty < 0 ? -1 : 1;
				coll.nx = 0;
				coll.penetration = ty<0 ? coll[3]-y1 : b1-coll[1];
			}

			return this;
		}
	}

});

/**
 * @namespace
 * Collision Tests return true or false
 */
j5g3.CollisionTest = {

	/**
	 * Circle Collision
	 */
	Circle: function(B)
	{
	var
		A = this,
		r = A.radius + B.radius,
		x1 = A.x + A.radius + A.cx,
		y1 = A.y + A.radius + A.cy,
		dx= x1 - B.radius - B.cx - B.x,
		dy= y1 - B.radius - B.cy - B.y
	;
		return r*r > (dx*dx + dy*dy);
	},

	/**
	 * AABB Collision Test
	 */
	AABB: function(obj)
	{
	var
		r1 = this.x + this.width,
		b1 = this.y + this.height,
		r2 = obj.x + obj.width,
		b2 = obj.y + obj.height
	;

		return !(obj.x > r1 || r2 < this.x || obj.y > b1 || b2 < this.y);
	},

	Container: function(obj)
	{
	var
		frame = this.frame,
		prev = frame,
		result = false,
		// TODO Translate obj coordinates to local
		tobj = {
			x: obj.x - this.x, y: obj.y - this.y,
			width: obj.width, height: obj.height
		}
	;
		while ((prev = prev._previous)!==frame)
			if ((result = prev.collides && prev.collides(tobj)))
				break;

		return result;
	}

};


/**
 * Tests if object collides with another object obj. See j5g3.Collision for available
 * algorithms.
 *
 * @param {j5g3.DisplayObject} obj
 * @return {boolean}
 */
j5g3.DisplayObject.prototype.collides = j5g3.CollisionTest.AABB;
j5g3.Clip.prototype.collides = j5g3.CollisionTest.Container;

})(this.j5g3);

(function(j5g3, undefined) {
'use strict';

/**
 *
 * j5g3.Shape
 *
 * Base class for all shapes.
 *
 * @class
 * @extends j5g3.DisplayObject
 *
 */
j5g3.Shape = j5g3.DisplayObject.extend(
/** @lends j5g3.Shape.prototype */ {

	/**
	 * Type of shape for collision handling.
	 * 'circle', 'segment', 'polygon'
	 */
	shape: null,

	/**
	 * Red value for fill attribute. Make sure to set all three for
	 * colors to work. 0 to 255.
	 */
	red: undefined,

	/**
	 * Green value for fill attribute. Make sure to set all three for
	 * colors to work. 0 to 255.
	 */
	green: undefined,

	/**
	 * Blue value for fill attribute. Make sure to set all three for
	 * colors to work. 0 to 255.
	 */
	blue: undefined,

	/**
	 * Property affected by the red,green and blue properties.
	 */
	color_property: 'fill',

	/* Old values */
	_red: undefined,
	_green: undefined,
	_blue: undefined,

	line_width: null,

	init: function j5g3Shape(p)
	{
		j5g3.DisplayObject.apply(this, [p]);
	},

	_begin: j5g3.DisplayObject.prototype.begin,

	begin: function(context)
	{
		var me = this;

		if (me.red!==me._red || me.blue!==me._blue || me.green!==me._green)
		{
			// TODO this is ridiculous and slow.
			me[me.color_property] = 'rgb(' + Math.floor(me.red) + ',' +
				Math.floor(me.green) + ',' +
				Math.floor(me.blue) + ')'
			;
			me._red = me._red;
			me._green = me.green;
			me._blue = me.blue;
		}

		this._begin(context);
	},

	paintPath: function()
	{
	},

	paint: function(context)
	{
		context.beginPath();
		this.paintPath(context);

		context.closePath();
		context.fill();
		context.stroke();
	}

});

/**
 * Draws a circle
 * @class
 * @extend j5g3.Shape
 */
j5g3.Circle = j5g3.Shape.extend(/**@lends j5g3.Circle.prototype */ {

	shape: 'circle',
	radius: 0,

	init: function j5g3Circle(p)
	{
		if (typeof(p)==='number')
			p = { radius: p };

		j5g3.Shape.apply(this, [ p ]);
	},

	paintPath: function(context)
	{
		// TODO Optimize
		context.arc(this.radius+this.cx, this.radius+this.cy, this.radius, 0, 2*Math.PI, false);
	},

	at: j5g3.HitTest.Circle
});

/**
 * Draws a line
 * @class
 * @extend j5g3.Shape
 */
j5g3.Line = j5g3.Shape.extend(/**@lends j5g3.Line.prototype */{

	x2: 0,
	y2: 0,

	paintPath: function(context)
	{
		context.moveTo(this.cx, this.cy);
		context.lineTo(this.x2, this.y2);
	}

});

/**
 * Polygon Class
 * @class
 * @extend j5g3.Shape
 */
j5g3.Polygon = j5g3.Shape.extend(/**@lends j5g3.Polygon.prototype */{

	shape: 'polygon',
	points: null,
	normals: null,

	init: function j5g3Polygon(p)
	{
		j5g3.Shape.apply(this, [p]);

		if (this.points===null)
			this.points = [];
		if (this.normals===null)
			this.calculate_normals();
	},

	normalize: function(point)
	{
	var
		mag = Math.sqrt(point[0]*point[0] + point[1]*point[1])
	;
		point[0] = point[0]/mag;
		point[1] = point[1]/mag;

		return point;
	},

	calculate_normals: function()
	{
	var
		i=0, a, points = this.points, l=points.length,
		normals = [], point = [0.0,0.0]
	;
		for (; i<l; i+=2)
		{
			a = i+2 < l ? i+2 : 0;
			point[0] = points[a] - points[i];
			point[1] = points[a+1] - points[i+1];
			this.normalize(point);

			normals.push(point[1], -point[0]);
		}

		this.normals = normals;
	},

	paintPath: function(context)
	{
	var
		i = 2,
		P = this.points,
		l = P.length
	;
		context.moveTo(P[0], P[1]);
		for (; i<l; i+=2)
			context.lineTo(P[i], P[i+1]);
	},

	at: j5g3.HitTest.Polygon

}, /** @lends Polygon */{
	/**
	 * Creates a polygon based on number of sides.
	 */
	create: function(sides, p)
	{
	var
		angle = Math.PI*2/sides,
		a = angle
	;
		p.points = [];

		while (sides--)
		{
			p.points.push(Math.cos(a)*p.radius, Math.sin(a)*p.radius);
			a += angle;
		}

		return new j5g3.Polygon(p);
	}

});

/**
 *
 * Displays a Rect
 *
 * @class
 * @extends j5g3.Shape
 *
 */
j5g3.Rect = j5g3.Shape.extend(/**@lends j5g3.Rect.prototype */{

	shape: 'polygon',

	init: function j5g3Rect(p)
	{
		j5g3.Shape.apply(this, [p]);
		if (this.width===null)
		{
			this.height = this.width = this.radius*2;
		}
	},

	paint : function(context)
	{
		context.fillRect(this.cx, this.cy, this.width, this.height);
		context.strokeRect(this.cx, this.cy, this.width, this.height);
	}

});

/**
 * Displays a Dot
 *
 * @class
 * @extends j5g3.Shape
 */
j5g3.Dot = j5g3.Shape.extend(/**@lends j5g3.Dot.prototype */{

	shape: 'circle',
	line_cap: 'round',
	line_join: 'round',
	color_property: 'stroke',

	/**
	 * p can be properties or line_width
	 */
	init: function j5g3Dot(p)
	{
		if (typeof(p) === 'number' )
			p = { line_width: p };

		j5g3.Shape.apply(this, [p]);
	},

	paint: function(context)
	{
		context.strokeRect(0, 0, 1, 1);
	}

});

/** @function
 * @return {j5g3.Polygon} */
j5g3.polygon= j5g3.factory(j5g3.Polygon);
/** @function
 * @return {j5g3.Circle} */
j5g3.circle = j5g3.factory(j5g3.Circle);
/** @function
 * @return {j5g3.Line} */
j5g3.line   = j5g3.factory(j5g3.Line);
/** @function
 * @return {j5g3.Dot} */
j5g3.dot    = j5g3.factory(j5g3.Dot);
/** @function
 * @return {j5g3.Rect} */
j5g3.rect   = j5g3.factory(j5g3.Rect);

})(this.j5g3);

(function(window, j5g3) {
'use strict';
/*jshint freeze:false */

var
	audioEl = j5g3.dom('audio'),
	audioFormats = [ "wav", "mp3", "ogg" ],
	audioMime = [ "audio/wav", "audio/mpeg", "audio/ogg" ]
;

	/// bind() polyfill
	if (!Function.prototype.bind)
		Function.prototype.bind = function(scope)
		{
			var me = this;
			return function() { return me.apply(scope, arguments); };
		};

	/// HTMLAudioElement polyfill
	if (!window.HTMLAudioElement)
		window.HTMLAudioElement = window.Audio;

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.mozRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback)
			{
				return window.setTimeout(callback, 1000/60);
			};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = window.mozCancelAnimationFrame ||
			window.msCancelAnimationFrame ||
			function(id)
			{
				window.clearTimeout(id);
			};

	/**
	 * J5G3 Browser Capabilities module. Includes polyfills for features
	 * used by the engine.
	 * @namespace
	 */
	j5g3.support = {
		audio: {},

		touch: 'ontouchstart' in window.document
	};

	if (audioEl && audioEl.canPlayType)
	{
		// TODO There is probably a better way to do this
		audioFormats.forEach(function (f, i) {
			j5g3.support.audio[f] = audioEl.canPlayType(audioMime[i]);

			if (j5g3.support.audio[f])
				j5g3.support.audio.preferred = f;
		});
	}

})(this, this.j5g3);

(function(window, j5g3, undefined)
{
var
	// jQUery is required only if using the debug toolbar.
	$ = window.jQuery,
	$body,

	dbg =

	/**
	 * Debug Module for j5g3
	 * @namespace
	 */
	j5g3.dbg = {

		error: function(msg)
		{
			throw new Error(msg);
		},

		fn: function(Klass, fn_name, pre, post)
		{
		var
			fn = Klass.prototype[fn_name]
		;
			Klass.prototype[fn_name] = function()
			{
			var
				args = arguments,
				result
			;
				if (pre) pre.apply(this, args);
				result = fn.apply(this, args);
				if (post) post.apply(this, args);

				return result;
			};
		}
	},

	console = window.console,

	/** List of methods that can be overriden, by default all methods starting with
	 * "on_" will be allowed.
	 */
	allow_override = [
		j5g3.Tween.prototype.easing,
		j5g3.Emitter.prototype.source
	]
;
	allow_override.forEach(function(fn) {
		fn.__allow_override = true;
	});

	j5g3.Class.prototype.toString = j5g3.Class.prototype.valueOf = function()
	{
		return this.init.name;
	};

	dbg.fn(j5g3.DisplayObject, 'remove', function()
	{
		if (this.parent === null)
			console.warn("Trying to remove object without parent.", this);
	});

	dbg.fn(j5g3.DisplayObject, 'stretch', function()
	{
		if (!this.width || !this.height)
			dbg.error("Objects without width or height cannot be stretched.");
	});

	dbg.fn(j5g3.Clip, 'add_object', function(display_object)
	{
		if (display_object.parent)
			console.warn('Trying to add DisplayObject without removing first.', display_object);
	});

	dbg.fn(j5g3.Clip, 'go', function(frame) {
		if (frame < 0 || frame > this._frames.length)
			console.warn('Invalid frame number: ' + frame, this);
	});

	j5g3.id = function(id) {
		var result = window.document.getElementById(id);
		if (!result)
			console.warn('Could not find element with ID: ' + id);

		return result;
	};

	j5g3.DisplayObject.prototype.extend = function(props)
	{
		for (var i in props)
		{
			if ((typeof this[i] === 'function') &&
				!(this[i].__allow_override || i.indexOf('on_')===0))
			{
				console.warn('Overriding function ' + i, this);
			}

			if (i[0]==='_')
				console.warn('Overriding private member ' + i, this);

			this[i] = props[i];
		}
	};

	j5g3.Image.prototype._get_source = function(src)
	{
		var source = (typeof(src)==='string') ? j5g3.id(src) : src;

		if (source===null)
			dbg.error("Could not load Image '" + src + "'");

		return source;
	};

	function Tab(p)
	{
	var
		me = this,
		tab = me.$tab = $('<a href="#">'),
		section = me.$section = $('<section>'),
		bar = p.toolbar
	;
		tab.html(p.label)
			.click(function(ev) {
				bar.setActive(me);
				if (p.onclick) p.onclick(ev);
				ev.preventDefault();
			})
		;

		$body.append(section);
		bar.$el.append(tab);

		if (!bar.active)
			bar.setActive(me);
	}

	function Toolbar()
	{
	var
		r = this.$el = $('<div class="j5g3-dbg-toolbar">'),
		content = $('body').children(':not(script)')
	;
		this.tabs = {
			game: new Tab({ toolbar: this, label: 'Game' }),
			cache: new Tab({ toolbar: this, label: 'Cache' })
		};

		this.tabs.game.$section.append(content);
		this.tabs.cache.$section.append($('#j5g3-cache').show());

		$body.append(r);
		window.dispatchEvent(new window.Event('resize'));
	}

	Toolbar.prototype = {

		setActive: function(tab)
		{
			if (this.active)
			{
				this.active.$tab.removeClass('active');
				this.active.$section.removeClass('active');
			}

			tab.$tab.addClass('active');
			tab.$section.addClass('active');
			this.active = tab;
		}

	};

	dbg.attachToolbar = function()
	{
		if (!$)
			return console.error('[j5g3-dbg] attachToolbar requires jQuery.');

		$body = $(window.document.body);
		$body.addClass('j5g3-dbg');

		new Toolbar();
	};


})(this, this.j5g3);

