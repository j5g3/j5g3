
(function() {

module('j5g3-matrix');

var
	tmp,
	svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),

	svgM = function(a, b, c, d, e, f)
	{
		tmp = svg.createSVGMatrix();
		tmp.a = a; tmp.b = b; tmp.c = c; tmp.d = d; tmp.e = e; tmp.f = f;
		return tmp;
	},

	m = j5g3.matrix(),
	m2 = svg.createSVGMatrix(),
	m3, m4,

	initM = function(a, b, c, d, e, f)
	{
		m = j5g3.matrix().multiply(a,b,c,d,e,f);
		m2 = svgM(a, b, c, d, e, f);
	},

	compareM = function(a, m, m2)
	{
		a.equal(m.a, m2.a);
		a.equal(m.b, m2.b);
		a.equal(m.c, m2.c);
		a.equal(m.d, m2.d);
		a.equal(m.e, m2.e);
		a.equal(m.f, m2.f);
	}
;

test('Matrix', function(a) {
	var m = j5g3.matrix(), m2 = svg.createSVGMatrix();
	a.equal(m.a, 1);
	a.equal(m.d, 1);
	a.equal(m.a, m2.a);
	a.equal(m.d, m2.d);

	m.reset();
	m2 = svg.createSVGMatrix();

	compareM(a, m, m2);
});

test('Matrix#inverse', function(a) {

	initM(1,2,3,4,5,6);
	m = m.inverse();
	m2 = m2.inverse();

	compareM(a, m, m2);

	initM(11,12,13,14,15,16);
	m = m.inverse();
	m2 = m2.inverse();

	compareM(a, m, m2);

	initM(-11, 12, -13, 14, -15, 16);
	m = m.inverse();
	m2 = m2.inverse();

	compareM(a, m, m2);

});

test('Matrix#to_client', function(a)
{
var
	M = j5g3.matrix()
;
	M.to_client(10, 20);
	compare(a, M, { x: 10, y: 20 });
	M.scale(2, 2);
	M.to_client(10, 20);
	compare(a, M, { x: 5, y: 10 });
	M.scale(-1, -1);
	M.to_client(10, 20);
	compare(a, M, { x: -5, y: -10 });

});

test('Matrix#scale', function(a) {
	var m = j5g3.matrix(), m2 = svg.createSVGMatrix();
	m.scale(-1, -2);
	m2 = m2.scaleNonUniform(-1, -2);
	compareM(a, m, m2);
	m.scale(0, -0);
	m2 = m2.scaleNonUniform(0, -0);
	compareM(a, m, m2);
});

test('Matrix#multiply', function(a)
{
	m = j5g3.matrix().multiply(11, 12, 13, 14, 15, 16);
	m2= j5g3.matrix().multiply(-4, 5, 2, 99, 23, -99);
	m3= svgM(11, 12, 13 ,14, 15, 16);
	m4= svgM(-4, 5, 2, 99, 23, -99);

	m = m.product(m2);
	m2= m3.multiply(m4);

	compareM(a, m, m2);

	m = j5g3.matrix().multiply(11, 12, 13, 14, 15, 16);
	m2= j5g3.matrix().multiply(-4, 5, 2, 99, 23, -99);
	m = m.product(m2.inverse());
	m2= m3.multiply(m4.inverse());

	compareM(a, m, m2);
});

test('Matrix#product', function(a) {

	m = j5g3.matrix();
	m2 = j5g3.matrix();
	m.e = 1; m.f = 2;
	m = m.product(m2, 10, 20);

	a.equal(m.e, 11);
	a.equal(m.f, 22);

});

test('BoundingBox', function(a)
{
var
	A = new j5g3.BoundingBox()
;
	a.strictEqual(A.x, A.y);
	a.strictEqual(A.w, A.h);
	a.strictEqual(a.r, a.b);
});

test('BoundingBox#clip', function(a)
{
var
	A = new j5g3.BoundingBox(-100, -100, 200, 200)
;
	A.clip(-50, -30, 50, 30);
	compare(a, A, { x: -50, y: -30, r: 50, b: 30, w: 100, h: 60 });
	A.set(-100, -100, 200, 200);
	A.clip(-50, -30, 150, 130);
	compare(a, A, { x: -50, y: -30, r: 100, b: 100, w: 150, h: 130 });
	A.clip(-100, -100, 50, 50);
	compare(a, A, { x: -50, y: -30, r: 50, b: 50, w: 100, h: 80 });

	A.clip(-200, -200, -150, -150);
	compare(a, A, { x: -150, y: -150, r: -150, b: -150, w: 0, h: 0 });

});

test('BoundingBox#intersect', function(a) {
var
	A = new j5g3.BoundingBox(40, 40, 60, 30),
	B = new j5g3.BoundingBox(10, 20, 50, 50)
;
	a.ok(A.intersect(B));
	a.ok(B.intersect(A));
	B.set(100, 100, 50, 20);
	a.ok(!A.intersect(B));
	a.ok(!B.intersect(A));
	B.set(50, 50, 0, 0);
	a.ok(A.intersect(B));
	a.ok(B.intersect(A));

});

})();