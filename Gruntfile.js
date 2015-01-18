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
					'src/j5g3-core.js', 'src/j5g3-matrix.js',
					'src/j5g3-support.js',
					'src/j5g3-validate.js', 'src/j5g3.js',
					'src/j5g3-loader.js',
					'src/j5g3-collision.js', 'src/j5g3-shapes.js',
				]
			},

			'tests': {
				options: {
					"unused":true,
					"eqeqeq":true,
					"newcap":true,
					"undef":true,
					"smarttabs":true,
					"trailing":true,
					"maxdepth":3,
					"freeze": true,
					"browser": true,
					globals: {
						'module': false, 'test': false,
						'j5g3': false, 'compare': false,
						"basePath": true
					}
				},
				src: 'test/**/*.js'
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

			"css": {
				src: 'src/j5g3.css',
				dest: 'build/j5g3.css'
			},

			"release": {
				files: {
					'build/j5g3-<%= pkg.version %>.css': 'build/j5g3.css'
				}
			}
		},

		uglify: {

			j5g3: {
				compress: true,
				files: {
					'build/j5g3-all.min.js': 'build/j5g3-all.js'
				}
			},

			release: {
				compress: true,
				files: {
					'build/j5g3-all-<%= pkg.version %>.min.js': 'build/j5g3-all.js'
				}
			}
		},

		watch: {
			j5g3: {
				files: '<%= jshint.j5g3.src %>',
				tasks: [ 'jshint:j5g3', 'concat:j5g3', 'karma' ]
			},

			css: {
				files: '<%= concat.css.src %>',
				tasks: [ 'concat:css' ]
			},

			tests: {
				files: 'test/*.js',
				tasks: [ 'jshint:tests', 'karma' ]
			}
		},

		karma: {
			j5g3: {
				files: [
					'<%= jshint.j5g3.src %>',
					[
						{ pattern: 'test/**/*.png', included: false, served: true },
						{ pattern: 'test/**/*.gif', included: false, served: true },
						{ pattern: 'package.json', included: false },
						{ pattern: 'test/test.js', included: false },
						{ pattern: 'test/**/*.mp3', included: false },
						{ pattern: 'test/**/*.ogg', included: false },
						'test/fixture.js', 'test/j5g3-core.js',
						'test/j5g3-collision.js', 'test/j5g3-matrix.js',
						'test/j5g3-shapes.js', 'test/j5g3.js',
						'test/j5g3-validate.js', 'test/j5g3-loader.js'
					]
				],
				frameworks: [ 'qunit' ],
				plugins: [ 'karma-qunit', 'karma-coverage', 'karma-phantomjs-launcher' ],
				browsers: [ 'PhantomJS' ],
				reporters: [ 'progress', 'coverage' ],
				preprocessors: {
					'src/**/*.js': [ 'coverage' ]
				},
				singleRun: true,
				coverageReporter: {
					subdir: 'report'
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('default', [ 'jshint', 'clean', 'concat:j5g3', 'concat:css' ]);
	grunt.registerTask('minify', [ 'default', 'uglify:j5g3' ]);
	grunt.registerTask('release', [ 'default', 'concat:release', 'uglify:release']);
};
