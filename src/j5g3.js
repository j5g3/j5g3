/**
 * j5g3 v0.9 - Javascript Graphics Engine
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
 * Date: 2013-03-02 22:56:16 -0500
 *
 */

(function(window, j5g3, undefined) {
'use strict';

var
	/* This is used by the cache mechanism. It is a canvas element. */
	cache,
	f = j5g3.factory,
	Class = j5g3.Class,

Draw =

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
	 * Draws Image with no transformations only translation
	 */
	FastImage: function(context)
	{
		context.drawImage(this.source, this.x, this.y);
	},

	/**
	 * Drawing Algorithm for cached display objects.
	 */
	Cache: function(context)
	{
		context.drawImage(
			this.source, this.x, this.y, this.width, this.height,
			this.x, this.y, this.width, this.height
		);
	}
},

Paint =

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
		var src = this.source,
		    w = this.width,
		    h = this.height
		;
		// TODO remove conditions

		context.drawImage(
			src.image, src.x, src.y, src.w, src.h,
			this.cx, this.cy, w ? w : src.w, h ? h : src.h
		);
	},

	/**
	 * Paint function for Clips and other containers.
	 */
	Container: function (context)
	{
	var
		frame = this.frame(),
		i = 0,
		l = frame.length
	;

		for (i=0; i<l;i++)
			frame[i].draw(context);

		if (this._playing)
			this.next_frame();
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
			y += this.lineHeight;
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
	 * Paints a 2D map.
	 */
	Map: function(context)
	{
		var map = this.map, y = map.length, x, sprites = this.sprites, s, cm;

		context.translate(0, y*this.th);

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
		var map = this.map, y = 0, x, l=map.length,
		    sprites = this.sprites, cm,
		    dx = Math.round(this.tw/2) + this.offsetX,
		    dy = Math.round(this.th/2) + this.offsetY,
		    offset
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
				sprites[cm[x]].draw(context);
			}

		}

	}

},

Cache =

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
	Canvas: function(context, w, h)
	{
	var
		me = this,
		pc = context,
		cache_canvas = j5g3.dom('CANVAS')
	;
		w = w || me.width;
		h = h || me.height;

		// This will also clear the canvas.
		cache_canvas.width = me.x + w;
		cache_canvas.height= me.y + h;

		context = cache_canvas.getContext('2d');
		me.clear_cache();

		me.draw(context);

		me.source = cache_canvas;

		me._oldPaint= me.draw;
		me.draw = Draw.Cache;

		context = pc;

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

},

Collision =

/**
 * @namespace
 * Collision detection algorithms.
 */
j5g3.Collision = {

	Circle: function(obj)
	{
	var
		r = this.radius + obj.radius,
		dx= this.x - obj.x,
		dy= this.y - obj.y
	;
		return r*r > (dx*dx + dy*dy);
	},

	/**
	 * AABB collision algorithm.
	 * TODO apply transformations
	 */
	AABB: function(obj)
	{
	var
		l1 = this.x,
		t1 = this.y,
		r1 = this.x + this.width,
		b1 = this.y + this.height,
		l2 = obj.x,
		t2 = obj.y,
		r2 = obj.x + obj.width,
		b2 = obj.y + obj.height
	;

		return !(l2 > r1 || r2 < l1 || t2 > b1 || b2 < t1);
	}

},

HitTest =

/**
 * @namespace
 * Hit test algorithms. Assign to 'at' function.
 */
j5g3.HitTest = {

	Circle: function(x, y, M)
	{
		M = M ? M.product(this.M) : this.M;
	var
		dx = M.client_x(x, y),
		dy = M.client_y(x, y)
	;
		return (dx*dx+dy*dy<=this.radius*this.radius) ? this : false;
	},

	Container: function(x, y, M)
	{
		M = M ? M.product(this.M) : this.M.clone();
	var
		frame = this.frame(),
		i = frame.length,
		result
	;
		while (i--)
			if ((result = frame[i].at(x, y, M)))
				break;

		return result;
	},

	Rect: function(x, y, M)
	{
		M = M ? M.product(this.M) : this.M;
	var
		dx = M.client_x(x, y),
		dy = M.client_y(x, y)
	;
		return ((dx>0 && dx<this.width)&&(dy>0 && dy<this.height)) ? this : false;
	},

	Polygon: function(x, y, M)
	{
		M = M ? M.product(this.M) : this.M;
	var
		dx = M.client_x(x, y),
		dy = M.client_y(x, y),
		points = this.points,
		normals = this.normals,
		i = 0, l = points.length,
		dot
	;
		for (; i<l; i+=2)
		{
			dot = normals[i]*(dx-points[i]) + normals[i+1]*(dy-points[i+1]);
			if (dot > 0.0)
				return false;
		}

		return this;
	}

},

DisplayObject =

/**
 * @class Base for all classes
 *
 */
j5g3.DisplayObject = Class.extend(/** @scope j5g3.DisplayObject.prototype */ {

	/** @type {Image} Used by the draw function to paint the object */
	source: null,

	shape: 'rect',

	/**
	 * Parent. By default the parent will always be the Root object
	 * @type Object
	 */
	parent: null,

	/**
	 * Transformation Matrix
	 */
	M: null,

	/** @type {number} X position */
	set x(val) { this.M.e = val; },
	get x() { return this.M.e; },

	/** @type {number} Y position */
	set y(val) { this.M.f = val; },
	get y() { return this.M.f; },

	/** @type {number} Offset X for rotation. */
	cx: 0,
	/** @type {number} Offset Y  */
	cy: 0,
	/** @type {number|null} Width */
	width: null,
	/** @type {number|null} Height */
	height: null,

	/** @type {number} Rotation */
	set rotation(val) { this.M.rotation = val; },
	get rotation() { return this.M._rotation; },

	/** @type {number} X Scale */
	set scaleX(val) { this.M.scaleX = val; },
	get scaleX() { return this.M._scaleX; },

	/** @type {number} Y Scale */
	set scaleY(val) { this.M.scaleY = val; },
	get scaleY() { return this.M._scaleY; },

	/** @type {number} Alpha transparency value */
	alpha: 1,

	/** Blending Mode */
	blending: null,

	/**
	 * Stroke style.
	 */
	stroke: null,

	/**
	 * Fill Style
	 */
	fill: null,

	/**
	 * Font
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
		this.M = j5g3.math.matrix();

		this.extend(properties);
	},

	dirty: true,

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
		if (me.fill!==null) context.fillStyle= me.fill;
		if (me.stroke!==null) context.strokeStyle= me.stroke;
		if (me.font) context.font = me.font;
		if (me.blending) context.globalCompositeOperation=me.blending;

		if (me.line_width!==null) context.lineWidth = me.line_width;
		if (me.line_cap!==null) context.lineCap = me.line_cap;
		if (me.line_join!==null) context.lineJoin = me.line_join;
		if (me.miter_limit!==null) context.miterLimit = me.miter_limit;

		context.transform(m.a, m.b, m.c, m.d, m.e, m.f);
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
	draw: Draw.Default,

	/**
	 * This property is used to store the old paint method when assigning effects.
	 */
	_paint: null,

	/**
	 * Sets object to dirty and forces paint
	 *
	 * @returns {j5g3.DisplayObject} this.
	 */
	invalidate : function()
	{
		this.dirty = true;
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

	size: function(w, h)
	{
		this.width = w;
		this.height = h;
		return this;
	},

	/**
	 * Gets the current transformation matrix, including all the parent's transformations.
	 * Since the transform object is not available until rendering we need to return this using
	 * a callback. Use local_transform() function to get the calculated objects transformation matrix.
	 */
	get_transform: function(callback)
	{
	var
		oldtransform = this.begin
	;
		this.begin = function(context) {
			oldtransform();
			callback(context.currentTransform);
			this.begin = oldtransform;
		};
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

	remove: function()
	{
		this.parent.remove_child(this);
		return this;
	},

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
		return j5g3.clip({ frames: [[ this ]], width: this.width, height: this.height });
	},

	cache: Cache.Canvas,

	/**
	 * Restores Paint Method
	 */
	clear_cache: function()
	{
		if (this._oldPaint)
			this.draw = this._oldPaint;
	},

	/**
	 * Sets properties and invalidates object.
	 */
	set: function(properties)
	{
		this.extend(properties);
		return this.invalidate();
	},

	/**
	 * Tests if point at x, y is inside the DisplayObject.
	 */
	at: HitTest.Rect,

	/**
	 * Tests if object collides with another object obj. See j5g3.Collision for available
	 * algorithms.
	 *
	 * @param {j5g3.DisplayObject} obj
	 * @return {boolean}
	 */
	collides: Collision.AABB,

	/**
	 * Sets scaleX and scaleY values.
	 */
	scale: function(sx, sy)
	{
		this.scaleX = sx;
		this.scaleY = sy;
		return this;
	},

	/**
	 * Rotates object by a radians.
	 *
	 * @param {number} a
	 */
	rotate: function(a)
	{
		this.rotation = a;
		return this;
	}

}),

Image =

/**
 * @class Image Class
 *
 * Constructor takes properties object, a string with the id of an
 * Image or an HTML Image Element.
 *
 * @extends j5g3.DisplayObject
 */
j5g3.Image = DisplayObject.extend(
/** @scope j5g3.Image.prototype */ {

	init: function j5g3Image(properties)
	{
		if (typeof(properties)==='string')
			properties = { source: j5g3.id(properties) };
		else if (properties instanceof window.HTMLElement)
			properties = { source: properties };

		DisplayObject.apply(this, [ properties ]);

		if (this.source)
			this.set_source(this.source);
	},

	paint: Paint.Image,

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

		return this.invalidate();
	}

}),

Text =
/**
 * @class j5g3.Text
 */
j5g3.Text = DisplayObject.extend(/** @scope j5g3.Text.prototype */{

	text: '',

	/**
	 * Default line height only for Draw.MultilineText
	 */
	lineHeight: 12,

	init: function j5g3Text(properties)
	{
		if (typeof properties === 'string')
			properties = { text: properties };

		DisplayObject.apply(this, [properties]);
	},

	paint : Paint.Text,

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
}),

Html =

j5g3.Html = DisplayObject.extend({

	html: '',

	init: function j5g3Html(properties)
	{
		if (typeof(properties) === 'string')
			properties = { html: j5g3.dom(properties).innerHTML };

		DisplayObject.apply(this, [ properties ]);
	}

}),

Clip =

/**
 * @class Clip
 */
j5g3.Clip = DisplayObject.extend(
/** @scope j5g3.Clip.prototype */ {

	init: function j5g3Clip(properties)
	{
		if (properties instanceof Array)
			properties = { frames: properties };

		DisplayObject.apply(this, [ properties ]);

		if (!this.frames)
			this.frames = [ [ ] ];

		this._frame = 0;
		this._playing = true;
	},

	/**
	 * Returns current frame objects.
	 */
	frame: function()
	{
		return this.frames[this._frame];
	},

	/**
	 * Sets next frame index.
	 */
	next_frame : function()
	{
		this._frame = (this._frame < this.frames.length-1) ? this._frame + 1 : 0;
	},

	paint : Paint.Container,

	stop: function() { this._playing = false; return this;},
	play: function() { this._playing = true; return this; },

	is_playing: function() { return this._playing; },

	/**
	 * Adds display_objects to current frame.
	 * If function is passed it converts it to an Action object.
	 */
	add: function(display_object)
	{
		// TODO We might need a getType function.
		switch (j5g3.getType(display_object)) {
		case 'function':
			display_object = new Action(display_object);
			break;
		case 'string':
			display_object = new Image({ source: display_object });
			break;
		case 'array':
			for (var i=0; i < display_object.length; i++)
				this.add(display_object[i]);
			return this;
		case 'audio':
			// Create On the Fly display obejct for audio
			// TODO We might have an Audio class... If we need to.
			//display_object = { parent: window.property('parent'),
			//draw: function() { display_object.play(); } };
			// TODO
			break;
		case 'dom': case 'object':
			display_object = new Image(display_object);
			break;
		case 'undefined':
			throw "Trying to add undefined object to clip.";
		}

		display_object.parent = this;
		display_object._parent_frame = this.frame();
		display_object._parent_frame.push(display_object);

		return this;
	},

	add_frame: function(objects)
	{
		this._frame = this.frames.length;
		this.frames.push([]);
		return objects ? this.add(objects) : this;
	},

	/**
	 * Goes to frame
	 */
	go: function(frame)
	{
		this._frame = frame;
		return this;
	},

	/**
	 * Returns all children in all frames
	 */
	children: function()
	{
		var fs = this.frames, l=fs.length, i=0, a, children=[], cf, cfl;
		for(;i<l;i++)
		{
			cf = fs[i]; cfl=cf.length;
			for (a=0; a<cfl; a++)
				children.push(cf[a]);
		}

		return children;
	},

	/**
	 * Aligns all children
	 */
	align_children : function(alignment)
	{
		var frm = this.children(), i=frm.length;

		while (i--)
			if (frm[i].align)
				frm[i].align(alignment, this);

		return this;
	},

	/**
	 * Returns element at position x,y
	 */
	at: HitTest.Container,

	/**
	 * Removes child.
	 */
	remove_child: function(child)
	{
	var
		paint = this.paint
	;
		/* Replace original paint function with this, so the removal happens
		 * before painting and it doesn't affect rendering.
		 * TODO There is probably a better way to handle this.
		 */
		child.parent = null;
		this.paint = function(context) {
			child._parent_frame.splice(child._parent_frame.indexOf(child), 1);
			this.paint = paint;
			this.paint(context);
		};
	},

	/**
	 * Scales the time coordinate of the clip. Stretches or reduces frames.
	 */
	scaleT: function(t)
	{
	var
		frames = [],
		of = this._oframes || (this._oframes = this.frames),
		l = Math.floor(of.length*t),
		i=0
	;
		for (; i<l; i++)
			frames.push(of[Math.floor(i/t)]);

		this.frames = frames;
		return this;
	}

}),

Stage =

/**
 * Root Clips
 */
j5g3.Stage = Clip.extend({

	/**
	 * Current canvas element.
	 */
	canvas: null,

	/**
	 *
	 */
	context: null,

	/**
	 */
	screen: null,

	renderCanvas: null,

	smoothing: false,

	init: function j5g3Stage(p)
	{
		Clip.apply(this, [p]);

		if (!this.canvas)
			this.canvas = 'screen';

		this.canvas = j5g3.id(this.canvas);

		this.renderCanvas = j5g3.dom('CANVAS');

		this.context = this.renderCanvas.getContext('2d');
		this.screen  = this.canvas.getContext('2d');

		this.context.imageSmoothingEnabled = this.smoothing;

		this.resolution(
			this.width || this.canvas.clientWidth,
			this.height || this.canvas.clientHeight
		);
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

	draw: Draw.Root

}),

Tween =

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
 * @property {function}   on_remove
 * @property {function}   on_stop
 *
 */
j5g3.Tween = Class.extend(/**@scope j5g3.Tween.prototype */ {

	auto_remove: false,
	repeat: Infinity,
	duration: 100,
	parent: null,
	is_playing: false,
	from: null,
	target: null,
	to:   null,
	t: 0,
	/* EVENTS */
	on_stop: null,
	on_remove: null,
	visible: false,

	/**
	 * @param {(j5g3.DisplayObject|Object)} properties DisplayObject
	 *        or an Object containing properties.
	 */
	init: function j5g3Tween(properties)
	{
		if (properties instanceof Class)
			properties = { target: properties };

		this.draw = this.start;

		this.extend(properties);
	},

	pause: function()
	{
		this._olddraw = this.draw;
		this.draw = function() { };

		return this;
	},

	resume: function()
	{
		this.draw = this._olddraw ? this._olddraw : this.start;

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

	remove: function()
	{
		this.parent.remove_child(this);

		if (this.on_remove)
			this.on_remove();

		return this;
	},

	apply_tween: function(i, v)
	{
		return this.from[i] + ( this.easing(v) * (this.to[i]-this.from[i]));
	},

	_calculate: function()
	{
	var
		me = this,
		target = me.target,
		i
	;

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

		me.draw = me._calculate;
		return this;
	},

	set_to: function(to)
	{
		this.to = to;
		return this;
	},

	draw: null,

	invalidate: function() { return this; }

}, {
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
}),

Shape =

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
j5g3.Shape = DisplayObject.extend(
/** @scope j5g3.Shape.prototype */ {

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

	init: function j5g3Shape(p)
	{
		DisplayObject.apply(this, [p]);
	},

	_begin: DisplayObject.prototype.begin,

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

}),

Circle =
j5g3.Circle = Shape.extend(/**@scope j5g3.Circle.prototype */ {

	shape: 'circle',
	radius: 0,

	get width() { return 2 * (this.M.x(this.radius, 0) - this.x); },
	get height() { return 2 * (this.M.y(0, this.radius) - this.y); },

	init: function j5g3Circle(p)
	{
		Shape.apply(this, [ p ]);
	},

	paintPath: function(context)
	{
		// TODO Optimize
		context.arc(this.cx, this.cy, this.radius, 0, 2*Math.PI, false);
	},

	at: HitTest.Circle
}),

Line =
j5g3.Line = Shape.extend(/**@scope j5g3.Line.prototype */{

	x2: 0,
	y2: 0,

	paintPath: function(context)
	{
		context.moveTo(this.cx, this.cy);
		context.lineTo(this.x2, this.y2);
	}

}),

Polygon =

/**
 * Polygon Class
 */
j5g3.Polygon = Shape.extend(/**@scope j5g3.Polygon.prototype */{

	shape: 'polygon',
	points: null,
	normals: null,

	init: function j5g3Polygon(p)
	{
		Shape.apply(this, [p]);

		if (this.points===null)
			this.points = [];
		if (this.normals===null)
			this.calculate_normals();
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
			j5g3.math.normalize(point);

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

	at: HitTest.Polygon

}, {
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

}),

Rect =

/**
 *
 * Displays a Rect
 *
 * @class
 * @extends j5g3.Shape
 *
 */
j5g3.Rect = Shape.extend(/**@scope j5g3.Rect.prototype */{

	shape: 'polygon',

	init: function j5g3Rect(p)
	{
		Shape.apply(this, [p]);
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

}),

Dot =
/**
 * Displays a Dot
 *
 * @class
 * @extends j5g3.Shape
 */
j5g3.Dot = Shape.extend(/**@scope j5g3.Dot.prototype */{

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

		Shape.apply(this, [p]);
	},

	paint: function(context)
	{
		context.strokeRect(0, 0, 1, 1);
	}

}),

Sprite =
/**
 * @class Sprite
 *
 */
j5g3.Sprite = DisplayObject.extend({

	init: function j5g3Sprite(p)
	{
		DisplayObject.apply(this, [ p ]);
	},

	paint: Paint.Sprite

}),

Spritesheet =

/**
 * @class Spritesheet Class
 *
 * Constructor can take properties object, a string with the filename, an
 * HTML Image or j5g3 Image.
 *
 */
j5g3.Spritesheet = Class.extend(/** @scope j5g3.Spritesheet.prototype */ {

	width: 0,
	height: 0,

	/**
	 * Image of the spritesheet. If a string passed it will be converted
	 * to a j5g3.Image
	 */
	source: null,
	sprites: null,

	init: function j5g3Spritesheet(properties)
	{
		switch (j5g3.getType(properties)) {
		case 'string': case 'dom': case 'j5g3':
			properties = { source: properties };
			break;
		case 'undefined':
			properties = {};
		}

		switch (j5g3.getType(properties.source)) {
		case 'string': case 'dom':
			properties.source = new Image(properties.source);
			break;
		}

		if (properties.width === undefined && properties.source)
			properties.width = properties.source.width;

		if (properties.height === undefined && properties.source)
			properties.height = properties.source.height;

		this.extend(properties);
		this.sprites = this.sprites || [];
	},

	/**
	 * Creates clip from spritesheet indexes. Takes a variable number of arguments.
	 */
	clip: function()
	{
		return this.clip_array(arguments);
	},

	clip_array: function(sprites)
	{
		var s = this.sprites,
		    i,
		    sprite,
		    // Make sure clip starts with no frames...
		    clip = new Clip({ frames: [] }),
		    w=0, h=0
		;

		for (i = 0; i < sprites.length; i++)
		{
			clip.add_frame([
				(typeof(sprite=sprites[i]) === 'number') ?
					(sprite=s[sprite]) : sprite
			]);
			if (sprite.width > w) w = sprite.width;
			if (sprite.height> h) h = sprite.height;
		}

		return clip.size(w, h);
	},

	/**
	 * Cuts a sprite and returns the ss object.
	 */
	push: function(x, y, w, h)
	{
		this.cut(x, y, w, h);
		return this;
	},

	/**
	 * Returns a Sprite object from a section of the Spritesheet. It also adds
	 * it to the sprites list.
	 */
	cut: function(x, y, w, h)
	{
		var s = new Sprite(j5g3.getType(x) === 'object' ?
			{ width: x.w, height: x.h, source: {
				image: this.source.source, x: x.x, y: x.y, w: x.w, h: x.h
			} }
		:
			{ width: w, height: h, source: {
				image: this.source.source, x: x, y: y, w: w, h: h
			} }
		);

		this.sprites.push(s);

		return s;
	},

	/**
	 * Divides spritesheet into a grid of y rows and x columns and a
	 * border of b. By default b is 0.
	 */
	grid: function(x, y, b)
	{
		b = b || 0;

		var
		    b2= 2*b,
		    w = this.width / x - b2,
		    h = this.height / y - b2,
		    r,c
		;

		for (r=0; r < y; r++)
			for (c=0; c < x; c++)
				this.cut(c*(w+b2)+b, r*(h+b2)+b, w, h);

		return this;
	},

	/**
	 * Returns sprite at index
	 */
	sprite: function(index)
	{
		return this.sprites[index];
	},

	/**
	 * Returns a map with the sprites property set and the tw and th specified.
	 */
	map: function(tw, th)
	{
		return new Map({ sprites: this.sprites, tw: tw, th: th });
	}

}),

Emitter =

/**
 * @class Particle Emitter
 *
 * @extends j5g3.Clip
 */
j5g3.Emitter = Clip.extend(/**@scope j5g3.Emitter.prototype */ {

	init: function j5g3Emitter(p)
	{
		Clip.apply(this, [p]);
	},

	/**
	 * DisplayObject to be used when emitting particles. It will be
	 * enclosed in a clip.
	 */
	source: null,

	/**
	 * Class of the object to Emit.
	 * @default j5g3.Clip
	 *
	 */
	container_class: j5g3.Clip,

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
	on_emit: function() { },

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
		clip = new this.container_class()
	;
		if (this.source)
			clip.add(this.source);

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
		this.add(clip);
		this.on_emit(clip);
	},

	_paint: Paint.Container,

	paint: function(context)
	{
	var
		i = this.count
	;
		while (i--)
			this._emit();

		this._paint(context);
	}

}),

Map =

/**
 * @class Maps an array to a spritesheet.
 *
 * Properties:
 *
 *
 * @extends j5g3.DisplayObject
 *
 */
j5g3.Map = DisplayObject.extend(/**@scope j5g3.Map.prototype */ {

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
		DisplayObject.apply(this, [p]);

		if (this.map===null)
			this.map = [];
	},

	getTileAt: function(x, y)
	{
		var
	            me = this,

		    nx = Math.round(x / me.tw),
		    ny = Math.round(y / (me.th/2 + me.offsetY))
		;

		return this.map[ny][nx];
	},

	/**
	 * Gets the top left coordinate of the tile at x,y for isometric maps.
	 * TODO
	 */
	getIsometricCoords: function(x, y)
	{
	var
		me = this,
		tw2=Math.floor(this.tw/2) + this.offsetX,
		th2=Math.floor(this.th/2)+this.offsetY,
		offset = (y%2)*tw2,

		nx = Math.round(x * me.tw - offset),
		ny = Math.round(y * th2)
		;

		return { x: nx, y: ny };
	},

	/**
	 * Sets the map to Isometric
	 */
	set_iso: function()
	{
		this.paint = Paint.Isometric;
		return this;
	},

	paint: Paint.Map

}),

Action =

/**
 * Executes code on FrameEnter.
 *
 * @class
 * @extends j5g3.Class
 *
 */
j5g3.Action = Class.extend(
/** @scope j5g3.Action.prototype */ {

	_init: Class,

	/**
	 * Code to execute
	 */
	draw: j5g3.Void,

	init: function j5g3Action(p)
	{
		if (j5g3.getType(p)==='function')
			p = { draw: p };

		this._init(p);
	},

	remove: DisplayObject.prototype.remove

}, /** @scope j5g3.Action */ {

	/**
	 * Rotates object forever. Clockwise by default.
	 */
	rotate: function(obj)
	{
		return function() {
			obj.rotation = obj.rotation < 6.1 ? obj.rotation+0.1 : 0;
		};
	},

	stop: function()
	{
		this.parent.stop();
	},

	/**
	 * Removes the clip
	 */
	Remove: function()
	{
		this.parent.remove();
	},

	/**
	 * Action to run once and remove itself
	 */
	once: function(fn)
	{
		return j5g3.action(function() {
			fn();
			this.remove();
		});
	}


}),

Engine =
/**
 * @class
 * Engine class
 */
j5g3.Engine = Class.extend({

	version: '0.9',

	useAnimationFrame: false,

	/* Frames per Second */
	__fps: 31,

	/**
	 * Starts the engine.
	 */
	run: function()
	{
	var
		me = this
	;
		if (me.process)
			window.clearInterval(me.process);

		me.process = window.setInterval(me._scopedLoop, me.__fps);
	},

	destroy: function()
	{
		if (this.process)
			window.clearInterval(this.process);

		if (this.on_destroy)
			this.on_destroy();
	},

	/**
	 * This is here to allow overriding by Debug.js
	 */
	_gameLoop: function()
	{
		this.stage.draw();
	},

	startFn: function() { },

	/**
	 * Starts Engine
	 */
	init: function j5g3Engine(config)
	{
	var
		me = this
	;
		if (typeof(config)==='function')
			config = { startFn: config };

		cache = j5g3.dom('CANVAS');

		me.fps(config.fps || me.__fps);

		if (config.fps)
			delete config.fps;

		me.extend(config);

		me._scopedLoop = me._gameLoop.bind(me);

		me.set_stage(new Stage(config.stage_settings))
			.startFn(j5g3)
		;
	},

	set_stage: function(stage)
	{
		this.stage = stage;
		return this;
	},

	/**
	 * Pauses game execution
	 */
	pause: function()
	{
		if (this.stage)
			this.stage.stop();
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
		switch(j5g3.getType(w)) {
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

})
;


/* CLASSES */
j5g3.action = f(Action);
j5g3.clip   = f(Clip);
j5g3.dot    = f(Dot);
j5g3.image  = f(Image);
j5g3.rect   = f(Rect);
j5g3.sprite = f(Sprite);
j5g3.spritesheet = f(Spritesheet);
j5g3.text   = f(Text);

/**
 * Returns a Multiline Text object
 */
j5g3.mtext  = function(p) { var t = new Text(p); t.paint = Paint.MultilineText; return t; };
j5g3.tween  = f(Tween);
j5g3.emitter= f(Emitter);
j5g3.map    = f(Map);
j5g3.polygon= f(Polygon);
j5g3.circle = f(Circle);
j5g3.line   = f(Line);
j5g3.html   = f(Html);
j5g3.engine = f(Engine);

/** Returns a CanvasGradient object. */
j5g3.gradient = function(x, y, w, h)
{
	return cache.getContext('2d').createLinearGradient(x,y,w,h);
};

/** Returns a rgba CSS color string */
j5g3.rgba = function(r, g, b, a)
{
	if (a===undefined)
		a = 1;

	return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
};

/** Returns a hsla CSS color string */
j5g3.hsla = function(h, s, l, a)
{
	if (a===undefined)
		a = 1;

	return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
};


// TODO This might not be a good idea.
j5g3.win.CanvasGradient.prototype.at = function(offset, color)
{
	color = color || 'transparent';
	this.addColorStop(offset, color);
	return this;
};

})(this, this.j5g3);

