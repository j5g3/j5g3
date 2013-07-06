
(function (j5g3)
{
var
	// Create our spritesheet and cut it
	ss = j5g3.spritesheet({
		source: $loader.img('img/man.png'),
		// Manually set the width and height so we dont have to wait for
		// image to load and grid() works
		width: 842,
		height: 980
		})
		.grid(6, 7),
	to = { x: 280 },
	y = -10,
	x = 0,
	a, easing,
	// Create a container for text
	text = j5g3.clip({ width: 640, height: 480 })
;
	this.stage.add(text);

	// Create clip, tween and text for each Easing function
	for (easing in j5g3.Easing)
	{
		a = ss.clip([ 16,17,18,19,20,21,22,23,24,25 ]).pos(x, y+=20).scale(0.2, 0.2);
		this.stage.add([
			a,
			j5g3.tween({ target: a, to: to, easing: j5g3.Easing[easing] }),
		]);

		text.add([
			j5g3.text({ text: easing, y: y, x: x+100, font: '20px Serif' })
		]);

		if (y > 440) {
			y = -10; x += 330; to = { x: 600 };
		}
	}

	text.cache();

	this.stage.canvas.style.backgroundColor = '#fff';
	this.run();
});