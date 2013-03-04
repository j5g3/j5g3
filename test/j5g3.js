
j5g3.ready(function() {
	j5g3.engine(function(j5g3) {

		module('j5g3');

		test('Core', function() {
			ok(j5g3);
		});

		test('Class Constructor', function()
		{
			var img = j5g3.id('img'),
			    I = new j5g3.DisplayObject({ source: img })
			;

			equal(I.source, img);
		});

		test('Class Properties', function()
		{
			var a = new j5g3.DisplayObject,
			    b = new j5g3.DisplayObject({ source: 'img' }),
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
			img = j5g3.id(src),
			a = new j5g3.Image(src),
			b = j5g3.image(src),
			c = j5g3.image(img),
			d = j5g3.image({ source: src })
		;
			ok(a.source.src.indexOf('explosion')>=0);
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
			a = j5g3.image('img')
		;	
			ok(a);
		});

		test('Clip Construction', function()
		{
		var
			a = j5g3.clip()
		;
			ok(a);
			ok(a.frame());
		});

		test('Clip - Adding Objects', function()
		{
		var
			a = j5g3.clip(),
			aa = j5g3.image('img'),
			ab = j5g3.image('img'),
			ac = j5g3.image('img'),
			frame = a.frame()
		;

			a.add([ aa, ab, ac ]);

			ok(frame);
			equal(frame.next, aa);
			equal(frame.previous, ac);
			equal(aa.next, ab);
			equal(ab.next, ac);
			equal(ac.next, frame);

			a.add_frame([ aa, ab, ac ]);
			frame = a.frame();

			equal(frame.next, aa);
			equal(frame.previous, ac);
			equal(aa.next, ab);
			equal(aa.previous, frame);
			equal(ab.next, ac);
			equal(ab.previous, aa);
			equal(ac.next, frame);
			equal(ac.previous, ab);

			a.next_frame();
			frame = a.frame();

			equal(frame.next, frame);
			equal(frame.previous, frame);

		});

		test('Clip - Removing Objects', function()
		{
		var
			a = j5g3.clip(),
			aa = j5g3.image('img'),
			ab = j5g3.image('img'),
			ac = j5g3.image('img'),
			frame = a.frame();
		;
			a.add([aa, ab, ac]);
			ab.remove();

			equal(frame.next, aa);
			equal(aa.next, ac);
			equal(aa.previous, frame);
			equal(ac.next, frame);
			equal(ac.previous, aa);

			ac.remove();
			equal(frame.next, aa);
			equal(frame.previous, aa);
			equal(aa.next, frame);
			equal(aa.previous, frame);

			aa.remove();
			equal(frame.next, frame);
			equal(frame.previous, frame);
		});

		test('Clip - Adding Frames', function()
		{
		var
			c = j5g3.clip(),
			img = j5g3.image('img'),
			frame, frame2 = c.frame()
		;
			c.add_frame();
			frame = c.frame();

			equal(frame.next, frame);
			equal(frame.previous, frame);

			c.next_frame();
			equal(c.frame(), frame2);
			ok(frame !== frame2);

			c.add_frame(img);
			frame = c.frame();
			equal(frame.next, img);
			equal(img.next, frame);
		});

		test('Text Construction', function()
		{
		var
			t = j5g3.text(),
			t2= j5g3.text('Hello World')
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
			img = j5g3.image('img'),
			t = j5g3.tween(),
			t2= j5g3.tween(img)
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
			img=j5g3.image('soccer'),
			s = j5g3.spritesheet('soccer'),
			s2= j5g3.spritesheet(img)
		;

			equal(s.sprites.length, 0);
			equal(s2.source, img);
			equal(s.source.source, img.source);
			
		});

		test('Spritesheet - Adding Sprites', function()
		{
		var
			s = j5g3.spritesheet('soccer'),
			s2= j5g3.spritesheet('soccer')
		;
			s.grid(5, 5);
			equal(s._sprites.length, 25);

			s2.cut(0,0,10,10);
			equal(s2._sprites.length, 1);
			s2.cut(0,0,10,10);
			equal(s2._sprites.length, 2);
			s2.push(0,0,10,10);
			equal(s2._sprites.length, 3);
			
		});

		test('Spritesheet - Clipping', function()
		{
		var
			s = j5g3.spritesheet('soccer').grid(5, 5),
			a = s.clip([0, 1, 2])
		;
			equal(a._frames.length, 3);
		});

		test('Collision', function()
		{
		var
			a, b,
			do_test = function(A, B) {
				a = j5g3.rect({ fill: 'red', width: 100, height: 50 }).set(A),
				b = j5g3.rect({ fill: 'green', width: 50, height: 30 }).set(B),
				ok(a.collides(b));				
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
