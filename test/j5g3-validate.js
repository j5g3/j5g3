

j5g3(function(j5g3) {

	function assertBox(assert, BB, x, y, w, h)
	{
		assert.equal(BB.x, x);
		assert.equal(BB.y, y);
		assert.equal(BB.r, w);
		assert.equal(BB.b, h);
	}

	module('j5g3-validate');

	test('j5g3.Validate.DisplayObject ignore', function(assert) {
	var
		A = new j5g3.DisplayObject(),
		BB = new j5g3.BoundingBox()
	;
		A.pos(100, 200).size(50, 75).scale(0, 1);
		A.validate(BB);

		assertBox(assert, BB, Infinity, Infinity, -Infinity, -Infinity);
	});

	test('j5g3.Validate.DisplayObject position', function(assert) {
	var
		A = new j5g3.DisplayObject(),
		BB = new j5g3.BoundingBox()
	;
		A.pos(100, 200).size(50, 75);
		A.validate(BB);
		assertBox(assert, BB, 100, 200, 150, 275);

		A.validate(BB.reset());
		assertBox(assert, BB, Infinity, Infinity, -Infinity, -Infinity);

		A.pos(100, 200).size(50, 75);
		A.validate(BB);
		assertBox(assert, BB, Infinity, Infinity, -Infinity, -Infinity);
	});

	test('j5g3.Validate.DisplayObject angle', function(assert) {
	var
		A = new j5g3.DisplayObject(),
		BB = new j5g3.BoundingBox()
	;
		A.pos(100, 200).size(50, 75);
		A.rotation = Math.PI;
		A.validate(BB);
		assert.ok(BB.x===50 || BB.x===49);
		assert.equal(BB.y, 125);
		assert.equal(BB.r, 100);
		assert.equal(BB.b, 200);

		A.rotation = 2 * Math.PI;
		A.validate(BB.reset());
		assert.ok(BB.x===50 || BB.x===49);
		assert.equal(BB.y, 125);
		assert.ok(BB.r === 150 || BB.r === 151);
		assert.equal(BB.b, 275);

		A.rotation = 0;
		A.validate(BB.reset());
		assert.equal(BB.x, 100);
		assert.equal(BB.y, 200);
		assert.ok(BB.r === 150 || BB.r === 151);
		assert.equal(BB.b, 275);


		assertBox(assert, A.box, 100, 200, 150, 275);
	});

	test('j5g3.Validate.DisplayObject dimension', function(assert) {
	var
		A = new j5g3.DisplayObject(),
		BB = new j5g3.BoundingBox()
	;
		A.pos(0, 100).size(50, 75);
		A.cx = 100; A.cy = 100;

		A.validate(BB.reset());
		assertBox(assert, BB, 100, 200, 150, 275);

		A.pos(100, 150);
		A.validate(BB.reset());
		assertBox(assert, BB, 100, 200, 250, 325);
	});

	test('j5g3.Validate.DisplayObject image', function(assert) {
	var
		A = new j5g3.DisplayObject(),
		BB = new j5g3.BoundingBox()
	;
		A.pos(100, 200).size(150, 125);
		A.validate(BB.reset());
		assertBox(assert, BB, 100, 200, 250, 325);

		A.alpha = 0.5;
		A.validate(BB.reset());
		assertBox(assert, BB, 100, 200, 250, 325);

		A.fill = '#eee';
		A.validate(BB.reset());
		assertBox(assert, BB, 100, 200, 250, 325);

		A.blending = 'erase';
		A.validate(BB.reset());
		assertBox(assert, BB, 100, 200, 250, 325);
	});

	test('j5g3.Validate.DisplayObject shape', function(assert) {
	var
		A = new j5g3.DisplayObject(),
		BB = new j5g3.BoundingBox()
	;
		A.pos(100, 200).size(150, 125);
		A.validate(BB.reset());

		A.line_cap = 0.5;
		A.validate(BB.reset());
		assertBox(assert, BB, 100, 200, 250, 325);

		A.line_join = '#eee';
		A.validate(BB.reset());
		assertBox(assert, BB, 100, 200, 250, 325);

		A.line_width  = 'erase';
		A.validate(BB.reset());
		assertBox(assert, BB, 100, 200, 250, 325);

		A.miter_limit  = 'erase';
		A.validate(BB.reset());
		assertBox(assert, BB, 100, 200, 250, 325);

		A.stroke = 'erase';
		A.validate(BB.reset());
		assertBox(assert, BB, 100, 200, 250, 325);
	});

	test('j5g3.Image#validate', function(assert)
	{
	var
		a = j5g3.image('img').pos(100, 200),
		BB = new j5g3.BoundingBox()
	;
		a.cx = -90;
		a.cy = -190;
		a.validate(BB);

		assertBox(assert, BB, 10, 10, 10+a.width, 10+a.height);
	});

test('j5g3.Validate.Clip - position', function(a) {
var
	A = j5g3.clip(),
	rect = j5g3.rect({ x: 10, y: 20, width: 30, height: 40 }),
	BB = new j5g3.BoundingBox()
;

	A.add(rect).validate(BB);
	compare(a, BB, { x: 10, y: 20, w: 30, h: 40, r: 40, b: 60 });

	rect.pos(20, 30);
	A.validate(BB.reset());
	compare(a, BB, { x: 10, y: 20, w: 40, h: 50, r: 50, b: 70 });

	A.validate(BB.reset());
	assertBox(a, rect.box, 20, 30, 50, 70);
	assertBox(a, BB, Infinity, Infinity, -Infinity, -Infinity);

	A.set({ cx: 50, cy: -100 }).validate(BB.reset());
	assertBox(a, A.box, 20, -70, 100, 70);

	rect.cx = -50; rect.cy = 100;
	A.validate(BB.reset());
	assertBox(a, BB, 20, -70, 100, 70);

	rect.cx = 50; rect.cy = -100;
	A.validate(BB.reset());
	compare(a, A.box, { x: 20, y: -170, w: 130, h: 240, r: 150, b: 70 });
	A.validate(BB.reset());
	assertBox(a, A.box, 20, -170, 150, 70);
	assertBox(a, BB, Infinity, Infinity, -Infinity, -Infinity);

});

test('j5g3.Validate.Clip - clip 1 level', function(a) {
var
	A = j5g3.rect(),
	B = j5g3.clip(),
	BB = new j5g3.BoundingBox()
;
	A.pos(10, 40).size(100, 20);
	B.add(A).validate(BB);
	assertBox(a, B.box, 10, 40, 110, 60);

	B.validate(BB.reset());
	assertBox(a, BB, Infinity, Infinity, -Infinity, -Infinity);

	B.pos(10, 20).validate(BB.reset());
	assertBox(a, A.box, 20, 60, 120, 80);
	assertBox(a, B.box, 10, 40, 120, 80);
	assertBox(a, BB, 10, 40, 120, 80);

	B.validate(BB.reset());
	assertBox(a, A.box, 20, 60, 120, 80);
	assertBox(a, B.box, 10, 40, 120, 80);
	assertBox(a, BB, Infinity, Infinity, -Infinity, -Infinity);
});

test('j5g3.Validate.Clip - container', function(a) {
var
	A = j5g3.clip(),
	B = j5g3.clip(),
	rect = j5g3.rect({ x: 10, y: 20, width: 30, height: 40 }),
	BB = new j5g3.BoundingBox()
;
	A.add(rect).pos(110, -190);
	B.add(A).validate(BB.reset());
	assertBox(a, A.box, 120, -170, 150, -130);

	B.pos(10, 20).validate(BB.reset());
	assertBox(a, B.box, 120, -170, 160, -110);
	assertBox(a, A.box, 120, -170, 160, -110);
	assertBox(a, BB, 120, -170, 160, -110);

	B.validate(BB.reset());
	assertBox(a, A.box, 120, -170, 160, -110);
});

test('j5g3.Validate.Clip - scale', function(a) {
var
	A = j5g3.clip(),
	B = j5g3.clip(),
	rect = j5g3.rect({ x: 10, y: 20, width: 30, height: 40 }),
	BB = new j5g3.BoundingBox()
;
	A.add(rect).pos(110, -190);
	B.add(A).pos(10, 20).scale(0.5, 1).validate(BB.reset());
	assertBox(a, BB, 130, -150, 145, -110);
});

test('j5g3.Stage#validate', function(assert)
{
var
	a = j5g3.image('img').pos(10, 10).stretch(100, 100),
	b = j5g3.image('soccer').pos(70, 50).stretch(50, 50),
	stage = new j5g3.Stage({ width: 300, height: 600 })
;
	stage.add([a, b]).validate();
	compare(assert, stage.dbox, { x: 10, y: 10, w: 110, h: 100 });
	a.alpha = 0.5;
	stage.validate();
	compare(assert, stage.dbox, { x: 10, y: 10, w: 110, h: 100 });

	b.pos(80, 60);
	stage.validate();
	compare(assert, stage.dbox, { x: 10, y: 10, w: 120, h: 100 });

	a.pos(80, 60);
	stage.validate();
	compare(assert, stage.dbox, { x: 10, y: 10, w: 170, h: 150 });

	b.alpha = 0.8;
	stage.validate();
	compare(assert, stage.dbox, { x: 10, y: 10, w: 170, h: 150 });

	a.alpha = 0.9;
	stage.validate();
	compare(assert, stage.dbox, { x: 80, y: 60, w: 100, h: 100 });

	b.alpha = 0.9;
	stage.validate();
	compare(assert, stage.dbox, { x: 80, y: 60, w: 100, h: 100 });

	b.alpha = 0.2;
	stage.validate();
	compare(assert, stage.dbox, { x: 80, y: 60, w: 50, h: 50 });

	stage.validate();
	compare(assert, stage.dbox, { w: 0, h: 0 });
});

test('j5g3.Validate.Circle', function(a) {

var
	A = j5g3.circle({ x: 5, y: 7, radius: 10 }),
	B = j5g3.circle(20),
	BB = new j5g3.BoundingBox()
;
	A.validate(BB);
	compare(a, BB, { x: 5, y: 7, w: 20, h: 20 });

	B.validate(BB);
	compare(a, BB, { x: 0, y: 0, w: 40, h: 40 });
});

test('j5g3.Validate.Map', function(a) {
var
	map = [ [0, 1], [2], [3, 4, 5]],
	ss = j5g3.spritesheet('img').grid(3, 3),
	A = j5g3.map({
		sprites: ss.sprites(), map: map,
		tw: 50, th: 80
	}),
	BB = new j5g3.BoundingBox(),
	sw = A.sprites[0].width,
	sh = A.sprites[1].height
;
	A.validate(BB);
	compare(a, BB, { x: 0, y: 0, w: sw*3, h: sh*3 });
});

});