/**
 * Mice.js
 */
(function(window) {
var

	bind = function(fn, scope)
	{
		return (fn.bindfn = fn.bind ? fn.bind(scope) : function() { fn.apply(scope, arguments); });
	},
	
	Mice = function Mice(element)
	{
		this.element = element;
		element.addEventListener('click', bind(this._click, this));
		element.addEventListener('mousemove', bind(this._mousemove, this));
		// Touch Event
		element.addEventListener('touchmove', bind(this._mousemove, this));
	},
	
	mice = window.mice = function(element)
	{
		return new Mice(element);
	},
	
	extend = function(a, b) 
	{
		for (var i in b)
			a[i] = b[i];
	}
;

	extend(Mice.prototype, {
		
		x: 0,
		y: 0,
		dx: 0,
		dy: 0,
		
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
		},
		
		_click: function(ev)
		{
			this._calculate_pos(ev);
			if (this.click) this.click(ev);
		},
		
		_mousemove: function(ev)
		{
			this._calculate_pos(ev);
			if (this.mousemove) this.mousemove(ev);
		},
		
		destroy: function()
		{
			this.element.removeEventListener('click', this._click.bindfn);
			this.element.removeEventListener('mousemove', this._mousemove.bindfn);
			// Touch Event
			this.element.removeEventListener('touchmove', this._mousemove.bindfn);
		}
		
	});

})(this);