/**
 * j5g3 v0.9.0 - Javascript Physics Engine
 * http://
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
 * Date: 2013-03-31 01:53:59 -0400
 *
 */
(function(j5g3, undefined) {
'use strict';

j5g3.Collision = j5g3.Class.extend({

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
		r1 = this.x + this.width,
		r2 = obj.x + obj.width,
		b1 = this.y + this.height,
		b2 = obj.y + obj.height,
		tx, ty,
		coll = this.collision
	;
		coll.collides = !(obj.x >= r1 || r2 <= this.x || obj.y >= b1 || b2 <= this.y);

		if (coll.collides)
		{
			coll.B = obj;
			tx = coll.tx = (obj.x+obj.width/2) - (this.x+this.width/2);
			ty = coll.ty = (obj.y+obj.height/2) - (this.y+this.height/2);

			coll[0] = Math.max(this.x, obj.x);
			coll[1] = Math.max(this.y, obj.y);
			coll[2] = Math.min(r1, r2);
			coll[3] = Math.min(b1, b2);

			if (coll[2]-coll[0] < coll[3]-coll[1])
			{
				coll.nx = tx < 0 ? -1 : 1;
				coll.ny = 0;
				coll.penetration = tx<0 ? coll[2]-this.x: r1-coll[0];
			} else
			{
				coll.ny = ty < 0 ? -1 : 1;
				coll.nx = 0;
				coll.penetration = ty<0 ? coll[3]-this.y : b1-coll[1];
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

})(this.j5g3);
