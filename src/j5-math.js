/**
 * j5g3-math v0.9 - Javascript Math Module
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
 * Date: 2013-03-03 14:54:07 -0500
 *
 */

(function(j5g3, undefined) {
'use strict';

var
Math = j5g3.win.Math,

j5Math =

/**
 * @namespace
 */
j5g3.math = {
	/** @const */ PI: Math.PI,
	/** @const */ PI180: Math.PI / 180,

	clamp: function clamp(f, min, max)
	{
		return Math.min(Math.max(f, min), max);
	},

	/**
	 * 2D Determinant
	 */
	determinant: function (a, b, c, d)
	{
		return a*d - c*b;
	},

	/**
	 * Transform points x,y using matrix and stores it in result
	 *
	 * @param {j5g3.Matrix} matrix
	 * @param x
	 * @param y
	 * @param {Array} result
	 */
	transform: function(matrix, x, y, result)
	{
		result[0] = matrix.a * x + matrix.c * y + matrix.e;
		result[1] = matrix.f + matrix.b * x + matrix.d * y;
		return result;
	},

	itransform: function(matrix, x, y, result)
	{
	var
		adbc = matrix.a * matrix.d - matrix.b * matrix.c
	;
		result[0] = (matrix.d*x - matrix.c*y + matrix.c*matrix.f-matrix.d*matrix.e)/adbc;
		result[1] = (-matrix.b*x + matrix.a*y + matrix.b*matrix.e-matrix.a*matrix.f)/adbc;
	},

	/**
	 * Dot Product of [a,b].[c,d]
	 */
	dot: function(a, b, c, d)
	{
		return a*c+b*d;
	},

	cross: function(a, b, c, d)
	{
		return b*c - a*d;
	},

	/**
	 * Returns magnitude of vector [x, y]
	 */
	magnitude: function(x, y)
	{
		return Math.sqrt(x*x + y*y);
	},

	normalize: function(point)
	{
	var
		mag = j5g3.math.magnitude(point[0], point[1])
	;
		point[0] = point[0]/mag;
		point[1] = point[1]/mag;

		return point;
	},

	/**
	 * Converts Degrees deg to Radians
	 */
	to_rad: function(deg)
	{
		return j5g3.math.PI180 * deg;
	}
},

Matrix =
/**
 * 2D Transformation Matrix.
 *
 * [ a c e ]
 * [ b d f ]
 * [ 0 0 1 ]
 */
j5g3.math.Matrix = j5g3.Class.extend({

	a: 1,
	b: 0,
	c: 0,
	d: 1,
	e: 0,
	f: 0,

	_cos: 1,
	_sin: 0,

	_rotation: 0,

	init: function j5mathMatrix(a, b, c, d, e, f)
	{
		if (a!==undefined)
		{
			this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f;
		}
	},

	get rotation() { return this._rotation; },
	set rotation(val)
	{
		this._rotation = val;
		this._cos = Math.cos(val);
		this._sin = Math.sin(val);
		return this.calc4();
	},

	_scaleX: 1,
	get scaleX() { return this._scaleX; },
	set scaleX(val)
	{
		this._scaleX = val;
		this.a = this._scaleX * this._cos;
		this.b = this._scaleX * this._sin;
		return this;
	},

	_scaleY: 1,
	get scaleY() { return this._scaleY; },
	set scaleY(val)
	{
		this._scaleY = val;
		this.c = -this._scaleY * this._sin;
		this.d = this._scaleY * this._cos;
		return this;
	},

	scale: function(sx, sy)
	{
		this.scaleX *= sx;
		this.scaleY *= sy;
		return this;
	},

	translate: function(dx, dy)
	{
		return this.multiply(1, 0, 0, 1, dx, dy);
	},

	rotate: function(a)
	{
		this.rotation += a;
		return this;
	},

	calc4: function()
	{
		this.a = this._scaleX * this._cos;
		this.b = this._scaleX * this._sin;
		this.c = -this._scaleY * this._sin;
		this.d = this._scaleY * this._cos;
		return this;
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
		return j5Math.matrix().multiply(this.a, this.b, this.c, this.d, this.e, this.f);
	},

	/**
	 * Returns a new inverse matrix
	 *
	 * @return {j5g3.math.Matrix}
	 */
	inverse: function()
	{
	var
		m = this.clone(),
		adbc = this.a*this.d-this.b*this.c
		//bcad = this.b*this.c-this.a*this.d
	;
		m.a = this.d / adbc;
		m.b = this.b / -adbc;
		m.c = this.c / -adbc;
		m.d = this.a / adbc;
		m.e = (this.d*this.e-this.c*this.f) / -adbc;
		m.f = (this.b*this.e-this.a*this.f) / adbc;

		return m;
	},

	product: function(M)
	{
		return this.clone().multiply(M.a, M.b, M.c, M.d, M.e, M.f);
	},

	reset: function()
	{
		this.a = 1; this.b = 0; this.c = 0;
		this.d = 1; this.e = 0; this.f = 0;
		this._scaleX = 1; this._scaleY = 1;
		this._cos = 1; this._sin = 0;
		this._rotation = 0;
	},

	x: function(x, y)
	{
		return this.a * x + this.c * y + this.e;
	},

	y: function(x, y)
	{
		return this.f + this.b * x + this.d * y;
	},

	/**
	 * Applies only rotation and scaling transformations.
	 */
	draw: function(obj, x, y)
	{
		obj.x += this.a * x + this.c * y;
		obj.y += this.b * x + this.d * y;
	},

	draw_x: function(x, y)
	{
		return this.a * x + this.c * y;
	},

	draw_y: function(x, y)
	{
		return this.b * x + this.d * y;
	},

	client_x: function(x, y)
	{
	var
		adbc = this.a * this.d - this.b * this.c
	;
		return (this.d*x - this.c*y + this.c*this.f-this.d*this.e)/adbc;
	},

	client_y: function(x, y)
	{
	var
		adbc = this.a * this.d - this.b * this.c
	;
		return (-this.b*x + this.a*y + this.b*this.e-this.a*this.f)/adbc;
	}

})
;

/** Returns a transformation matrix */
j5g3.math.matrix = function(a,b,c,d,e,f) { return new Matrix(a,b,c,d,e,f); };

})(this.j5g3);
