

j5g3(function(j5g3, engine) {

	module('j5g3');

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

		d.source = src;
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
		a = j5g3.image('img').pos(10, 10).stretch(100, 100),
		b = j5g3.image('soccer').pos(70, 50).stretch(50, 50),
		stage = engine.stage,
		dbox = stage.dbox
	;
		stage.add([a, b]);
		assert.equal(dbox.w, undefined);
		assert.equal(dbox.h, undefined);
		stage.validate();
		assert.strictEqual(dbox.x, 10);
		assert.strictEqual(dbox.y, 10);
		assert.strictEqual(dbox.w, 110);
		assert.strictEqual(dbox.h, 100);
		stage.render();

		b.invalidate();
		stage.validate();
		b.invalidate();
		stage.validate();

		assert.strictEqual(dbox.x, 70);
		assert.strictEqual(dbox.y, 50);
		assert.strictEqual(dbox.w, 50);
		assert.strictEqual(dbox.h, 50);

		a.remove(); b.remove();
	});

});
