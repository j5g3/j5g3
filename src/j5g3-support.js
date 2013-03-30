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
 * Date: 2013-03-29 20:40:32 -0400
 *
 */
(function(j5g3) {
'use strict';

var
	audioEl = j5g3.dom('audio')
;

	/**
	 * J5G3 Browser Capabilities module.
	 * @namespace
	 */
	j5g3.support = {
		audio: {}
	};

	if (audioEl && audioEl.canPlayType)
	{
		j5g3.support.audio = {
			/** Audio tag supports mp3 */
			mp3: audioEl.canPlayType('audio/mpeg'),
			/** Audio tag supports ogg */
			ogg: audioEl.canPlayType('audio/ogg'),
			/** Audio tag supports mp4 */
			mp4: audioEl.canPlayType('audio/mp4')
		};
	}

})(this.j5g3);
