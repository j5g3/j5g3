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
					'src/j5g3-core.js', 'src/j5g3.js', 'src/j5g3-loader.js',
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
			options: {
				banner: grunt.file.read('src/banner.txt'),
				stripBanners: true,
			},

			"j5g3": {
				src: '<%= jshint.j5g3.src %>',
				dest: 'build/j5g3-all.js'
			},
			"j5g3dbg": {
				src: ['<%= jshint.j5g3.src %>', '<%= jshint.j5g3dbg.src %>'],
				dest: 'build/j5g3-all.dbg.js'
			},

			"css": {
				src: 'src/j5g3.css',
				dest: 'build/j5g3.css'
			}
		},

		uglify: {

			j5g3: {
				compress: true,
				files: {
					'build/j5g3-all.min.js': 'build/j5g3-all.js'
				}
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
			},

			css: {
				files: '<%= concat.css.src %>',
				tasks: [ 'concat:css' ]
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('default', [ 'jshint', 'clean', 'concat' ]);
	grunt.registerTask('minify', [ 'default', 'uglify' ]);
};
