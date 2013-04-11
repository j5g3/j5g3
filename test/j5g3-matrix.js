
j5g3.ready(function() {

	module('j5-math');

var 
	compareM = function(m, m2)
	{
		equal(m.a, m2.a);
		equal(m.b, m2.b);
		equal(m.c, m2.c);
		equal(m.d, m2.d);
		equal(m.e, m2.e);
		equal(m.f, m2.f);
	},
	tmp,
	svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),

	svgM = function(a, b, c, d, e, f)
	{
		tmp = svg.createSVGMatrix();
		tmp.a = a; tmp.b = b; tmp.c = c; tmp.d = d; tmp.e = e; tmp.f = f;
		return tmp;
	}
;

	test('Matrix', function() {
	var
		m = j5g3.matrix(),
		m2 = svg.createSVGMatrix(),
		m3, m4,

		initM = function(a, b, c, d, e, f)
		{
			m = j5g3.matrix(a,b,c,d,e,f);
			m2 = svgM(a, b, c, d, e, f);
		}
	;
		equal(m.a, 1);
		equal(m.d, 1);
		equal(m.a, m2.a);
		equal(m.d, m2.d);

		/*
		m.scale(-1, -2);
		m2 = m2.scaleNonUniform(-1, -2);
		compareM(m, m2);

		m.translate(-2, -2);
		m2 = m2.translate(-2, -2);
		equal(m.e, m2.e);
		equal(m.f, m2.f);
		*/

		m.reset();
		m2 = svg.createSVGMatrix();

		compareM(m, m2);

		initM(1,2,3,4,5,6);
		m = m.inverse();
		m2 = m2.inverse();

		compareM(m, m2);

		initM(11,12,13,14,15,16);
		m = m.inverse();
		m2 = m2.inverse();

		compareM(m, m2);

		initM(-11, 12, -13, 14, -15, 16);
		m = m.inverse();
		m2 = m2.inverse();

		compareM(m, m2);

		m = j5g3.matrix(11, 12, 13, 14, 15, 16);
		m2= j5g3.matrix(-4, 5, 2, 99, 23, -99);
		m3= svgM(11, 12, 13 ,14, 15, 16);
		m4= svgM(-4, 5, 2, 99, 23, -99);

		m = m.product(m2);
		m2= m3.multiply(m4);

		compareM(m, m2);

		m = j5g3.matrix(11, 12, 13, 14, 15, 16);
		m2= j5g3.matrix(-4, 5, 2, 99, 23, -99);
		m = m.product(m2.inverse());
		m2= m3.multiply(m4.inverse());

		compareM(m, m2);
		
	});

});
