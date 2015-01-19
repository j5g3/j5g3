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
	this.M = new j5g3.Matrix();
	this.stored = { w: true, h: true };

	if (x!==undefined)
		this.set(x,y,w,h);
};

j5g3.BoundingBox.prototype = {

	/// Bounding box x position
	x: Infinity,
	/// Bounding box y position
	y: Infinity,
	/// Bounding box x2 position
	r: -Infinity,
	/// Bounding box y2 position
	b: -Infinity,

	/// Width
	w: 0,
	/// Height
	h: 0,

	/// Calculated world transformation matrix
	M: null,

	reset: function()
	{
		this.x = this.y = Infinity;
		this.w = this.h = 0;
		this.r = this.b = -Infinity;

		return this;
	},

	set: function(x, y, w, h)
	{
		this.x = x;
		this.y = y;
		this.r = x+w;
		this.b = y+h;
		this.w = w;
		this.h = h;
	},

	/// Clip box to max coordinates
	clip: function(x, y, r, b)
	{
		if (this.x < x) this.x = x;
		if (this.y < y) this.y = y;

		if (this.x > r) this.r = this.x = r;
		else if (this.r > r) this.r = r;

		if (this.y > b) this.b = this.y = b;
		else if (this.b > b) this.b = b;

		this.w = this.r-this.x;
		this.h = this.b-this.y;
	},

	intersect: function(B)
	{
		return !(B.x > this.r || B.r < this.x || B.y > this.b || B.b < this.y);
	},

	store: function()
	{
		var s = this.stored;

		s.x = this.x;
		s.y = this.y;
		s.r = this.r;
		s.b = this.b;

		return this;
	},

	restore: function()
	{
		var s = this.stored;
		this.x = s.x;
		this.y = s.y;
		this.r = s.r;
		this.b = s.b;

		return this;
	},

	union: function(B)
	{
	var
		A = this
	;
		if (B.w && B.h)
		{
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

		return A;
	}
};

/**
 * 2D Transformation Matrix.
 * @class
 */
j5g3.Matrix = function j5g3Matrix(A)
{
	if (A)
		this.copy(A);
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

	/**
	 * Sets the scale x and y values.
	 */
	scale: function(sx, sy)
	{
		this.a *= sx;
		this.b *= sx;
		this.c *= -sy;
		this.d *= sy;
		return this;
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
		return j5g3.matrix(this);
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
		x = x===undefined ? M.e : x;
		y = y===undefined ? M.f : y;
		return this.clone().multiply(M.a, M.b, M.c, M.d, x, y);
	},

	copy: function(B)
	{
		this.a = B.a; this.b = B.b; this.c = B.c;
		this.d = B.d; this.e = B.e; this.f = B.f;
		return this;
	},

	/**
	 * Resets matrix.
	 */
	reset: function()
	{
		this.a = this.d = 1;
		this.b = this.c = this.e = this.f = 0;
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
 * @return {j5g3.Matrix}
 */
j5g3.matrix = function(B) { return new j5g3.Matrix(B); };

})(this.j5g3);