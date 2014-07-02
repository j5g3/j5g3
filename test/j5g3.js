
j5g3.ready(function() {

	j5g3.engine(function(j5g3, engine) {

	module('j5g3.Class');
	test('Core', function(assert) {
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
		assert.ok(Child.name === 'Child');
		assert.ok(Base.className === 'Base');
		assert.ok(Child2.className === 'Child2');
		assert.ok(b.init.className === 'Base');
		assert.ok(c.prop === 'Hello World');
		assert.ok(e.prop === 'Radiohead');
		assert.ok(c.method() == 1 && d.method() == 1);
		assert.ok(e.method() == 2);
		assert.equal(f.method(), 3);
		assert.ok(b.a == 1);
		assert.ok(c.a === 2);
		assert.ok(d.a === 3);
		assert.ok(e.a === 4);
		assert.ok(f.a === 5 && f.x === f.a);
	});

	test('DOM', function(assert)
	{
	var
		e = j5g3.dom('DIV')
	;
		assert.equal(e.tagName, 'DIV');
	});

	module('j5g3');

		test('Class Constructor', function(assert)
		{
		var
			img = j5g3.id('img'),
			I = new j5g3.DisplayObject({ source: img })
		;

			assert.equal(I.source, img);
		});

		test('Class Properties', function(assert)
		{
		var
			a = new j5g3.DisplayObject(),
			b = new j5g3.DisplayObject({ source: 'img' }),
			c = b.set({x: 5})
		;
			a.extend({ x: 10 });
			b.set({ x: 10 });

			assert.equal(c, b);
			assert.equal(a.source, undefined);
			assert.ok(b.source);
			assert.equal(a.x, 10);
			assert.equal(b.x, 10);
		});

		test('Image Constructor', function(assert)
		{
		var
			src = 'img',
			img = j5g3.id(src),
			a = new j5g3.Image(src),
			b = j5g3.image(src),
			c = j5g3.image(img),
			d = j5g3.image({ source: src })
		;
			assert.ok(a.source.src.indexOf('earth')>=0);
			assert.equal(b.source, a.source);
			assert.equal(c.source, d.source);
			assert.equal(c.width, 266);
			assert.equal(c.height, 269);

			d.set_source(src);
			assert.equal(d.source, c.source);
		});

		test('Image Drawing', function(assert)
		{
		var
			a = j5g3.image('img')
		;
			assert.ok(a);
		});

		test('Clip Construction', function(assert)
		{
		var
			a = j5g3.clip()
		;
			assert.ok(a);
			assert.ok(a.frame);
		});

		test('Clip - Adding Objects', function(assert)
		{
		var
			a = j5g3.clip(),
			aa = j5g3.image('img'),
			ab = j5g3.image('img'),
			ac = j5g3.image('img'),
			frame = a.frame
		;

			a.add([ aa, ab, ac ]);

			assert.ok(frame);
			assert.strictEqual(frame._next, aa);
			assert.strictEqual(frame._previous, ac);
			assert.strictEqual(aa._next, ab);
			assert.strictEqual(ab._next, ac);
			assert.strictEqual(ac._next, frame);

			a.add_frame([ aa, ab, ac ]);
			frame = a.frame;

			assert.strictEqual(frame._next, aa);
			assert.strictEqual(frame._previous, ac);
			assert.strictEqual(aa._next, ab);
			assert.strictEqual(aa._previous, frame);
			assert.strictEqual(ab._next, ac);
			assert.strictEqual(ab._previous, aa);
			assert.strictEqual(ac._next, frame);
			assert.strictEqual(ac._previous, ab);
		});

		test('Clip - Removing Objects', function(assert)
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

			assert.equal(frame._next, aa);
			assert.equal(aa._next, ac);
			assert.equal(aa._previous, frame);
			assert.equal(ac._next, frame);
			assert.equal(ac._previous, aa);

			ac.remove();
			assert.equal(frame._next, aa);
			assert.equal(frame._previous, aa);
			assert.equal(aa._next, frame);
			assert.equal(aa._previous, frame);

			aa.remove();
			assert.equal(frame._next, frame);
			assert.equal(frame._previous, frame);
		});

		test('Clip - Adding Frames', function(assert)
		{
		var
			c = j5g3.clip(),
			img = j5g3.image('img'),
			frame, frame2 = c.frame
		;
			c.add_frame();
			frame = c.frame;

			assert.strictEqual(frame._next, frame);
			assert.strictEqual(frame._previous, frame);

			c.update();
			assert.strictEqual(c.frame, frame2);
			assert.ok(frame !== frame2);

			c.add_frame(img);
			frame = c.frame;
			assert.strictEqual(frame._next, img);
			assert.strictEqual(img._next, frame);
		});

		test('Text Construction', function(assert)
		{
		var
			t = j5g3.text(),
			t2= j5g3.text('Hello World')
		;
			assert.ok(t);
			assert.equal(t2.text, 'Hello World');

			//t.paint();
			//t2.paint();
			//equal(t.get_width(), 0);
			//ok(t2.get_width());
		});


		test('Tween Construction', function(assert)
		{
		var
			img = j5g3.image('img'),
			t = j5g3.tween(),
			t2= j5g3.tween(img)
		;
			assert.strictEqual(t2.target, img);
			assert.strictEqual(t.t, 0);
			t.pause();
			t.resume();
			t.rewind();
			t.pause();
			t.restart();
			t.stop();
		});

		test('Spritesheet Constructor', function(assert)
		{
		var
			img=j5g3.image('soccer'),
			s = j5g3.spritesheet('soccer'),
			s2= j5g3.spritesheet(img)
		;

			assert.equal(s.sprites.length, 0);
			assert.strictEqual(s2.source, img);
			assert.strictEqual(s.source.source, img.source);
		});

		test('Spritesheet - Adding Sprites', function(assert)
		{
		var
			s = j5g3.spritesheet('soccer'),
			s2= j5g3.spritesheet('soccer')
		;
			s.grid(5, 5);
			assert.equal(s._sprites.length, 25);

			s2.cut(0,0,10,10);
			assert.equal(s2._sprites.length, 1);
			s2.cut(0,0,10,10);
			assert.equal(s2._sprites.length, 2);
			s2.push(0,0,10,10);
			assert.equal(s2._sprites.length, 3);

		});

		test('Spritesheet - Clipping', function(assert)
		{
		var
			s = j5g3.spritesheet('soccer').grid(5, 5),
			a = s.clip([0, 1, 2])
		;
			assert.equal(a._frames.length, 3);
		});

		test('Collision', function(assert)
		{
		var
			a, b,
			do_test = function(A, B) {
				a = j5g3.rect({ fill: 'red', width: 100, height: 50 }).set(A),
				b = j5g3.rect({ fill: 'green', width: 50, height: 30 }).set(B),
				assert.ok(a.collides(b));
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

		test('Invalidate', function(assert)
		{
		var
			a = j5g3.clip({ x: 10, y: 10, width: 5, height: 5 }),
			b = j5g3.clip({ x: 30, y: 30, width: 10, height: 15 }),
			stage = engine.stage.layer()
		;
			stage.add([a, b]);
			stage.draw();
			assert.equal(stage._dw, 0);
			assert.equal(stage._dh, 0);
			a.invalidate();

			assert.strictEqual(stage._dx, 10);
			assert.strictEqual(stage._dy, 10);
			assert.strictEqual(stage._dw, 5);
			assert.strictEqual(stage._dh, 5);

			b.invalidate();

			assert.strictEqual(stage._dx, 10);
			assert.strictEqual(stage._dy, 10);
			assert.strictEqual(stage._dw, 30);
			assert.strictEqual(stage._dh, 35);

			a.remove(); b.remove();
		});

	});
});
