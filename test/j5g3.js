
j5.ready(function() {
	j5.g3(function(j5, g3) {

		module('j5g3');

		test('Core', function() {
			ok(j5);
		});

		test('Class Constructor', function()
		{
			var img = j5.id('img'),
			    I = new g3.DisplayObject({ source: img })
			;

			equal(I.source, img);
		});

		test('Class Properties', function()
		{
			var a = new g3.DisplayObject,
			    b = new g3.DisplayObject({ source: 'img' }),
			    c = b.set({x: 5})
			;
			a.extend({ x: 10 });
			b.set({ x: 10 });

			equal(c, b);
			equal(a.source, undefined);
			ok(b.source);
			equal(a.x, 10);
			equal(b.x, 10);
		});

		test('Image Constructor', function()
		{
		var 
			src = 'img',
			img = j5.id(src),
			a = new g3.Image(src),
			b = g3.image(src),
			c = g3.image(img),
			d = g3.image({ source: src })
		;
			ok(a.source.src.indexOf('explosion17'));
			equal(b.source, a.source);
			equal(c.source, d.source);
			equal(c.width, 320);
			equal(c.height, 320);
			
			d.set_source(src);
			equal(d.source, c.source);
		});

		test('Image Drawing', function()
		{
		var
			a = g3.image('img')
		;	
			ok(a);
		});


		test('Clip Construction', function()
		{
		var
			c = g3.image('img'),
			a = g3.clip([[ c ]]),
			b = g3.clip()
		;
			ok(a.frames);
			ok(b.frames);
			equal(b.frames.length, a.frames.length);
			equal(a.frames[0].length, 1);
			equal(b.frames[0].length, 0);
		});

		test('Clip - Adding Objects', function()
		{
		var
			c = g3.clip(),
			src = 'img',
			img = j5.id(src),
			imgo= g3.image(img)
		;

			equal(c.frame().length, 0);
			c.add(img);
			equal(c.frame().length, 1);
			c.add(imgo);
			equal(c.frame().length, 2);
			ok(c.frame()[1]===imgo);

			c.add(function() { });
			equal(c.frame().length, 3);
			ok(c.frame()[2] instanceof g3.Action);
			c.add(src);
			equal(c.frame()[3].source, imgo.source);
			c.add({ source: src });
			equal(c.frame()[4].source, imgo.source);
			c.add({ source: img });
			equal(c.frame()[5].source, imgo.source);
			c.add([ src, img, imgo ]);
			equal(c.frame().length, 9);
		});

		test('Clip - Adding Frames', function()
		{
		var
			c = g3.clip()
		;
			c.add_frame();
			equal(c.frame().length, 0);
			equal(c.frames.length, 2);
			c.add_frame('img');
			equal(c.frame().length, 1);
			equal(c.frames.length, 3);
		});

		test('Clip - Misc Methods', function()
		{
		var
			c = g3.clip()
		;
			c.add([ 'img', 'soccer']);
			c.add_frame(['img', 'soccer']);

			equal(c.children().length, 4);

			c.scaleT(2);
			equal(c.frames.length, 4);
			c.scaleT(4);
			equal(c.frames.length, 8);
		});


		test('Text Construction', function()
		{
		var
			t = g3.text(),
			t2= g3.text('Hello World')
		;
			ok(t);
			equal(t2.text, 'Hello World');

			//t.paint();
			//t2.paint();
			//equal(t.get_width(), 0);
			//ok(t2.get_width());
		});


		test('Tween Construction', function()
		{
		var
			img = g3.image('img'),
			t = g3.tween(),
			t2= g3.tween(img)
		;
			equal(t2.target, img);
			equal(t.t, 0);
			t.pause();
			t.resume();
			t.rewind();
			t.pause();
			t.restart();
			t.stop();
		});

		test('Spritesheet Constructor', function()
		{
		var
			img=g3.image('soccer'),
			s = g3.spritesheet('soccer'),
			s2= g3.spritesheet(img)
		;

			equal(s.sprites.length, 0);
			equal(s2.source, img);
			equal(s.source.source, img.source);
			
		});

		test('Spritesheet - Adding Sprites', function()
		{
		var
			s = g3.spritesheet('soccer'),
			s2= g3.spritesheet('soccer')
		;
			s.grid(5, 5);
			equal(s.sprites.length, 25);

			s2.cut(0,0,10,10);
			equal(s2.sprites.length, 1);
			s2.cut(0,0,10,10);
			equal(s2.sprites.length, 2);
			s2.push(0,0,10,10);
			equal(s2.sprites.length, 3);
			
		});

		test('Spritesheet - Clipping', function()
		{
		var
			s = g3.spritesheet('soccer').grid(5, 5),
			a = s.clip(0, 1, 2),
			b = s.clip_array([ 0, 2 ])
		;
			equal(a.frames.length, 3);
			equal(b.frames.length, 2);
		});

		test('Collision', function()
		{
		var
			A = 
			do_test = function() {
				
			}
		;
			do_test({ x: 20, y: 20 }, { x: 100, y: 30 });
			do_test({ x: 20, y: 100 }, { x:120, y:110 });
			do_test({ x: 20, y: 180 }, { x: 130, y: 190 });
			do_test({ x: 20, y: 260 }, { x: 121, y: 270 });
			do_test({ x: 20, y: 340, scaleX: 0.5 }, { x: 100, y: 350 });
			do_test({ x: 20, y: 420 }, { x: 100, y: 430, scaleX: 0.5 });

			do_test({ x: 320, y: 20 }, { x: 400, y: 30, scaleX: -2 });
			do_test({ x: 320, y: 100, scaleX: 0.3 }, { x: 400, y: 110, scaleX: -1 });
			do_test({ x: 320, y: 180, scaleX: 0.5 }, { x: 400, y: 190, scaleX: -0.5 });
		});

	});
});
