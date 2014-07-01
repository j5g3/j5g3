(function(j5g3, engine) {

var
	// Load spritesheet
	ss = j5g3.spritesheet($loader.img('img/ninja.png')),

	// Create Ninja clip, make sure Clip has no frames.
	ninja = j5g3.clip({
		width: 195, height: 256, cx: -195/2, cy: -256/2
	}).remove_frame(),

	add_frames = function(frame)
	{
		clip.add_frame(frame);
	},

	stand = function()
	{
		ninja.go(0);
		ninja.moving = false;
	},

	strike = function()
	{
		if (!ninja.moving)
		{
			ninja.moving = true;
			ninja.go(1);
		}
	},

	walk = function()
	{
		if (!ninja.moving)
		{
			ninja.moving = true;
			ninja.go(2);
		}
	},

	// Ninja States
	states = {
		stand: [ ss.cut(455, 390, 149, 192) ],
		strike: [
			// The cut() method returns a Sprite object, the pos() method
			// is used to align them
			ss.cut(455, 586, 133, 198).pos(-7, -9),
			ss.cut(606, 390, 171, 194).pos(-12, -7),
			ss.cut(2,2, 131, 188).pos(-20, -2),
			ss.cut(135, 2, 131, 190).pos(-2, -5),
			ss.cut(584, 2, 181, 192).pos(7, -6),
			ss.cut(401, 2, 181, 192).pos(7, -6),
			ss.cut(165, 196, 159, 192).pos(-3, -6),
			ss.cut(294, 586, 159, 196).pos(-3, -4),

			ss.cut(135, 2, 131, 190).pos(-2, -5),
			ss.cut(2,2, 131, 188).pos(-20, -2),
			ss.cut(606, 390, 171, 194).pos(-12, -7),
			ss.cut(455, 586, 133, 198).pos(-7, -9),
			// the sprites update() will make sure that after striking
			// the ninja returns no its stand state
			ss.cut(455, 390, 149, 192).set({ update: stand })
		],
		walking: [
			ss.cut(151, 586, 141, 194).pos(4, -7),
			ss.cut(779, 390, 149, 194).pos(1, -7),
			ss.cut(268, 2, 131, 190).pos(-11, -5),

			ss.cut(779, 390, 149, 194).pos(1, -7),
			ss.cut(151, 586, 141, 194).pos(4, -7),

			ss.cut(455, 390, 149, 192),

			ss.cut(326, 196, 153, 192).pos(-3, -6),
			ss.cut(2, 586, 147, 194).pos(-3, -7),
			ss.cut(2, 196, 161, 192).pos(-5, -6),
			ss.cut(2, 586, 147, 194).pos(-3, -7),
			ss.cut(326, 196, 153, 192).pos(-3, -6).set({ update: stand })
		]
	},

	text = j5g3.text("Click/Enter to Attack, Right to move Right")
		.pos(20,20)
		.size(500, 24)
		.set({ font: '20px sans-serif', fill: '#eee' }).cache(),

	clip,
	state
;
	// Create States. Each frame in the ninja object is a state
	for (state in states)
	{
		clip = j5g3.clip({ st: 0.4 }).remove_frame();

		states[state].forEach(add_frames);
		clip.go(0);
		ninja.add_frame(clip);
	}

	$input.buttonY = strike;
	$input.right = walk;

	// Stop Ninja clip at frame 0, so it stays in one state
	ninja.go(0).stop();

	// Add ninja to stage and run
	this.stage.add([ ninja, text ]);
	ninja.align('center middle');
	$loader.ready(function() {
		engine.run();
	});
});