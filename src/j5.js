/**
 * @license Copyright 2010-2012, Giancarlo F Bellido.
 *
 * j5g3 v0.9 - Javascript Library
 * http://j5g3.com
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
 * Date: 2013-03-04 04:28:43 -0500
 *
 */

(function(window, document, undefined) {
'use strict';

var
property = Object.defineProperty,
describe = Object.getOwnPropertyDescriptor,

HTMLAudioElement = window.HTMLAudioElement,
HTMLElement = window.HTMLElement,

/** @namespace j5g3 */
j5g3 = {

	/** @type {Window} */
	win: window,

	/**
	 * Extends object a with b
	 *
	 * @param {Object} a
	 * @param {Object} b
	 *
	 * @return {Object} Returns a
	 */
	extend: function(a, b)
	{
		for (var i in b)
			a[i] = b[i];

		return a;
	},

	/**
	 * Returns a function that creates a class Klass and takes 1 parameter
	 *
	 * @param {Function} Klass
	 * @return {Function}
	 */
	factory: function(Klass)
	{
		return function(properties) { return new Klass(properties); };
	},

	/**
	 * Clones Array recursively.
	 *
	 * @param {Array} ary
	 *
	 * @return {Array}
	 */
	clone: function j5g3clone(ary)
	{
	var
		i = 0, l=ary.length, current, result=[]
	;
		for (;i < l; i++)
			result.push((current=ary[i]) instanceof Array ?
				j5g3clone(current) :
				current
			);

		return result;
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
	 * @return {number} A random number from 0 to max
	 */
	rand: function(max) { return Math.random() * max; },

	/**
	 * @return {number} A random integer number from 0 to max.
	 */
	irand: function(max) { return Math.floor(Math.random() * max); },

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
	 * Wrapper for window.console.log().
	 */
	log: function()
	{
		window.console.log.apply(window.console, arguments); return this;
	},

	/**
	 * Wrapper for window.console.info().
	 */
	info: function()
	{
		window.console.info.apply(window.console, arguments); return this;
	},

	/**
	 * Wrapper for window.console.warn().
	 */
	warn: function()
	{
		window.console.warn.apply(window.console, arguments); return this;
	},

	/**
	 * Binds function with scope
	 * @deprecated
	 */
	bind: function(fn, scope)
	{
		return function() { fn.apply(scope, arguments); };
	},

	/**
	 * Returns a DOM element.
	 * @namespace
	 *
	 * @param {string} tagname
	 */
	dom: function(tagname)
	{
		return document.createElement(tagname);
	},

	/**
	 * Gets type of obj. It returns 'dom' for HTML DOM objects, 'audio'
	 * for HTMLAudioElement's and 'j5g3' for j5g3.Class descendants.
	 */
	getType: function(obj)
	{
		var result = typeof(obj);

		if (result === 'object')
		{
			if (obj === null) return 'null';
			if (obj instanceof Array) return 'array';
			if (obj instanceof HTMLAudioElement) return 'audio';
			if (obj instanceof HTMLElement) return 'dom';
			if (obj instanceof j5g3.Class) return 'j5g3';
		}

		return result;
	},

	/**
	 * Void function. Does nothing. Used to avoid creating a new empty function.
	 */
	Void: function() { }

},

Class =

/**
 * j5g3 Base class
 * @constructor
 * @param {Object} p
 */
j5g3.Class = function j5g3Class(p) {
	this.extend(p);
};

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
	/** @constructor @ignore */
	Subclass= function() { },
	/** @type {Object} */
	method
;
	Subclass.prototype = _super.prototype;

	init.prototype = new Subclass();
	init.prototype.constructor = init;
	init.prototype.base = _super.prototype;

	init.extend = Class.extend;

	for(i in methods)
		if (methods.hasOwnProperty(i))
		{
			method = describe(methods, i);
			property(init.prototype, i, method);
		}

	for (i in static_methods)
		if (static_methods.hasOwnProperty(i))
		{
			method = describe(static_methods, i);
			property(init, i, method);
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

window.j5g3 = j5g3;

})(this, this.document);

