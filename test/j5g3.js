
function compare(a, A, B)
{
	for (var i in B)
		a.strictEqual(A[i], B[i]);
}


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

test('j5g3.Stage#scale', function(a)
{
var
	A = j5g3.rect().pos(10, 10).size(100, 100),
	s = new j5g3.Stage({ height: Infinity, width: Infinity})
;
	s.add(A).scale(0.5, 1)
		.set({ cx: 50, cy: 100 })
		.validate()
	;

	compare(a, s.box, { x: 35, y: 110, w: 50, h: 100 });
	s.set({ sx: 1, sy: 1, cx: 0, cy: 0 }).validate();
	compare(a, s.dbox, { x: 10, y: 10, w: 100, h: 200 });
});
