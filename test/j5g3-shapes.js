
module('j5g3-shapes');

test('j5g3.Shape', function(a) {
var
	A = new j5g3.Shape({ fill: '#fff' })
;

	a.ok(A.fill);
});

test('j5g3.Rect', function(a) {
var
	A = j5g3.rect({ x: 10, y: 20, width: 30, height: 40 }),
	BB = new j5g3.BoundingBox()
;
	A.validate(BB);
	compare(a, BB, { x: 10, y: 20, w: 30, h: 40, r: 40, b: 60 });

	A.set({ cx: 10, cy: -20 }).validate(BB);
	compare(a, BB, { x: 10, y: 0, r: 50, b: 60, w: 40, h: 60 });
	A.validate(BB.reset());
	compare(a, A.box, { x: 20, y: 0, r: 50, b: 40, w: 30, h: 40 });
	compare(a, BB, { x: Infinity, y: Infinity, b: -Infinity, r: -Infinity });

});

test('j5g3.Polygon', function(a) {
var
	A = j5g3.Polygon.create(5, { radius: 10 }),
	B = new j5g3.Polygon({ normals: [] })
;
	a.ok(A.points);
	a.ok(B.points);
});

test('j5g3.Dot', function(a) {
var
	A = j5g3.dot(5),
	B = j5g3.dot({ line_width: 10 })
;
	a.equal(A.line_width, 5);
	a.equal(B.line_width, 10);
});

test('j5g3.Circle', function(a) {
var
	A = j5g3.circle(10)
;
	a.equal(A.radius, 10);
});

test('j5g3.Line', function(a) {
var
	A = j5g3.line({ x: 0, y: 10, width: 100, height: 20 })
;
	a.ok(A);
});