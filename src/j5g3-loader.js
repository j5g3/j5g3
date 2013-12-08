/**
 * @license Copyright 2010-2012, Giancarlo F Bellido.
 *
 * j5g3-loader v@VERSION - Javascript Library
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
 * Date: @DATE
 *
 */
(function(window, j5g3, undefined) {

/**
 * @class
 * @extend j5g3.Class
 * @requires j5g3-support.js
 */
j5g3.Loader = j5g3.Class.extend(/** @scope j5g3.Loader.prototype */{

	EVENT: {
		IMG: 'load',
		AUDIO: 'canplaythrough',
		SCRIPT: 'load'
	},

	sources: null,

	/**
	 * How often to check if objects are ready
	 */
	delay: 250,

	/**
	 * Current loader progress
	 */
	progress: 0,
	start: null,

	/**
	 * Number of objects loaded.
	 */
	length: 0,

	/** Called everytime progress changes */
	on_progress: null,
	/** Fires when one asset is loaded. */
	on_source: null,
	/**Fires when all assets are loaded. */
	on_ready: null,

	init: function j5g3Loader(p)
	{
		j5g3.Class.apply(this, [ p ]);

		this.sources = {};
		this.start = new Date();
	},

	_check_ready: function()
	{
	var
		i, ready=0, length=0, me=this
	;
		for (i in this.sources)
		{
			length++;
			if (this.sources.hasOwnProperty(i) && this.sources[i].ready)
				ready++;
		}

		this.progress = ready ? (ready/length) : 0;

		if (this.on_progress)
			this.on_progress(this.progress);

		if (length===ready)
		{
			if (this.on_ready) this.on_ready();
		}
		else
			this._timeout = window.setTimeout(function() { me._check_ready(); }, this.delay);
	},

	el: function(tag, src)
	{
	var
		me = this,
		result = this.sources[src], source
	;
		if (!result)
		{
			result = j5g3.dom(tag);
			this.sources[src] = source = { el: result };

			result.addEventListener(this.EVENT[tag], function() {
				source.ready = true;
				if (me.on_source)
					me.on_source(source);
			}, false);

			result.addEventListener('error', function() {
				source.ready = true;
				window.console.warn('Could not load asset: ' + src);
			}, false);

			result.setAttribute('src', src);

			this.length++;
		} else
			result = result.el;

		return result;
	},

	/**
	 * Load image. @return DOM object
	 */
	img: function(src)
	{
		return this.el('IMG', src);
	},

	/**
	 * Loads audio file. Automatically selects the right type if
	 * the current one is not supported. Returns a DOM object.
	 */
	audio: function(src)
	{
	var
		ext = src.split('.').pop()
	;
		if (!j5g3.support.audio[ext])
			src = src.replace(
				new RegExp("\\."+ext+'$'),
				'.' + j5g3.support.audio.preferred);
		return this.el('AUDIO', src);
	},

	/**
	 * Loads data from URL using AJAX and optionally parses it if
	 * a parser is passed.
	 */
	data: function(src, parser)
	{
	var
		me = this,
		xhr = new window.XMLHttpRequest(),
		result = this.sources[src]
	;
		if (!result)
		{
			result = this.sources[src] = {
				source: src,
				request: xhr
			};

			xhr.onreadystatechange = function() {
				if (xhr.readyState===4)
				{
					result.ready = true;
					result.raw = xhr.responseText;

					if (parser)
						parser(result);

					if (me.on_source)
						me.on_source(xhr);
				}
			};

			xhr.open('GET', src);
			xhr.send();
		}

		return result;
	},

	/**
	 * Loads JSON data, returns an object with the json property
	 * set as the parsed JSON.
	 */
	json: function(src)
	{
		return this.data(src, function(result) {
			result.json = JSON.parse(result.raw);
		});
	},

	/**
	 * Loads a script and executes it. All scripts are loaded asynchronously.
	 */
	script: function(src)
	{
	var
		result = this.el('SCRIPT', src)
	;
		window.document.head.appendChild(result);
		return result;
	},

	/**
	 * Starts loader and calls callback when all objects are loaded.
	 */
	ready: function(callback)
	{
		if (callback)
			this.on_ready = callback;

		this._check_ready();
	},

	/**
	 * Stops and destroys Loader
	 */
	destroy: function()
	{
		window.clearTimeout(this._timeout);
	}

});

/**
 *  @method
 *  @return a new j5g3.Loader object
*/
j5g3.loader = j5g3.factory(j5g3.Loader);

})(this, this.j5g3);
