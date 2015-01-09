

j5g3(function(j5g3, engine) {

	module('j5g3-validate');

	test('DisplayObject#is_dirty', function(a) {
	var
		A = new j5g3.DisplayObject()
	;
		a.ok(A.dirty);
		a.ok(A.is_dirty());
		A.commit();
		a.ok(!A.is_dirty());
		A.commit();
		A.x = 10;
		a.ok(A.is_dirty());
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
	A.validate(BB.reset());
	compare(a, A.box, { x: 20, y: 30, w: 30, h: 40, r: 50, b: 70 });
	A.validate(BB.reset());
	compare(a, BB, { x: Infinity, y: Infinity, w: 0, h: 0, r: -Infinity, b: -Infinity });

	A.set({ cx: 50, cy: -100 }).validate(BB.reset());
	A.validate(BB.reset());
	compare(a, A.box, { x: 70, y: -70, w: 30, h: 40, r: 100, b: -30 });

	rect.cx = -50; rect.cy = 100;
	A.validate(BB.reset());
	A.validate(BB.reset());
	compare(a, A.box, { x: 20, y: 30, w: 30, h: 40, r: 50, b: 70 });

	rect.cx = 50; rect.cy = -100;
	A.validate(BB.reset());
	compare(a, A.box, { x: 20, y: -170, w: 130, h: 240, r: 150, b: 70 });
	A.validate(BB.reset());
	compare(a, A.box, { x: 120, y: -170, w: 30, h: 40, r: 150, b: -130 });

	B.add(A).validate(BB.reset());
	compare(a, A.box, { x: 120, y: -170, w: 30, h: 40, r: 150, b: -130 });
	B.pos(10, 20).validate(BB.reset());
	compare(a, A.box, { x: 120, y: -170, w: 40, h: 60, r: 160, b: -110 });

	B.validate(BB.reset());
	compare(a, A.box, { x: 130, y: -150, w: 30, h: 40, r: 160, b: -110 });

	B.scale(0.5, 1).validate(BB.reset());
	B.validate(BB.reset());
	compare(a, A.box, { x: 80, y: -150, w: 15, h: 40, r: 95, b: -110 });

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
		stage.add([a, b]).validate();
		compare(assert, dbox, { x: 10, y: 10, w: 110, h: 100 });
		stage.render();

		stage.box.reset();
		stage.validate();
		compare(assert, dbox, { x: 70, y: 50, w: 50, h: 50 });

		a.remove(); b.remove();
	});

});