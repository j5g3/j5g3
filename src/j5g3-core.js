
(function(window, undefined) {
'use strict';

var
	document = window.document,

	/**
	 * @namespace
	 * Creates a new Engine instance on window.load event.
	 *
	 * @param engine Engine settings.
	 */
	j5g3 = function(engine)
	{
		window.addEventListener('load', function()
		{
			new j5g3.Engine(engine);
		});
	},

	extend =
	/**
	 * Extends object a with properties from object b
	 */
	j5g3.extend = function(a, b)
	{
		for (var i in b)
			a[i] = b[i];
	}
;

extend(j5g3, {/** @lends j5g3 */

	/**
	 * j5g3 Base class
	 * @constructor
	 * @param {Object} p
	 */
	Class: function j5g3Class(p) {
		this.extend(p);
	},

	factory: function(Klass)
	{
		return function(properties) { return new Klass(properties); };
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
	 * Returns a DOM element.
	 * @namespace
	 *
	 * @param {string} tagname
	 */
	dom: function(tagname)
	{
		return document.createElement(tagname);
	}

});

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
	Subclass= function() { },
	/** @type {Object} */
	method
;
	Subclass.prototype = _super.prototype;

	init.prototype = new Subclass();
	init.extend = j5g3.Class.extend;

	for(i in methods)
		if (methods.hasOwnProperty(i))
		{
			method = Object.getOwnPropertyDescriptor(methods, i);
			Object.defineProperty(init.prototype, i, method);
		}

	for (i in static_methods)
		if (static_methods.hasOwnProperty(i))
		{
			method = Object.getOwnPropertyDescriptor(static_methods, i);
			Object.defineProperty(init, i, method);
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

})(this);
