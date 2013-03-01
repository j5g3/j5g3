/**
 * Copyright 2010-2013, Giancarlo F Bellido.
 *
 * j5 v0.9 - Javascript Library
 * http://j5g3.com
 *
 * j5 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * j5 is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with j5. If not, see <http://www.gnu.org/licenses/>.
 *
 * Date: 2013-03-01 01:55:57 -0500
 *
 */

/*jshint smarttabs:true */
(function(j5) {
'use strict';

/**
 * Lists browser capabilities.
 * @namespace
 */
j5.support = {

	canvas: {
	},

	audio: {

		mp3: j5.dom('audio').canPlayType('audio/mpeg'),
		ogg: j5.dom('audio').canPlayType('audio/ogg')

	}

};

})(this.j5);
