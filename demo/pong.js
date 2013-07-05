
(function (j5g3)
{
var
	MAXW = 640,
	MAXH = 480,
	MAXVX = 12,

	ss = j5g3.spritesheet(j5g3.dom.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANgAAACYCAMAAACxptezAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFFQTFRFNE9B6R4AAEm2mQAAAABB/8wAsLCwAHX//21JAGvrADfmGCUedXV1ZmZm95IA//8ATExM5ubmAAAA////AGnm2t3aHr4WipKKsLawAIoA////gj0+iQAAABt0Uk5T//////////////////////////////////8AJzQLNQAAArlJREFUeNrs3IF2giAUBuCaq5VLZ62SfP8HHYEoUgZOUbj9f+foHJ1OX9gtUlxVRLMCDDDAAAPsrWBHmW3blPK0Wxcj5gNdFk4/bCuSta49T0oPlu6PHVnksCzrdBgF2MenTB+MGTEfiC2cXtjXh0g/rOzkEWa0z73tDOOy8/mcak9cf32ewbrtc2+7w4xyTwj2+okDFj6MSvGwlPNoy72Z0oitfe78H/YtUqr1Q/tKpFxqDRhhWMLjPrC7dXOde9sdlqx5EnqwZH0cJIsItgYMMBQPnzCy5X5gAAMMMMAAewvYdeEMgBU8/T0Sb48VB56CHqw4HDsyQrADDZh5RBOwOGDtoVoyxYObRMiV+6HfLAADDDDAJof9yGx8QX5ltvPDNiK5N1j9ZWISmG38o7cpmK+xl4I5jcfU7jPFCFrCcs89lrn1mHqVp4CtExlfMHVC2+ywXX1AwxdMDbEGwHJ6MLX7kIPtBh4PAwwwwAADzBvsfvoxRZicbUIPpmabEITtA4bpYyP1WI7DqwbmOh5TMKfxmA12kSc8XtSaTI95hN3kbJMbPdii5d42XyvaD2jbCfzxwixTLiKGvZ4kAxhggKF4vFe5t83XAgywQGAjxmODM+l4DL9ShXaoFrBgYAscqt3kMr5g6oS22WFBncBCFqZ2H3KwsQEMMMAAA+wtYMHOH6PbY+Knp2ZR/yn+bbRVenMMMLE4nfhzrm+V9h91h/uS6esYYE1nyBvTYEx1qQSJO8UDq1izeNZjTTe194zoPabBLO+xaGD4HIsaxrq7XG+Rjw8mOHXdYJ0iX9GEMaowGj1Wl/qK0HsM5R7jsWjHY+bZcXOvAQOs53zGYK53PzbBXgB5NCzUS1aPhwV6kXHAACMDo1o8qJb7YK93DxhgRGChBTDAAAMMMMAAAwwwwAADLPD8CTAAtFXb3JrgmbQAAAAASUVORK5CYII=")),

	player   = ss.cut(8, 8, 8, 40).pos(20, MAXH/2-10),
	computer = ss.cut(8, 54, 8, 40 ).pos(MAXW-20, MAXH/2-10),
	ball     = ss.cut(24, 8, 8, 8).pos(MAXW/2, MAXH/2),

	score1 = j5g3.text({ text: "0", x: MAXW/2 - 50, y: 30, font: '24px serif', fill: 'white' }),
	score2 = j5g3.text({ text: "0", x: MAXW/2 + 50, y: 30, font: '24px serif', fill: 'white' }),

	restart = function(winner)
	{
		winner.text = (parseInt(winner.text, 10) + 1);
		ball.pos(MAXW/2, MAXH/2);
		ball.vx = -MAXVX;
		ball.vy = 0;

		player.y = (MAXH/2-10);
		computer.y = (MAXH/2-10);
		computer.v = 0;
	},

	wall = function(newy)
	{
		ball.y = (newy);
		ball.vy = -ball.vy;
	},

	update = function()
	{
		if (player.collides(ball))
		{
			ball.x = (player.x+8);
			ball.vx = MAXVX;
			ball.vy += player.F;
		} else if (computer.collides(ball))
		{
			ball.x = (computer.x-8);
			ball.vx = -MAXVX;
			ball.vy += computer.a;
		} else if (ball.x < 0)
			restart(score2);
		else if (ball.x > MAXW)
			restart(score1);
		else if (ball.y <= 0)
			wall(0);
		else if (ball.y >= MAXH)
			wall(MAXH);

		player.F = 0;

		ball.x += ball.vx;
		ball.y += ball.vy;
	},

	ai = function()
	{
	var by = ball.y, vx = ball.vx, y = computer.y+computer.height/2, a=0;

	if (vx > 0)
	{
		if (computer.y <5) computer.y = 5;
		else if (computer.y>MAXH-20) computer.y = (MAXH-20);
		else if (by > y+4) a = 2;
		else if (by < y-4) a = -2;

		if (a)
		{
			computer.v += a;
			computer.y = (computer.y + computer.v);
			computer.a = a;
			return;
		}
	}

	computer.v = computer.a = 0;
	},

	on_move = function(evt)
	{
		var yi = player.y, yf;
		player.y = (yf = this.y-20);
		// Calculate force, t = 1 frame, m = 1
		player.F = (yf-yi)/3;
	}
	;

	ball.vy = 0;
	ball.vx = -MAXVX;
	player.F = 0;
	computer.v = 0;

	$input.move = on_move;

	this.stage.add([ player, computer, ball, score1, score2, update, ai]);
	this.run();
})
