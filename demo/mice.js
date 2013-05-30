/**
 * Mice.js - Fast Input Handler for web browsers.
 * 
 * Copyright 2010-2013, Giancarlo F Bellido
 * 
 * Mouse, Touch, Keyboard and Joystick events wrapper.
 * 
 */
(function(window) {
"use strict";
var

	bind = function(fn, scope)
	{
		return fn.bind ? fn.bind(scope) : function() { fn.apply(scope, arguments); };
	},
	
	AddEvent = function(name, fn)
	{
	var
		scopedFn = bind(fn, this)
	;
		this.handler[name] = scopedFn;
		this.mice.element.addEventListener(name, scopedFn);
	},
	
	RemoveEvent = function(name)
	{
		this.mice.element.removeEventListener(name, this.handler[name]);
	},
	
	/**
	 * Extends the module class
	 */
	module = function(p)
	{
	var
		Fn = p.init || (function(mice) { 
			this.handler = {};
			this.mice = mice; 
		})
	;
		p.on = AddEvent;
		p.un = RemoveEvent;
		Fn.prototype = p;
		
		return Fn;
	},
	
	Module = {
		
		mouse: module({
			
			x_threshold: 4,
			y_threshold: 4,
			
			/// Captures Mouse move event. Set to false to improve performance.
			capture_move: true,
			
			_calculate_bound: function()
			{
			var
				el = this.mice.element,
				rect
			;
				if (el.getBoundingClientRect)
				{
					rect = el.getBoundingClientRect();
					this.bx = rect.left;
					this.by = rect.top;
				} else
				{
					this.bx = el.clientLeft;
					this.by = el.clientTop;
				}
			},
			
			_calculate_pos: function(ev)
			{
			var
				x = ev.pageX- this.bx,
				y = ev.pageY- this.by
			;
				this.mice.set_pos(x, y);
			},
			
			_click: function(ev)
			{
			var
				button = ({ 0: 'buttonY', 1: 'buttonX', 2: 'buttonA' })[ev.button]
			;
				this._calculate_pos(ev);
				this.mice.fire(button , ev);
				
				return false;
			},
			
			_mouseup: function(ev)
			{
			},
			
			_mousedown: function(ev)
			{
			},
			
			_mousemove: function(ev)
			{
				if (!this.capture_move)
					return;
					
				this._calculate_pos(ev);
				
				if (Math.abs(this.mice.dx) > this.x_threshold || 
					Math.abs(this.mice.dy) > this.y_threshold)
				{
					this.mice.fire('move', ev);
				}
			},
			
			enable: function()
			{
				this.on('mousedown', this._mousedown);
				this.on('mouseup', this._mouseup);
				this.on('mousemove', this._mousemove);
				this.on('click', this._click);
				this.on('contextmenu', this._click);
				
				this.handler.resize = bind(this._calculate_bound, this);
				window.addEventListener('resize', this.handler.resize);
				
				this._calculate_bound();
			},
			
			disable: function()
			{
				this.un('mousedown');
				this.un('mouseup');
				this.un('mousemove');
				this.un('click');
				this.un('contextmenu');
				
				window.removeEventListener('resize', this.handler.resize);
			}
			
		}),
		
		touch: module({
			
			/// Amount of movement required for left/right events
			x_threshold: 50,
			/// Amount of movement required for up/down events
			y_threshold: 50,
			/// Flick threshold
			flick_threshold: 120,
			
			flick_delay: 300,
			
			/// Delay of tap
			tap_delay: 200,
			
			_calculate_pos: function(ev)
			{
			var
				touch = ev.changedTouches[0]
			;
				this.mice.set_pos(touch.pageX, touch.pageY);
			},
			
			_touchmove: function(ev)
			{
				this._calculate_pos(ev);
				
				var
					x = this.mice.x, y = this.mice.y,
					tdx = x - this._mx,
					tdy = y - this._my,
					event_name
				;
				if (tdx < -this.x_threshold)
				{
					this._mx = x;
					event_name = 'left';
				}
				else if (tdx > this.x_threshold)
				{
					this._mx = x;
					event_name = 'right';
				}
				
				if (tdy < -this.y_threshold)
				{
					this._my = y;
					event_name = 'up';
						
				} else if (tdy > this.y_threshold)
				{
					this._my = y;
					event_name = 'down';
				}
				
				if (event_name)
				{
					this.mice.fire('move', ev);
					this.mice.fire(event_name, ev);
				}
			},
			
			_flick_action: function(ev)
			{
				var
					x = this.mice.x, y = this.mice.y,
					tdx = x - this._tx,
					tdy = y - this._ty,
					event_name
				;
				
				if (tdx < -this.flick_threshold)
					event_name = 'buttonY';
				else if (tdx > this.flick_threshold)
					event_name = 'buttonA';
				
				if (tdy < -this.flick_threshold)
					event_name = 'buttonX';
				else if (tdy > this.flick_threshold)
					event_name = 'buttonB';
				
				if (event_name)
					this.mice.fire(event_name, ev);
				else
					this.mice.fire('buttonY', ev);
			},
			
			_touchstart: function(ev)
			{
				this._touchstart_t = Date.now();
				
				this._tx = this._mx = ev.touches[0].pageX;
				this._ty = this._my = ev.touches[0].pageY;
			},
			
			_touchend: function(ev)
			{
			var
				dt = Date.now() - this._touchstart_t
			;
				this._calculate_pos(ev);
			
				if (dt < this.flick_delay)
					this._flick_action(ev);
			},
		
			enable: function()
			{
				this.on('touchmove', this._touchmove);
				this.on('touchstart', this._touchstart);
				this.on('touchend', this._touchend);
			},
			
			disable: function()
			{
				this.un('touchmove');
				this.un('touchstart');
				this.un('touchend');
			}
			
		}),
		
		keyboard: module({
			
			MAP: {
				32: 'buttonB', // space
				13: 'buttonY', // enter
				16: 'buttonX', // shift
				17: 'buttonA', // ctrl
				
				37: 'left',
				38: 'up',
				39: 'right',
				40: 'down',
				105: 'up_right',
				103: 'up_left',
				99: 'down_right',
				97: 'down_left'
			},
			
			keymap: null,
			
			_keydown: function(ev)
			{
			var
				kc = ev.keyCode,
				fn = this.keymap[kc]
			;
				if (fn)
				{
					this.mice.fire(fn, ev);
					
					if (kc>32)
					{
						ev.direction = fn;
						this.mice.fire('move', ev);
					}
				}
			},
			
			init: function(mice)
			{
				if (this.keymap===null)
				{
					this.keymap = {};
					extend(this.keymap, this.MAP);
				}
				
				this.handler = {};
				this.mice = mice;
			},
			
			_keyup: function(ev)
			{
				
			},
		
			enable: function()
			{
				this.handler.keydown = bind(this._keydown, this);
				this.handler.keyup = bind(this._keyup, this);
				document.addEventListener('keydown', this.handler.keydown);
				document.addEventListener('keyup', this.handler.keyup);
			},
			
			disable: function(mice)
			{
				// Keyboard Events
				document.removeEventListener('keydown', this.handler.keydown);
				document.removeEventListener('keyup', this.handler.keyup);
			}
		}),
		
		joystick: module({
			
			enable: function(mice)
			{
				if (navigator.webkitGetGamepads)
				{
					
					
				}
			},
			
			disable: function(mice)
			{
				
			}
			
		})
	},
	
	Mice = function Mice(element, settings)
	{
		this.element = element;
		this.module = {};
		
		if (settings)
			extend(this, settings);
		
		for (var i in Module)
			if (this[i])
				this.enable(i);
	},
	
	mice = window.mice = function(element, eventmap)
	{
		return new Mice(element, eventmap);
	},
	
	extend = function(a, b) 
	{
		for (var i in b)
			a[i] = b[i];
	}
;

	Mice.Module = Module;

	extend(Mice.prototype, {/** @scope Mice.prototype */
		
		/// Cursor X position relative to element
		x: 0, 
		/// Cursor Y position relative to element
		y: 0,
		/// Change of X from previous event
		dx: 0, 
		/// Change of Y from previous event
		dy: 0,
		
		/// Enable Keyboard
		keyboard: true,
		/// Enable Mouse
		mouse: true,
		/// Enable touch
		touch: true,
		/// Enable joystick
		joystick: true,
		
		/// Element to attach events to
		element: null,
		
		/// Enable Module
		enable: function(module_name)
		{
		var
			module
		;
			if (module_name in this.module)
				return;
				
			module = new Module[module_name](this);
			this.module[module_name] = module;
			
			module.enable();
		},
		
		disable: function(module_name)
		{
			this.module[module_name].disable();
			delete(this.module[module_name]);
		},
		
		fire: function(event_name, event)
		{
			event.mice = this;
			event.name = event_name;
			
			if (this.on_fire)
				this.on_fire(event);
				
			if (this[event_name])
				return this[event_name](event);
		},
		
		set_pos: function(x, y)
		{
			this.dx = x - this.x;
			this.dy = y - this.y;
			
			this.x = x;
			this.y = y;
		},
		
		destroy: function()
		{
			for (var i in this.module)
				this.module[i].disable();				
		}
		
	});

})(this);