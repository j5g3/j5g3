
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
	console.log(m);
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
	/*
	m.scale(-1, -2);
	m2 = m2.scaleNonUniform(-1, -2);
	compareM(m, m2);

	m.translate(-2, -2);
	m2 = m2.translate(-2, -2);
	equal(m.e, m2.e);
	equal(m.f, m2.f);
	*/

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

})();