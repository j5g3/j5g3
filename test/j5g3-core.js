
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

	test('DOM', function(assert)
	{
	var
		e = j5g3.dom('DIV')
	;
		assert.equal(e.tagName, 'DIV');
	});
