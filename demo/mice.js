/**
 * Mice.js
 * 
 * Mouse, Touch and Keyboard events wrapper.
 * 
 * Events: 
 * 
 * - click
 * - dbclick
 * - move
 * 
 */
(function(window) {
var

	bind = function(fn, scope)
	{
		return (fn.bindfn = fn.bind ? fn.bind(scope) : function() { fn.apply(scope, arguments); });
	},
	
	Mice = function Mice(element, eventmap)
	{
		this.element = element;
		this.keyboard = {};
		this.keymap = {};
		
		extend(this.keymap, keymap);
		if (eventmap)
			extend(this, eventmap);
		
		// Mouse Events
		element.addEventListener('click', bind(this._click, this));
		element.addEventListener('mousemove', bind(this._mousemove, this));
		
		// Touch Event
		element.addEventListener('touchmove', bind(this._mousemove, this));
		element.addEventListener('touchstart', bind(this._touchstart, this));
		element.addEventListener('touchend', bind(this._touchend, this));
		
		// Keyboard Events
		element.addEventListener('keydown', bind(this._keydown, this));
		element.addEventListener('keyup', bind(this._keyup, this));
	},
	
	mice = window.mice = function(element, eventmap)
	{
		return new Mice(element, eventmap);
	},
	
	extend = function(a, b) 
	{
		for (var i in b)
			a[i] = b[i];
	},
	
	keymap = {
		32: 'fire',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	}
;

	extend(Mice.prototype, {/** @scope Mice.prototype */
		
		/// Cursor X position relative to element
		x: 0, 
		/// Cursor Y position relative to element
		y: 0,
		/// Change of X from previous event
		dx: 0, 
		/// Change of Y from previous event
		dy: 0,
		
		/// Maps keycodes to actions
		keymap: null,
		
		/// Element to attach events to
		element: null,
		
		_calculate_pos: function(ev)
		{
		var
			scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
			scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft,
			x = ev.clientX - this.element.offsetLeft + scrollLeft,
			y = ev.clientY - this.element.offsetTop + scrollTop
		;
			this.dx = x - this.x;
			this.dy = y - this.y;
			
			this.x = x;
			this.y = y;
			
			ev.mice = this;
		},
		
		_click: function(ev)
		{
			this._calculate_pos(ev);
			if (this.click) this.click(ev);
		},
		
		_mousemove: function(ev)
		{
			this._calculate_pos(ev);
			if (this.move) this.move(ev);
		},
		
		_keydown: function(ev)
		{
		var
			kc = ev.keyCode,
			fn = this.keymap[kc]
		;
			ev.mice = this;
				
			if (fn && this[fn])
				this[fn](ev);
		},
		
		_keyup: function(ev)
		{
			
		},
		
		_touchstart: function(ev)
		{
			this._calculate_pos(ev);
			if (this.click) this.click(ev);
		},
		
		_touchend: function(ev)
		{
			
		},
		
		destroy: function()
		{
			this.element.removeEventListener('click', this._click.bindfn);
			this.element.removeEventListener('mousemove', this._mousemove.bindfn);
			// Touch Event
			this.element.removeEventListener('touchmove', this._mousemove.bindfn);
			this.element.removeEventListener('touchstart', this._touchstart.bindfn);
			this.element.removeEventListener('touchend', this._touchend.bindfn);
			
			// Keyboard Events
			this.element.removeEventListener('keydown', this._keydown.bindfn);
			this.element.removeEventListener('keyup', this._keyup.bindfn);
		}
		
	});

})(this);