(function(j5g3) {
var
	a, b, stage = this.stage,

	coll = new j5g3.Collision.Circle(),
	y = 20,
	x = 30,

	do_test = function(B)
	{
		stage.add([
			a = j5g3.circle({
				x: x, y: y, fill: 'red', radius: 10,
				cx: -10, cy: -10,
				collides: j5g3.CollisionTest.Circle
			}),
			b = j5g3.circle({
				x: x+B.x, y: y+B.y, fill: 'green', radius: 15,
				cx: -15, cy: -15,
				collides: j5g3.CollisionTest.Circle
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
				a = j5g3.circle({ x: a.x+300, y: y, fill: 'red', radius:10 }),
				b = j5g3.circle({ fill: 'green', radius: 15 }).set(B).set({
					x: b.x+300+(coll ? coll.nx*coll.penetration : 0),
					y: b.y+ (coll ? coll.ny*coll.penetration : 0)
				}),
				j5g3.text({
					x: 500,
					y: a.y+a.height/2+5,
					text: a.collides(b) ? 'Not Resolved' : 'Resolved',
					font: '20px Arial', fill: 'white'
				})
			]);

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

	this.stage.draw();
});