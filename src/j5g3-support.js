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
	audioEl = j5g3.dom('audio')
;

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
		audio: {}
	};

	if (audioEl && audioEl.canPlayType)
	{
		/** Lists supported audio types */
		j5g3.support.audio = {
			/** Audio tag supports mp3 */
			mp3: audioEl.canPlayType('audio/mpeg'),
			/** Audio tag supports ogg */
			ogg: audioEl.canPlayType('audio/ogg'),
			/** Audio tag supports mp4 */
			mp4: audioEl.canPlayType('audio/mp4'),
			/** Audio tag supports wav files */
			wav: audioEl.canPlayType('audio/wav')
		};

		// TODO There is probably a better way to do this
		for (var i in j5g3.support.audio)
			if (j5g3.support.audio[i])
			{
				j5g3.support.audio.default = i;
				break;
			}
	}

})(this, this.j5g3);
