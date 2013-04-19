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
			'j5g3': { 
				options: { jshintrc: '.jshintrc' }, 
				src: [ 
					'src/j5g3.js', 'src/j5g3-loader.js',
					'src/j5g3-collision.js', 'src/j5g3-shapes.js',
					'src/j5g3-support.js'
				]
			},
			'j5g3dbg': {
				options: { jshintrc: '.jshintrc' },
				src: [
					'src/j5g3-debug.js'
				]
			}
		},
		
		concat: {
			"j5g3": {
				src: '<%= jshint.j5g3.src %>',
				dest: 'build/j5g3-all.js'
			},
			"j5g3dbg": {
				src: ['<%= jshint.j5g3.src %>', '<%= jshint.j5g3dbg.src %>'],
				dest: 'build/j5g3-all.dbg.js'
			}
		},
		
		watch: {
			j5g3: { 
				files: '<%= jshint.j5g3.src %>',
				tasks: [ 'jshint:j5g3', 'clean:j5g3', 'concat' ]
			},
			
			j5g3dbg: {
				files: '<%= jshint.j5g3dbg.src %>',
				tasks: [ 'jshint:j5g3dbg', 'clean:j5g3', 'concat' ]
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', [ 'jshint', 'clean', 'concat' ]);
};
