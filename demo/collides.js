
(function(j5g3) {
var
	a, b, stage = this.stage,

	coll = new j5g3.Collision.AABB(),
	y = 20,
	x = 30,

	do_test = function(B)
	{
		stage.add([
			a = j5g3.rect({
				x: x, y: y, fill: 'red', width: 100, height: 30
			}),
			b = j5g3.rect({
				x: x+B.x, y: y+B.y, fill: 'green', width: 50, height: 15
			}),

			j5g3.text({
				x: 180,
				y: a.y+a.height/2+5,
				text: coll.query(a, b) ? 'Collision' : 'No Collision',
				font: '20px Arial', fill: 'white'
			})
		]);

		if (coll.collides)
			stage.add([
				j5g3.dot({ line_width: 5, stroke: 'white', x: coll[0], y: coll[1] }),
				j5g3.dot({ line_width: 5, stroke: '#0000ff', x: coll[2], y: coll[3] }),
				a = j5g3.rect({ x: a.x+300, y: y, fill: 'red', width: 100, height: 30 }),
				b = j5g3.rect({ fill: 'green', width: 50, height: 15 }).set(B).set({
					x: b.x+300+(coll ? coll.nx*coll.penetration : 0),
					y: b.y+ (coll ? coll.ny*coll.penetration : 0)
				}),
				j5g3.text({
					x: 500,
					y: a.y+a.height/2+5,
					text: coll ? (a.collides(b).collides ? 'Not Resolved' : 'Resolved') : '',
					font: '20px Arial', fill: 'white'
				})
			]);
		console.log(coll);
		y += 40;
	}
;

	do_test({ x: 70, y: 10 });
	do_test({ x: 90, y: 20 });
	do_test({ x: 30, y: 20 });
	do_test({ x: -20, y: 20 });

	do_test({ x: -20, y: 10 });
	do_test({ x: -20, y: -10 });
	do_test({ x: 30, y: -10 });
	do_test({ x: 10, y: 10 });
	do_test({ x: 40, y: 10 });

	do_test({ x: 100, y: 10 });
	do_test({ x: 40, y: 30 });
//	do_test({ x: 20, y: 340, sx: 0.5 }, { x: 100, y: 350 });
//	do_test({ x: 20, y: 420 }, { x: 100, y: 430, sx: 0.5 });

//	do_test({ x: 320, y: 20 }, { x: 400, y: 30, sx: -2 });
//	do_test({ x: 320, y: 100, sx: 0.3 }, { x: 400, y: 110, sx: -1 });
//	do_test({ x: 320, y: 180, sx: 0.5 }, { x: 400, y: 190, sx: -0.5 });

	this.stage.draw();
});