
	module('j5g3-collision');
	test('CollisionTest.AABB', function(assert)
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

	test('HitTest#Rect', function(a)
	{
	var
		A = j5g3.rect({ x: 10, y: 20, width: 30, height: 40, cx: -10, cy: -20 }),
		B = j5g3.clip(),
		BB = new j5g3.BoundingBox()
	;
		A.validate(BB);
		a.ok(A.at(0,0));
		A.set({ cx: 0, cy: 0 });
		A.validate(BB.reset());
		a.ok(!A.at(0, 0));
		a.ok(A.at(10, 20));
		A.scale(0.5).invalidate();
		A.validate(BB);
		a.ok(!A.at(9, 20));
		a.ok(!A.at(10, 19));
		a.ok(A.at(10, 20));
		a.ok(A.at(20, 30));
		a.ok(!A.at(40, 60));
		A.set({ cx: 20, cy: 30 });
		A.validate(BB);
		a.ok(!A.at(10, 19));
		a.ok(A.at(20, 35));
		a.ok(!A.at(19, 35));
		a.ok(!A.at(20, 34));
		a.ok(A.at(35, 55));
		a.ok(!A.at(36, 56));
	});