/**
 * j5fx v0.9 - Javascript Effects Module
 * http://j5g3.com
 *
 * Copyright 2010-2013, Giancarlo F Bellido
 *
 * j5fx is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * j5fx is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Foobar. If not, see <http://www.gnu.org/licenses/>.
 *
 * Date: 2013-03-01 01:55:57 -0500
 *
 */

(function(j5, undefined) {
'use strict';

/**
 * j5fx Module.
 *
 * @namespace
 */
j5.fx = {

	/**
	 *
	 * @namespace
	 * Text effects algorithms. All effects require old draw method to be
	 * in the _paint property
	 *
	 */
	Text:
	{
		Neon: function(context)
		{
		var
			color  = this.stroke || this.fill,
			lw = this.lineWidth
		;
			context.globalAlpha = 0.20;
			context.lineWidth = lw+6;
			context.strokeText(this.text, this.cx, this.cy);

			context.globalAlpha = 0.40;
			context.lineWidth = lw+3;
			context.strokeText(this.text, this.cx, this.cy);

			context.globalAlpha = 1;
			context.lineWidth = lw;
			context.strokeText(this.text, this.cx, this.cy);

			context.globalCompositeOperation='lighter';

			context.fillStyle = color;
			context.fillText(this.text, this.cx, this.cy);

			context.fillStyle = '#eee';
			context.globalAlpha = 0.6;
			context.fillText(this.text, this.cx, this.cy);
		},

		Mirror: function(context)
		{
			this._paint(context);
			context.scale(1, -1);

			if (!this.gradient)
			{
				this.gradient = context.createLinearGradient(0,0,0,-100);
				this.gradient.addColorStop(0, this.fill);
				this.gradient.addColorStop(0.5, 'transparent');
			}
			context.fillStyle = this.gradient;
			this._paint(context);
		}
	/*
		Gradient: function()
		{
		}
		*/

	},

	Shake: function(radius)
	{
	var
		r2 = radius*2
	;
		return function(i, t) { return t===1 ? this.to[i] : -radius+j5.rand(r2); };
	},

	/**
	 * @namespace
	 */
	Easing: (function()
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
	})()

};

}(this.j5));

