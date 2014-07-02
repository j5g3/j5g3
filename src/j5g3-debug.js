/*
 * Debug Module for j5g3
 */

(function(window, j5g3, undefined)
{
var
	// jQUery is required only if using the debug toolbar.
	$ = window.jQuery,
	$body,

	dbg =

	/**
	 * Debug Module for j5g3
	 * @namespace
	 */
	j5g3.dbg = {

		error: function(msg)
		{
			throw new Error(msg);
		},

		fn: function(Klass, fn_name, pre, post)
		{
		var
			fn = Klass.prototype[fn_name]
		;
			Klass.prototype[fn_name] = function()
			{
			var
				args = arguments,
				result
			;
				if (pre) pre.apply(this, args);
				result = fn.apply(this, args);
				if (post) post.apply(this, args);

				return result;
			};
		}
	},

	console = window.console,

	/** List of methods that can be overriden, by default all methods starting with
	 * "on_" will be allowed.
	 */
	allow_override = [
		j5g3.Tween.prototype.easing,
		j5g3.Emitter.prototype.source
	]
;
	allow_override.forEach(function(fn) {
		fn.__allow_override = true;
	});

	j5g3.Class.prototype.toString = j5g3.Class.prototype.valueOf = function()
	{
		return this.init.name;
	};

	dbg.fn(j5g3.DisplayObject, 'remove', function()
	{
		if (this.parent === null)
			console.warn("Trying to remove object without parent.", this);
	});

	dbg.fn(j5g3.DisplayObject, 'stretch', function()
	{
		if (!this.width || !this.height)
			dbg.error("Objects without width or height cannot be stretched.");
	});

	dbg.fn(j5g3.Clip, 'add_object', function(display_object)
	{
		if (display_object.parent)
			console.warn('Trying to add DisplayObject without removing first.', display_object);
	});

	dbg.fn(j5g3.Clip, 'go', function(frame) {
		if (frame < 0 || frame > this._frames.length)
			console.warn('Invalid frame number: ' + frame, this);
	});

	j5g3.id = function(id) {
		var result = window.document.getElementById(id);
		if (!result)
			console.warn('Could not find element with ID: ' + id);

		return result;
	};

	j5g3.DisplayObject.prototype.extend = function(props)
	{
		for (var i in props)
		{
			if ((typeof this[i] === 'function') &&
				!(this[i].__allow_override || i.indexOf('on_')===0))
			{
				console.warn('Overriding function ' + i, this);
			}

			if (i[0]==='_')
				console.warn('Overriding private member ' + i, this);

			this[i] = props[i];
		}
	};

	j5g3.Image.prototype._get_source = function(src)
	{
		var source = (typeof(src)==='string') ? j5g3.id(src) : src;

		if (source===null)
			dbg.error("Could not load Image '" + src + "'");

		return source;
	};

	function Tab(p)
	{
	var
		me = this,
		tab = me.$tab = $('<a href="#">'),
		section = me.$section = $('<section>'),
		bar = p.toolbar
	;
		tab.html(p.label)
			.click(function(ev) {
				bar.setActive(me);
				if (p.onclick) p.onclick(ev);
				ev.preventDefault();
			})
		;

		$body.append(section);
		bar.$el.append(tab);

		if (!bar.active)
			bar.setActive(me);
	}

	function Toolbar()
	{
	var
		r = this.$el = $('<div class="j5g3-dbg-toolbar">')
	;
		this.tabs = {
			game: new Tab({ toolbar: this, label: 'Game' }),
			cache: new Tab({ toolbar: this, label: 'Cache' })
		};

		this.tabs.game.$section.append($('canvas'));
		this.tabs.cache.$section.append($('#j5g3-cache').show());

		$body.append(r);
	}

	Toolbar.prototype = {

		setActive: function(tab)
		{
			if (this.active)
			{
				this.active.$tab.removeClass('active');
				this.active.$section.removeClass('active');
			}

			tab.$tab.addClass('active');
			tab.$section.addClass('active');
			this.active = tab;
		}

	};

	dbg.attachToolbar = function()
	{
		if (!$)
			return console.error('[j5g3-dbg] attachToolbar requires jQuery.');

		$body = $(window.document.body);
		$body.addClass('j5g3-dbg');

		new Toolbar();
	};


})(this, this.j5g3);

