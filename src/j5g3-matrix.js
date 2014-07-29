/*
 * j5g3 v0.9.0 - Javascript Collision Module
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
(function(j5g3, undefined) {
"use strict";
/*jshint maxparams:6 */

j5g3.BoundingBox = function j5g3BoundingBox(x, y, w, h)
{
	this.dirty = [];
	this.set(x,y,w,h);
};

j5g3.BoundingBox.prototype = {

	/// Bounding box x position
	x: null,
	/// Bounding box y position
	y: null,
	/// Bounding box x2 position
	r: 0,
	/// Bounding box y2 position
	b: 0,

	w: 0,

	h: 0,

	reset: function()
	{
		this.x = this.y = Infinity;
		this.w = this.h = this.r = this.b = 0;

		return this;
	},

	set: function(x, y, w, h)
	{
		this.x = x;
		this.y = y;
		this.r = x+w;
		this.b = y+h;
	},

	intersect: function()
	{
		return true;
	},

	transform: function(obj, M)
	{
		var x, y, x2, y2, x3, y3;

		M = M.product(obj.M, obj.x, obj.y);
		M.to_world(obj.cx, obj.cy);
		x = M.x; y = M.y;
		M.to_world(obj.width+obj.cx, obj.height+obj.cy);
		x2 = M.x; y2 = M.y;
		M.to_world(obj.cx, obj.height+obj.cy);
		x3 = M.x; y3 = M.y;
		M.to_world(obj.width+obj.cx, obj.cy);

		this.x = Math.min(x, x2, x3, M.x) | 0;
		this.y = Math.min(y, y2, y3, M.y) | 0;
		this.r = Math.max(x, x2, x3, M.x) | 0;
		this.b = Math.max(y, y2, y3, M.y) | 0;
		this.w = this.r - this.x;
		this.h = this.b - this.y;
	},

	union: function(B)
	{
	var
		A = this
	;
		if (B.x < A.x)
			A.x = B.x;

		if (B.y < A.y)
			A.y = B.y;

		if (B.r > A.r)
			A.r = B.r;

		if (B.b > A.b)
			A.b = B.b;

		A.w = A.r-A.x;
		A.h = A.b-A.y;
	}
};

/**
 * 2D Transformation Matrix.
 * @class
 */
j5g3.Matrix = function j5g3Matrix(a, b, c, d, e, f)
{
	if (a!==undefined)
	{
		this.a = a; this.b = b; this.c = c;
		this.d = d; this.e = e; this.f = f;
	}
};

j5g3.Matrix.prototype = {

	/** a component */
	a: 1,
	/** b component */
	b: 0,
	/** c component */
	c: 0,
	/** d component */
	d: 1,
	/** e component (x coord) */
	e: 0,
	/** f component (y coord) */
	f: 0,

	/// Precalculated Cosine
	_cos: 1,
	/// Precalculated Sine
	_sin: 0,

	/// Scale X
	sx: 1,
	/// Scale Y
	sy: 1,

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
		this.sx = sx;
		return this.calc4();
	},

	/**
	 * Sets scaleY value
	 */
	setScaleY: function(sy)
	{
		this.sy = sy;
		return this.calc4();
	},

	/**
	 * Sets the scale x and y values.
	 */
	scale: function(sx, sy)
	{
		this.sx = sx;
		this.sy = sy;
		return this.calc4();
	},

	calc4: function()
	{
		this.a = this.sx * this._cos;
		this.b = this.sx * this._sin;
		this.c = -this.sy * this._sin;
		this.d = this.sy * this._cos;
		return this;
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
		return j5g3.matrix(this.a, this.b, this.c, this.d, this.e, this.f);
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
		return this.clone().multiply(M.a, M.b, M.c, M.d, x || M.e || 0, y || M.f || 0);
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
	 * Applies transformations and stores them in this.x, this.y.
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

};

/** @function
 * @return {j5g3.Matrix} */
j5g3.matrix = function(a, b, c, d ,e ,f) { return new j5g3.Matrix(a, b, c, d, e, f); };

})(this.j5g3);