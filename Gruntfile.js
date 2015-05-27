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
                options: {
                    isComponent: true
                },
                src: ['*.dust', 'bower_components/stencil-*/**/*.dust'],
                dest: 'tmp/templates.js'
            },
            tests: {
                src: 'tests/visual/tests.dust',
                dest: 'tmp/tests.js'
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

    // Tasks
    grunt.registerTask('compile', ['dust:templates', 'dust:tests', 'sass', 'autoprefixer']);
    grunt.registerTask('serve', ['compile', 'connect:server', 'watch']);
    grunt.registerTask('default', ['serve']);

    grunt.registerMultiTask('dust', function() {
        var defaults = {
            isComponent: false,
        };
        var options = this.options(defaults);

        this.files.forEach(function(file) {
            var templates = grunt.file.expand(file.src);
            var names = [];
            var fns = [];

            templates.forEach(function(t) {
                var source = grunt.file.read(t);
                var name = path.basename(t, '.dust');
                var fn;

                if (options.isComponent) {
                    name = 'c-' + name;
                }

                fn = dust.compile(source, name);

                names.push(name);
                fns.push(fn);
            });

            if (fns.length > 0) {
                var names = names.map(function(name, i) {
                    return '"' + name + '"';
                });
                var before = 'define(["dust-full"], function(dust) {';
                var after = 'return [' + names.toString() + '];})';

                grunt.file.write(file.dest, before + fns.join("\n") + after);
            }
        });
    });
};
