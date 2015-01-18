/**
 * Copyright 2010-2014, Giancarlo F Bellido.
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
 */
(function(window, j5g3) {
'use strict';
/*jshint freeze:false */

var
	audioEl = j5g3.dom('audio'),
	audioFormats = [ "wav", "mp3", "ogg" ],
	audioMime = [ "audio/wav", "audio/mpeg", "audio/ogg" ]
;
	/**
	 * J5G3 Browser Capabilities module. Includes polyfills for features
	 * used by the engine.
	 * @namespace
	 */
	j5g3.support = {
		audio: window.Audio && {},

		touch: 'ontouchstart' in window.document
	};

	if (!window.HTMLAudioElement)
		window.HTMLAudioElement = window.Audio;

	if (window.Audio && audioEl.canPlayType)
	{
		audioFormats.forEach(function (f, i) {
			j5g3.support.audio[f] = audioEl.canPlayType(audioMime[i]);

			if (j5g3.support.audio[f])
				j5g3.support.audio.preferred = f;
		});
	}

})(this, this.j5g3);
