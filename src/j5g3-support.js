/**
 * Copyright 2010-2013, Giancarlo F Bellido.
 *
 * j5g3 v0.9.0 - Javascript Library
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
 * Date: 2013-04-05 12:06:30 -0400
 *
 */
(function(window, j5g3) {
'use strict';

var
	audioEl = j5g3.dom('audio'),
	audioFormats = [ "mp3", "ogg", "mp4", "wav"],
	audioMime = [ "audio/mpeg", "audio/ogg", "audio/mp4", "audio/wav" ]
;

	/// bind() polyfill
	if (!Function.prototype.bind)
		Function.prototype.bind = function(scope)
		{
			var me = this;
			return function() { return me.apply(scope, arguments); };
		};

	/// HTMLAudioElement polyfill
	if (!window.HTMLAudioElement)
		window.HTMLAudioElement = window.Audio;

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.mozRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback)
			{
				return window.setTimeout(callback, 1000/60);
			};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = window.mozCancelAnimationFrame ||
			window.msCancelAnimationFrame ||
			function(id)
			{
				window.clearTimeout(id);
			};

	/**
	 * J5G3 Browser Capabilities module. Includes polyfills for features
	 * used by the engine.
	 * @namespace
	 */
	j5g3.support = {
		audio: {},

		touch: 'ontouchstart' in window.document
	};

	if (audioEl && audioEl.canPlayType)
	{
		// TODO There is probably a better way to do this
		audioFormats.forEach(function (f, i) {
			j5g3.support.audio[f] = audioEl.canPlayType(audioMime[i]);

			if (j5g3.support.audio[f])
				j5g3.support.audio.preferred = f;
		});
	}

})(this, this.j5g3);
