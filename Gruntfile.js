module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            prod: {
                src: [
                    'ts/**/*.ts'
                ],
                dest: 'bin/<%= pkg.name %>-<%= pkg.version %>.js',
                options: {
                    module: 'amd',
                    target: 'es5',
                    basePath: 'ts',
                    sourceMap: true,
                    declaration: true
                }
            }
        },
        watch: {
            files: ['ts/**/*.ts'],
            tasks: ['typescript:prod']
        },
        uglify: {
            options: {
                compress: {},
                mangle: true,
                beautify: false
            },
            prod: {
                files: {
                    'bin/<%= pkg.name %>-<%= pkg.version %>.min.js': [
                        'bin/<%= pkg.name %>-<%= pkg.version %>.js'
                    ]
                }
            }
        },
        clean: {
            prod: ['bin/*']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('prod', ['clean:prod', 'typescript:prod', 'uglify:prod']);
    grunt.registerTask('dev', ['typescript:prod']);
};
