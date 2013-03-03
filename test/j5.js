
j5g3.ready(function() {

	module('j5g3-core');
	test('Core', function() {

	var 
		Base = j5g3.Class.extend({
			init: function(a)
			{
				this.extend(a);// document.write(this.className+':'+a+"\n");
			},
			method2: function() { document.write('Base'); }
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
		ok(Child.name === 'Child');
		ok(Base.className === 'Base');
		ok(Child2.className === 'Child2');
		ok(b.constructor.className === 'Base');
		ok(c.prop === 'Hello World');
		ok(e.prop === 'Radiohead');
		ok(c.method() == 1 && d.method() == 1);
		ok(e.method() == 2);
		equal(f.method(), 3);
		ok(b.a == 1);
		ok(c.a === 2);
		ok(d.a === 3);
		ok(e.a === 4);
		ok(f.a === 5 && f.x === f.a);

	});

	test('DOM', function()
	{
	var
		e = j5g3.dom('DIV')
	;
		equal(e.tagName, 'DIV');
	});

});
