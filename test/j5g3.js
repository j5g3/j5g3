

j5g3(function(j5g3, engine) {

	module('j5g3');

	test('Image', function(assert)
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

	test('Image#validate', function(assert)
	{
	var
		stage = engine.stage,
		a = j5g3.image('img').pos(100, 200)
	;
		a.cx = -90;
		a.cy = -190;
		assert.ok(a);
		stage.add(a).validate();
		assert.equal(stage.dbox.x, 10);
		assert.equal(stage.dbox.y, 10);
		assert.equal(stage.dbox.w, a.width);
		assert.equal(stage.dbox.h, a.height);
		a.remove();
	});

	test('Clip', function(assert)
	{
	var
		a = j5g3.clip()
	;
		assert.ok(a);
		assert.ok(a.frame);
	});

	test('Clip#add', function(assert)
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

	});

	test('Clip#add_frame', function (assert)
	{
	var
		a = j5g3.clip(),
		aa = j5g3.image('img'),
		ab = j5g3.image('img'),
		ac = j5g3.image('img'),
		c = j5g3.clip(),
		img = j5g3.image('img'),
		frame, frame2 = c.frame
	;
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

	test('Clip#remove', function(assert)
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

	test('Clip#validate', function(a) {
	var
		A = j5g3.clip(),
		B = j5g3.clip(),
		rect = j5g3.rect({ x: 10, y: 20, width: 30, height: 40 }),
		BB = new j5g3.BoundingBox()
	;

	A.add(rect).validate(BB);
	compare(a, BB, { x: 10, y: 20, w: 30, h: 40, r: 40, b: 60 });
	rect.pos(20, 30);
	A.validate(BB.reset());
	compare(a, BB, { x: 10, y: 20, w: 40, h: 50, r: 50, b: 70 });
	A.dirty = false; rect.dirty = true;
	A.validate(BB.reset());
	compare(a, A.box, { x: 20, y: 30, w: 30, h: 40, r: 50, b: 70 });
	A.dirty = rect.dirty = false;
	A.validate(BB.reset());
	compare(a, BB, { x: Infinity, y: Infinity, w: 0, h: 0, r: -Infinity, b: -Infinity });

	A.set({ cx: 50, cy: -100 }).validate(BB.reset());
	rect.invalidate();
	A.validate(BB.reset());
	compare(a, A.box, { x: 70, y: -70, w: 30, h: 40, r: 100, b: -30 });

	rect.cx = -50; rect.cy = 100;
	rect.invalidate();
	A.validate(BB.reset());
	A.validate(BB.reset());
	compare(a, A.box, { x: 20, y: 30, w: 30, h: 40, r: 50, b: 70 });

	rect.cx = 50; rect.cy = -100;
	rect.invalidate();
	A.validate(BB.reset());
	compare(a, A.box, { x: 20, y: -170, w: 130, h: 240, r: 150, b: 70 });
	rect.invalidate();
	A.validate(BB.reset());
	compare(a, A.box, { x: 120, y: -170, w: 30, h: 40, r: 150, b: -130 });

	B.add(A).validate(BB.reset());
	compare(a, A.box, { x: 120, y: -170, w: 30, h: 40, r: 150, b: -130 });
	B.pos(10, 20).validate(BB.reset());
	compare(a, A.box, { x: 120, y: -170, w: 40, h: 60, r: 160, b: -110 });

	B.invalidate().validate(BB.reset());
	compare(a, A.box, { x: 130, y: -150, w: 30, h: 40, r: 160, b: -110 });

	B.scale(0.5, 1).validate(BB.reset());
	B.validate(BB.reset());
	compare(a, A.box, { x: 80, y: -150, w: 15, h: 40, r: 95, b: -110 });

	});

	test('Text', function(assert)
	{
	var
		t = j5g3.text(),
		t2= j5g3.text('Hello World')
	;
		assert.ok(t);
		assert.equal(t2.text, 'Hello World');
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

	test('Spritesheet', function(assert)
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

	test('Spritesheet#clip', function(assert)
	{
	var
		s = j5g3.spritesheet('soccer').grid(5, 5),
		a = s.clip([0, 1, 2])
	;
		assert.equal(a._frames.length, 3);
	});

	test('Stage#scale', function(a)
	{
	var
		A = j5g3.image('img').pos(10, 10).stretch(100, 100),
		s = engine.stage
	;
		s.box.reset();
		s.add(A).scale(0.5, 1).set({ cx: 50, cy: 100 });
		s.dbox.reset();
		s.validate();
		compare(a, s.dbox, { x: 30, y: 110, w: 50, h: 100 });

		s.set({ sx: 1, sy: 1, cx: 0, cy: 0 });
		A.remove();
	});

	test('Stage#validate', function(assert)
	{
	var
		a = j5g3.image('img').pos(10, 10).stretch(100, 100),
		b = j5g3.image('soccer').pos(70, 50).stretch(50, 50),
		stage = engine.stage,
		dbox = stage.dbox
	;
		stage.box.reset();
		stage.add([a, b]).invalidate().validate();
		compare(assert, dbox, { x: 10, y: 10, w: 110, h: 100 });
		stage.render();

		stage.box.reset();
		b.invalidate();
		stage.validate();
		compare(assert, dbox, { x: 70, y: 50, w: 50, h: 50 });

		a.remove(); b.remove();
	});

});
