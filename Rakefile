


desc "Minify Files"
task :minify do
	`mkdir -p build`
	`uglifyjs -o build/j5g3-min.js src/j5g3.js`
	`uglifyjs -o build/j5g3-dbg-min.js src/j5g3.js src/j5g3-module-dbg.js`
end

desc "Generate Documentation"
task :docs => :source do
	puts "j5g3 Documentation..."
	`#{JSDOC} -d=g3/docs g3/js/j5g3-all.js`
end
	
