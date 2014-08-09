
	module('j5g3-core');
	test('Class', function(assert) {
	var
		Base = j5g3.Class.extend({
			init: function(a)
			{
				this.extend(a);// document.write(this.className+':'+a+"\n");
			},
			method2: function() { return 'Base'; }
		}, { className: 'Base' }),

		Child = Base.extend({
			init: function Child(n)
			{
				Base.apply(this, [ { a: n } ]);
			},
			method: function() {
				return 1;
			},
			prop: "Hello World"
		}, { className: 'Child' }),

		Child2 = Child.extend({
			method: function() {
				return Child.prototype.method.apply(this) + 1;
			},
			prop: 'Radiohead'
		}, { className: 'Child2' }),

		Child3 = Child2.extend({
			init: function(x)
			{
				Child2.apply(this, [x]);
				this.x = x;
			},
			method2: function() {
				return Child2.prototype.method2.apply(this);
			},

			method: function() {
				return Child2.prototype.method.apply(this) + 1;
			}
		}),

		b = new Base({ a: 1 }),
		c = new Child(2),
		d = new Child(3),
		e = new Child2(4),
		f = new Child3(5)
	;
		assert.ok(Child.name === 'Child');
		assert.ok(Base.className === 'Base');
		assert.ok(Child2.className === 'Child2');
		assert.ok(b.init.className === 'Base');
		assert.ok(c.prop === 'Hello World');
		assert.ok(e.prop === 'Radiohead');
		assert.ok(c.method() == 1 && d.method() == 1);
		assert.ok(e.method() == 2);
		assert.equal(f.method(), 3);
		assert.ok(b.a == 1);
		assert.ok(c.a === 2);
		assert.ok(d.a === 3);
		assert.ok(e.a === 4);
		assert.ok(f.a === 5 && f.x === f.a);
	});

	test('Class Constructor', function(assert)
	{
	var
		img = j5g3.id('img'),
		I = new j5g3.Class({ source: img })
	;

		assert.equal(I.source, img);
	});

	test('Class Properties', function(assert)
	{
	var
		a = new j5g3.Class(),
		b = new j5g3.Class({ source: 'img' })
	;
		a.extend({ x: 10 });
		assert.equal(a.source, undefined);
		assert.ok(b.source);
		assert.equal(a.x, 10);
	});

	test('dom', function(assert)
	{
	var
		e = j5g3.dom('DIV')
	;
		assert.equal(e.tagName, 'DIV');
	});

	test('dom.image', function(assert) {
	var img = j5g3.dom.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACyCAMAAACX4sbwAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRF9/f37u7u9PT0/v7+4+Pj+/v7////////gYJgMwAAAAh0Uk5T/////////wDeg71ZAAAEEklEQVR42uzb7VIbMQwFUFOo7vu/cWdapiRrfdkrycrA/iMk4YzslWWtGWhy0b/r86fRCvUfNpqhPmGjHeqvazRUdWARdx1nEX+NlqrDrMdx68O6JKsmrIuqHWt2jkaqXiy0YlEfFmfAaRY/j06zhAE7zCKTdSBvybngJItasrTMyVLH8RRF3EujUkXqa9VFs8ri4zfySSpLwI+qQPEIKaSjEDUndJxgkcVi35m92SeNha8fufccY+nzbxSqyD8DR6GK/EHNYr33ZL1tj2Fmlh89WV9/gC8VmMRawHqAELulZ0r8BiwurT688T2Hxfdh+GDxJXNL1lsKS2hasWPIsj7KWa60mhItqZfmZ/2KZF0hIstMq7+rWb5sH5m3rpOJ3eI8+kpYHx6WNsdSWDStISpL7SLFsebFBtLUsnevYSzyseaQSr2SEakiZQxJG+kUFjlZ/mBFsIhjcS0Qf7ACWJQQrPssmmdPFUteMa7dA4vlbVmOlZy0rML1MaYzWA6Wsp2atlukzHiFNe+OxkJOMlXaGMr1KrdnGws5yVTtsbgN7j5LU5HWo5SfUMPLErfq7DbeUJGWUZ7/wnB3g2wVFoOltCi2WGSotljYYtmxggGAyoKf5QoWFllwqNws4x50sJaaqjdZWuYlNwtLLPs2VF+2x1pebG+xsMWCo3M5NjK88I1y2nSGe5Xlq3T8LHXT757y2GF5msy3WOjGWqoL5SV4XfXNWFTAEm5vPwsJLCnrXO918bBmCot0ljhuqSwlyUOPUCJLXXugBugJGsoyFjRLlRUti0XeYIWyjOXfVN0Zw30WHWdhg4UkFt1lUSlrPVh9WFq0z7Fuq0SWb3sgZ8981sIWlS2ZA1lmsBi9tO0pZEFkeTeoZayHMvYQy5iClMTyBsvDQjLra0UxblgqZF1ntbKeZ7GkRixcvZfbFfMyy1X9PLMQxpLa1juqXBZ1Y62OIRWyzAeK0y78nopj3RpDasxCAkuqnlxjeC0QkcR6Dpb0OCN6DNdYxlPNOVhxLG0MjSfTcWO4xKJWLPPsxVyN3VWxc0s4dVUYLKuCgOPUHyQWKljkvA8jxjCAJTbkkMmyZlZssbzPEvZA9x+orLDOBGuXlbM79JaB4lmwleMRdSyzIYdUltBFM3u9qGc5WtAoYMkdU+FzQAqLnCzhgyhhiT1S7tt+IeiyBlFseyP1sqIlsXCUJT0kQEsWzrJyUngOC0dYxoFA4DRr/gWqrgVW5fV6LPywXpVFP6yXZ1FLVhPVhUU/LD+LWrKoJYtasqglq5WqO4tasiKOsMazqCUr5gjrN2EFHWENZkUdYS1g4ThL/S/yFqw2KoyWwXopFlqxqDcLjVhtahqJhZYstGCho2pioQsLDVVP9VYfFf4IMACQm8FBYS9cMwAAAABJRU5ErkJggg==");

	assert.ok(img);
	assert.equal(img.width, 150);
	assert.equal(img.height, 178);

	});

	test('j5g3#get_type', function(a) {
	var
		audio = j5g3.dom('AUDIO'),
		audio2 = new window.Audio(),
		img = new Image(),
		img2 = j5g3.dom('IMG')
	;
		a.equal(j5g3.get_type(audio), 'audio');
		a.equal(j5g3.get_type(audio2), 'audio');
		a.equal(j5g3.get_type(img), 'dom');
		a.equal(j5g3.get_type(img2), 'dom');

	});