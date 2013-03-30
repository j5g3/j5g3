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
 * Date: 2013-03-29 20:40:32 -0400
 *
 */
(function(j5g3, undefined) {
'use strict';

/**
 * @namespace
 * Collision detection algorithms.
 */
j5g3.Collision = {

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

};

/**
 * Tests if object collides with another object obj. See j5g3.Collision for available
 * algorithms.
 *
 * @param {j5g3.DisplayObject} obj
 * @return {boolean}
 */
j5g3.DisplayObject.prototype.collides = j5g3.Collision.AABB;

})(this.j5g3);
