
j5g3.ready(function() {

	j5g3.engine(function(j5g3) {

	module('j5g3.Class');
	test('Core', function() {
	var
		Base = j5g3.Class.extend({
			init: function(a)
			{
				this.extend(a);// document.write(this.className+':'+a+"\n");
			},
			method2: function() { return 'Base'; }
		}, { className: 'Base' }),

		Child = Base.extend({
			init: function Child(n)
			{
				Base.apply(this, [ { a: n } ]);
			},
			method: function() {
				return 1;
			},
			prop: "Hello World"
		}, { className: 'Child' }),

		Child2 = Child.extend({
			method: function() {
				return Child.prototype.method.apply(this) + 1;
			},
			prop: 'Radiohead'
		}, { className: 'Child2' }),

		Child3 = Child2.extend({
			init: function(x)
			{
				Child2.apply(this, [x]);
				this.x = x;
			},
			method2: function() {
				return Child2.prototype.method2.apply(this);
			},

			method: function() {
				return Child2.prototype.method.apply(this) + 1;
			}
		}),

		b = new Base({ a: 1 }),
		c = new Child(2),
		d = new Child(3),
		e = new Child2(4),
		f = new Child3(5)
	;
		ok(Child.name === 'Child');
		ok(Base.className === 'Base');
		ok(Child2.className === 'Child2');
		ok(b.init.className === 'Base');
		ok(c.prop === 'Hello World');
		ok(e.prop === 'Radiohead');
		ok(c.method() == 1 && d.method() == 1);
		ok(e.method() == 2);
		equal(f.method(), 3);
		ok(b.a == 1);
		ok(c.a === 2);
		ok(d.a === 3);
		ok(e.a === 4);
		ok(f.a === 5 && f.x === f.a);

	});

	test('DOM', function()
	{
	var
		e = j5g3.dom('DIV')
	;
		equal(e.tagName, 'DIV');
	});

	module('j5g3');

		test('Class Constructor', function()
		{
		var
			img = j5g3.id('img'),
			I = new j5g3.DisplayObject({ source: img })
		;

			equal(I.source, img);
		});

		test('Class Properties', function()
		{
		var
			a = new j5g3.DisplayObject(),
			b = new j5g3.DisplayObject({ source: 'img' }),
			c = b.set({x: 5})
		;
			a.extend({ x: 10 });
			b.set({ x: 10 });

			equal(c, b);
			equal(a.source, undefined);
			ok(b.source);
			equal(a.x, 10);
			equal(b.x, 10);
		});

		test('Image Constructor', function()
		{
		var
			src = 'img',
			img = j5g3.id(src),
			a = new j5g3.Image(src),
			b = j5g3.image(src),
			c = j5g3.image(img),
			d = j5g3.image({ source: src })
		;
			ok(a.source.src.indexOf('earth')>=0);
			equal(b.source, a.source);
			equal(c.source, d.source);
			equal(c.width, 266);
			equal(c.height, 269);

			d.set_source(src);
			equal(d.source, c.source);
		});

		test('Image Drawing', function()
		{
		var
			a = j5g3.image('img')
		;
			ok(a);
		});

		test('Clip Construction', function()
		{
		var
			a = j5g3.clip()
		;
			ok(a);
			ok(a.frame);
		});

		test('Clip - Adding Objects', function()
		{
		var
			a = j5g3.clip(),
			aa = j5g3.image('img'),
			ab = j5g3.image('img'),
			ac = j5g3.image('img'),
			frame = a.frame
		;

			a.add([ aa, ab, ac ]);

			ok(frame);
			strictEqual(frame._next, aa);
			strictEqual(frame._previous, ac);
			strictEqual(aa._next, ab);
			strictEqual(ab._next, ac);
			strictEqual(ac._next, frame);

			a.add_frame([ aa, ab, ac ]);
			frame = a.frame;

			strictEqual(frame._next, aa);
			strictEqual(frame._previous, ac);
			strictEqual(aa._next, ab);
			strictEqual(aa._previous, frame);
			strictEqual(ab._next, ac);
			strictEqual(ab._previous, aa);
			strictEqual(ac._next, frame);
			strictEqual(ac._previous, ab);
		});

		test('Clip - Removing Objects', function()
		{
		var
			a = j5g3.clip(),
			aa = j5g3.image('img'),
			ab = j5g3.image('img'),
			ac = j5g3.image('img'),
			frame = a.frame
		;
			a.add([aa, ab, ac]);
			ab.remove();

			equal(frame._next, aa);
			equal(aa._next, ac);
			equal(aa._previous, frame);
			equal(ac._next, frame);
			equal(ac._previous, aa);

			ac.remove();
			equal(frame._next, aa);
			equal(frame._previous, aa);
			equal(aa._next, frame);
			equal(aa._previous, frame);

			aa.remove();
			equal(frame._next, frame);
			equal(frame._previous, frame);
		});

		test('Clip - Adding Frames', function()
		{
		var
			c = j5g3.clip(),
			img = j5g3.image('img'),
			frame, frame2 = c.frame
		;
			c.add_frame();
			frame = c.frame;

			strictEqual(frame._next, frame);
			strictEqual(frame._previous, frame);

			c.update();
			strictEqual(c.frame, frame2);
			ok(frame !== frame2);

			c.add_frame(img);
			frame = c.frame;
			strictEqual(frame._next, img);
			strictEqual(img._next, frame);
		});

		test('Text Construction', function()
		{
		var
			t = j5g3.text(),
			t2= j5g3.text('Hello World')
		;
			ok(t);
			equal(t2.text, 'Hello World');

			//t.paint();
			//t2.paint();
			//equal(t.get_width(), 0);
			//ok(t2.get_width());
		});


		test('Tween Construction', function()
		{
		var
			img = j5g3.image('img'),
			t = j5g3.tween(),
			t2= j5g3.tween(img)
		;
			strictEqual(t2.target, img);
			strictEqual(t.t, 0);
			t.pause();
			t.resume();
			t.rewind();
			t.pause();
			t.restart();
			t.stop();
		});

		test('Spritesheet Constructor', function()
		{
		var
			img=j5g3.image('soccer'),
			s = j5g3.spritesheet('soccer'),
			s2= j5g3.spritesheet(img)
		;

			equal(s.sprites.length, 0);
			strictEqual(s2.source, img);
			strictEqual(s.source.source, img.source);
		});

		test('Spritesheet - Adding Sprites', function()
		{
		var
			s = j5g3.spritesheet('soccer'),
			s2= j5g3.spritesheet('soccer')
		;
			s.grid(5, 5);
			equal(s._sprites.length, 25);

			s2.cut(0,0,10,10);
			equal(s2._sprites.length, 1);
			s2.cut(0,0,10,10);
			equal(s2._sprites.length, 2);
			s2.push(0,0,10,10);
			equal(s2._sprites.length, 3);

		});

		test('Spritesheet - Clipping', function()
		{
		var
			s = j5g3.spritesheet('soccer').grid(5, 5),
			a = s.clip([0, 1, 2])
		;
			equal(a._frames.length, 3);
		});

		test('Collision', function()
		{
		var
			a, b,
			do_test = function(A, B) {
				a = j5g3.rect({ fill: 'red', width: 100, height: 50 }).set(A),
				b = j5g3.rect({ fill: 'green', width: 50, height: 30 }).set(B),
				ok(a.collides(b));
			}
		;
			do_test({ x: 20, y: 20 }, { x: 100, y: 30 });
			do_test({ x: 20, y: 100 }, { x:120, y:110 });
			do_test({ x: 20, y: 340, sx: 0.5 }, { x: 100, y: 350 });
			do_test({ x: 20, y: 420 }, { x: 100, y: 430, sx: 0.5 });

			do_test({ x: 320, y: 20 }, { x: 400, y: 30, sx: -2 });
			do_test({ x: 320, y: 100, sx: 0.3 }, { x: 400, y: 110, sx: -1 });
			do_test({ x: 320, y: 180, sx: 0.5 }, { x: 400, y: 190, sx: -0.5 });
		});

	});
});
