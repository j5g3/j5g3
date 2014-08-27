/**
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

	__radius: 0,

	set radius(val)
	{
		this.__radius = val;
		this.width = this.height = val*2;
	},

	get radius()
	{
		return this.__radius;
	},

	init: function j5g3Circle(p)
	{
		if (typeof(p)==='number')
			p = { radius: p };

		j5g3.Shape.call(this, p);
	},

	paintPath: function(context)
	{
		context.arc(this.__radius, this.__radius, this.__radius, 0, 2*Math.PI, false);
	},

	at: j5g3.HitTest.Circle
});

/**
 * Draws a line
 * @class
 * @extend j5g3.Shape
 */
j5g3.Line = j5g3.Shape.extend(/**@lends j5g3.Line.prototype */{

	line_width: 1,

	paintPath: function(context)
	{
		context.moveTo(0, 0);
		context.lineTo(this.width, this.height);
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
		j5g3.Shape.call(this, p);

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
			p.points.push(
				Math.cos(a)*p.radius+p.radius,
				Math.sin(a)*p.radius+p.radius
			);
			a += angle;
		}
		p.width = p.height = p.radius*2;

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
	},

	paint : function(context)
	{
		if (this.fill !== false)
			context.fillRect(0, 0, this.width, this.height);
		if (this.stroke !== false)
			context.strokeRect(0, 0, this.width, this.height);
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
