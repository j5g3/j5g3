
/**
 * Breakout Examples
 */

(function(j5g3) {

var

	/** @const */ MAXV = 5,
	/** @const */ PLAYERW2 = 25,
	/** @const */ BALLW2 = 7,

	ss = j5g3.spritesheet(j5g3.dom.image("data:image/png;base64,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")),

	stage = this.stage,
	canvas = stage.canvas,

	audio = {
		pong: new Audio('audio/pong.ogg')
	},

	player, ball, map,

	collides = function(a)
	{
		return a.collides(ball);
	},

	collidesBoard = function()
	{
		i = map.map.length;
		while (i--)
		{
			xi = map.map[i].length;
			while (xi--)
				if (map.map[i][xi] && collides({
					x: map.x + xi * map.tw,
					y: map.y + i * map.th,
					height: map.th,
					width: map.tw,
					collides: map.collides,
					M: map.M
				})) {
					map.map[i][xi]=0;
					return true;
				}
		}
	},

	shake = function()
	{
		stage.add(j5g3.Tween.Shake(stage));
	},

	update = function()
	{
		collision = true;

		if (collides(player))
		{
			ball.y = player.y-ball.height-1;
			ball.fx += player.F;
			ball.fy = -MAXV;
		}
		else if (ball.x > 640-BALLW2)
		{
			ball.x = 640-BALLW2;
			ball.fx = -ball.fx;
			shake();
		}
		else if (ball.x < BALLW2)
		{
			ball.x = BALLW2;
			ball.fx = -ball.fx;
			shake();
		} else if (ball.y < BALLW2)
		{
			ball.y = BALLW2;
			ball.fy = -ball.fy;
			shake();
		} else if (collidesBoard())
		{
			// TODO Velocity change depends on where the collision is...
			ball.fy = -ball.fy; // Math.abs(ball.fy);
		} else if (ball.y > 480)
		{
			ball.pos(320, 300);
			ball.fy = MAXV;
			ball.fx = 0;
			collision = false;
		} else
			collision = false;

		if (collision)
			audio.pong.play();

		ball.x += ball.fx;
		ball.y += ball.fy;

		player.F = 0;
	},

	mousemove = function(e)
	{
		xi = player.x;
		player.x = e.layerX - PLAYERW2;

		player.F = (player.x-xi)/3;
	},

	i, xi, collision
;
	map = j5g3.map({ tw: 42, th: 18, x: 5, y: 60 });
	audio.pong.volume = 0.2;

	ss.cut(0,0,1,1);

	for (i=0; i<8; i++)
	{
		ss.cut(0, 18*i, 42, 18);
		ss.cut(42, 18*i, 42, 18);

		map.map.push(j5g3.ary(15, 0, i*2+1));
	}

	map.sprites = ss.sprites();

	ss.cut(0, 174, 50, 12);
	player = ss.clip([ 17 ]).pos(320-PLAYERW2, 450);
	player.at = j5g3.HitTest.Rect;

	ss.cut(42, 146, 14, 14);
	ball = ss.clip([ 18 ]).pos(320, 300).set({ shape: 'circle', fx: 0, fy: MAXV });

	canvas.style.backgroundColor = '#330033';
	canvas.addEventListener('mousemove', mousemove);

	this.on_destroy = function()
	{
		canvas.style.backgroundColor = '';
		canvas.removeEventListener('mousemove', mousemove);
	};

	this.stage.add([ player, ball, map, update ]);

	this.run();
})
