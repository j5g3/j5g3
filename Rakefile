
desc "Minify Files"
task :minify do
	`mkdir -p build`
	`uglifyjs -o build/j5g3-min.js src/j5g3.js`

	`uglifyjs -o build/j5g3-dbg-min.js src/j5g3.js src/j5g3-module-dbg.js`
	`uglifyjs -o build/j5g3-dbg-all-min.js build/j5g3-dbg-all.js`
	`uglifyjs -o build/j5g3-all-min.js build/j5g3-all.js`
end

desc "Build Uncompressed Files"
task :default do
	`cat src/j5g3.js src/j5fx.js src/j5g3-support.js >> build/j5g3-all.js`
	`cat src/j5g3.js src/j5fx.js src/j5g3-module-dbg.js >> build/j5g3-dbg-all.js`
end

desc "Lint"
task :lint do
	`jshint src/*.js`
end

desc "Generate Documentation"
task :docs => :source do
	puts "j5g3 Documentation..."
	#`#{JSDOC} -d=g3/docs g3/js/j5g3-all.js`
end
	
