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
			fn = Klass[fn_name]
		;
			Klass[fn_name] = function()
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
			Klass[fn_name].old = fn;
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

	dbg.fn(j5g3.DisplayObject.prototype, 'remove', function()
	{
		if (this.parent === null)
			console.warn("Trying to remove object without parent.", this);
	});

	dbg.fn(j5g3.DisplayObject.prototype, 'stretch', function()
	{
		if (!this.width || !this.height)
			dbg.error("Objects without width or height cannot be stretched.");
	});

	dbg.fn(j5g3.Clip.prototype, 'add_object', function(display_object)
	{
		if (display_object.parent)
			console.warn('Trying to add DisplayObject without removing first.', display_object);
	});

	dbg.fn(j5g3.Clip.prototype, 'go', function(frame) {
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
		bar = me.toolbar = p.toolbar
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

	var DirtyBox = j5g3.Rect.extend({

		fill: '#66e',
		stroke: false,
		alpha: 0.5,

		validate: function(bb)
		{
			this.x = bb.x; this.y = bb.y;
			this.width = bb.w; this.height = bb.h;
			j5g3.DisplayObject.prototype.validate.call(this, bb, true);
		}

	});

	function LayersTab(p)
	{
		Tab.call(this, p);
	var
		me = this,
		engine = me.toolbar.engine,
		html = ''
	;
		engine.layers.forEach(function(layer, i) {
			html += '<fieldset><legend>Layer ' + i +
				(layer.background ? ' (Background)' : '') +
				'</legend><p><label><input type="checkbox" value="' + i + '"/>' +
				' Show Dirty Box</label></p>' +
				'</fieldset>';
		});

		me.$section.html(html);
		me.$section.find('input[type="checkbox"]').change(function() {
		var
			i = this.value,
			layer = engine.layers[i]
		;
			if (!layer.__dbg_dbox)
				layer.add(layer.__dbg_dbox = new DirtyBox({ fill: me.colors[i] }));
			else
			{
				layer.__dbg_dbox.remove();
				layer.__dbg_dbox = null;
			}
		});
	}

	LayersTab.prototype = {

		colors: [ '#99e', '#9e9', '#e99' ]

	};

	function Toolbar(engine)
	{
	var
		r = this.$el = $('<div class="j5g3-dbg-toolbar">'),
		content = $('body').children(':not(script)')
	;
		this.engine = engine;
		this.tabs = {
			game: new Tab({ toolbar: this, label: 'Game' }),
			cache: new Tab({ toolbar: this, label: 'Cache' }),
			layers: new LayersTab({ toolbar: this, label: 'Layers' })
		};

		this.tabs.game.$section.append(content);
		this.tabs.cache.$section.append($('#j5g3-cache').show());

		$body.append(r);
		window.dispatchEvent(new window.Event('resize'));
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

	dbg.attachToolbar = function(engine)
	{
		if (!$)
			return console.error('[j5g3-dbg] attachToolbar requires jQuery.');

		$body = $(window.document.body);
		$body.addClass('j5g3-dbg');

		new Toolbar(engine);
	};


})(this, this.j5g3);

