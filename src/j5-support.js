/**
 * Copyright 2010-2013, Giancarlo F Bellido.
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

/*jshint smarttabs:true */
(function(j5g3) {
'use strict';

/**
 * Lists browser capabilities.
 * @namespace
 */
j5g3.support = {

	canvas: {
	},

	audio: {

		mp3: j5g3.dom('audio').canPlayType('audio/mpeg'),
		ogg: j5g3.dom('audio').canPlayType('audio/ogg')

	}

};

})(this.j5g3);
