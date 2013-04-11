module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		clean: {
			j5g3: [ 'build' ]
		},
		
		qunit: {
			files: [ 'test/*.html' ]
		},
		
		jshint: {
			j5g3: { 
				options: { jshintrc: '.jshintrc' }, 
				src: [ 
					'src/j5g3.js', 'src/j5g3-loader.js',
					'src/j5g3-collision.js', 'src/j5g3-shapes.js',
					'src/j5g3-support.js'
				]
			}
		},
		
		concat: {
			"j5g3-all": {
				src: '<%= jshint.j5g3.src %>',
				dest: 'build/j5g3-all.js'
			}
		},
		
		watch: {
			j5g3: { 
				files: '<%= jshint.j5g3.src %>',
				tasks: [ 'jshint:j5g3', 'clean:j5g3', 'concat', 'qunit' ]
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', [ 'jshint', 'qunit', 'clean', 'concat', 'uglify' ]);
};