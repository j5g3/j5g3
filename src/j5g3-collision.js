/*
 * j5g3 v0.9.0 - Javascript Collision Module
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
(function(j5g3, undefined) {
'use strict';

/**
 * Collision Object.
 * @class
 * @extend {j5g3.Class}
 */
j5g3.Collision = j5g3.Class.extend(/** @scope j5g3.Collision.prototype */{

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

	init: function j5g3Collision(p)
	{
		if (p)
			this.extend(p);
	}

});

/**
 * @namespace
 * Collision detection algorithms. These algorithms return a Collision object if successful.
 */
j5g3.CollisionQuery = {

	/**
	 * Circle Collision
	 */
	Circle: function(obj)
	{
	var
		r = this.radius + obj.radius,
		dx= this.x - obj.x,
		dy= this.y - obj.y
	;
		if (r*r > (dx*dx + dy*dy))
			return { nx: dx, ny: dy };
	},

	_AABB: function(obj)
	{
	var
		x1 = this.x + this.cx, x2 = obj.x + obj.cx,
		y1 = this.y + this.cy, y2 = obj.y + obj.cy,

		r1 = x1 + this.width,
		r2 = x2 + obj.width,
		b1 = y1 + this.height,
		b2 = y2 + obj.height,

		tx, ty,
		coll = this.collision
	;
		coll.collides = !(x2 >= r1 || r2 <= x1 || y2 >= b1 || b2 <= y1);

		if (coll.collides)
		{
			coll.B = obj;
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

			return this.collision;
		}
	},

	/**
	 * AABB collision algorithm.
	 * TODO apply transformations
	 */
	AABB: function(obj)
	{
		this.collision = new j5g3.Collision({ length: 2, A: this });
		this.collides = j5g3.CollisionQuery._AABB;

		return this.collides(obj);
	}

};

/**
 * @namespace
 * Collision Tests return true or false
 */
j5g3.CollisionTest = {

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
