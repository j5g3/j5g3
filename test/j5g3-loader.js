
(function() {

module('j5g3-loader');

test('j5g3.Loader#ready', function(a) {

	var loader = new j5g3.Loader();
	var done = a.async();

	loader.ready(function() {
		a.equal(this, loader);
		a.equal(loader.progress, 1);
		done();
	});

});

test('j5g3.Loader#ready sources', function(a) {

var
	loader = j5g3.loader(),
	earth = loader.img(basePath + 'man.png'),
	ball = loader.img(basePath + 'ball.gif'),
	earth2 = loader.img(basePath + 'man.png'),
	done = a.async()
;
	a.equal(loader.progress, 0);

	loader.ready(function() {
		a.equal(loader.progress, 1);
		a.ok(earth.naturalWidth);
		a.ok(ball.naturalWidth);
		a.equal(earth, earth2);
		done();
	});

});

test('j5g3.Loader#on_source', function(a) {

var
	loader = j5g3.loader(),
	earth = loader.img(basePath + 'man.png'),
	ball = loader.img(basePath + 'ball.gif'),
	earth2 = loader.img(basePath + 'man.png'),
	error = loader.img('404'),
	done = a.async()
;
	a.equal(loader.progress, 0);

	loader.on_source = function(src)
	{
		a.ok(src.el);
	};

	loader.ready(function() {
		a.equal(loader.progress, 1);
		a.ok(earth.naturalWidth);
		a.ok(ball.naturalWidth);
		a.equal(earth, earth2);
		a.ok(error.error);
		done();
	});

});

test('j5g3.Loader#data', function(a) {

var
	loader = j5g3.loader(),
	data = loader.data(basePath + 'j5g3-loader.js'),
	data2 = loader.data(basePath + 'j5g3-loader.js'),
	done = a.async()
;
	loader.on_source = function(src)
	{
		a.ok(src);
	};

	loader.ready(function() {
		a.ok(data.raw.length);
		a.equal(data, data2);
		done();
	});

});

test('j5g3.Loader#script', function(a) {
var
	loader = j5g3.loader(),
	script = loader.script(basePath + 'test.js'),
	done = a.async()
;
	loader.ready(function() {
		a.ok(script.src);
		a.ok(window.testIncluded);
		done();
	});

});

test('j5g3.Loader#json', function(a) {

var
	loader = j5g3.loader(),
	data = loader.json(basePath + '../package.json'),
	done = a.async()
;
	loader.ready(function() {
		a.ok(data.json);
		a.equal(data.json.name, 'j5g3');
		done();
	});

});

test('j5g3.Loader#on_progress', function(a) {

var
	loader = j5g3.loader(),
	done = a.async()
;
	a.equal(loader.progress, 0);

	loader.on_progress = function(progress)
	{
		a.equal(progress, loader.progress);
		if (progress===1)
			done();
	};

	loader.ready();

});

test('j5g3.Loader#audio', function(a) {

var
	loader = j5g3.loader(),
	audio = loader.audio(basePath + 'pop.mp3'),
	done
;
	if (j5g3.support.audio)
	{
		done = a.async();
		loader.ready(function() {
			a.ok(audio);
			loader.destroy();
			done();
		});
	}
	else
		a.ok(!audio);
});

})();