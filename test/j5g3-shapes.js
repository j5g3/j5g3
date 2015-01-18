
module('j5g3-shapes');

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