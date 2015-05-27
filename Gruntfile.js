module.exports = function(grunt) {
    var path = require('path');
    var dust = require('dustjs-linkedin');

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ['tmp'],

        dust: {
            templates: {
                src: [
                    '*.dust',
                    'bower_components/stencil-*/**/*.dust',
                    'tests/**/*.dust'
                ],
                dest: 'tmp/templates.js'
            }
        },

        sass: {
            options: {
                style: 'expanded',
                sourcemap: 'none',
                loadPath: [
                    './',
                    './bower_components',
                ],
                require: ['compass/import-once/activate']
            },
            compile_tests: {
                src: 'tests/visual/index.scss',
                dest: 'tmp/index.css'
            }
        },

        autoprefixer: {
            options: {
                browsers: [
                    'iOS >= 6.0',
                    'Android >= 2.3',
                    'last 4 ChromeAndroid versions'
                ]
            },
            prefix_tests: {
                files: [{
                    expand: true,
                    src: 'tmp/*.css' // Overwrite compiled css.
                }]
            },
        },

        watch: {
            scss: {
                files: [
                    '**/*.scss',
                    'tests/visual/*.scss'
                ],
                tasks: ['default']
            }
        },

        connect: {
            server: {
                options: {
                    hostname: '0.0.0.0',
                    port: 3000,
                    useAvailablePort: true,
                    base: '.'
                }
            }
        }
    });

    // Custom task to compile dust templates
    grunt.registerMultiTask('dust', function() {
        this.files.forEach(function(file) {
            var templates = grunt.file.expand(file.src);
            var names = [];
            var fns = [];

            templates.forEach(function(t) {
                var source = grunt.file.read(t);
                var name = path.basename(t, '.dust');
                var fn;

                // If not the tests template, it should be a component template;
                // generate a dust-helper-compatible name and add it to the
                // array of names that will be exposed to the test runner.
                if (path.dirname(t).split(path.sep)[0] !== 'tests') {
                    name = 'c-' + name;
                    names.push(name);
                }

                fn = dust.compile(source, name);
                fns.push(fn);
            });

            if (fns.length > 0) {
                var names = names.map(function(name) {
                    return '"' + name + '"';
                });

                // Wrap the compiled templates as an AMD module. It returns
                // an array that can be used to set up component helpers in the
                // test runner.
                var before = 'define(["dust-full"], function(dust) {';
                var after = 'return [' + names.toString() + '];})';

                grunt.file.write(file.dest, before + fns.join('\n') + after);
            }
        });
    });

    // Tasks
    grunt.registerTask('compile', ['dust', 'sass', 'autoprefixer']);
    grunt.registerTask('serve', ['compile', 'connect:server', 'watch']);
    grunt.registerTask('default', ['serve']);
};
