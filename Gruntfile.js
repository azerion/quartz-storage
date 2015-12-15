module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
                ' * <%= pkg.name %> - version <%= pkg.version %> \n' +
                ' * <%= pkg.description %>\n' +
                ' *\n' +
                ' * <%= pkg.author %>\n' +
                ' * Build at <%= grunt.template.today("dd-mm-yyyy") %>\n' +
                ' * Released under GNUv3 License \n' +
                ' */\n',
        typescript: {
            dist: {
                src: [
                    'ts/*.ts'
                ],
                dest: 'bin/<%= pkg.name %>.js',
                options: {
                    module: 'amd',
                    target: 'es5',
                    sourceMap: true,
                    declaration: true,
                    noImplicitAny: true
                }
            }
        },
        watch: {
            files: ['ts/**/*.ts'],
            tasks: ['typescript']
        },
        uglify: {
            options: {
                compress: {},
                mangle: true,
                beautify: false,
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                    'bin/<%= pkg.name %>.min.js': [
                        'bin/<%= pkg.name %>.js'
                    ]
                }
            }
        },
        clean: {
            dist: ['bin/*']
        },
        typedoc: {
            dist: {
                options: {
                    mode: 'file',
                    out: './docs',
                    name: 'Quartz',
                    target: 'es5'
                },
                src: ['./vendor/**/*.d.ts','./ts/**/*']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typedoc');

    grunt.registerTask('dist', ['clean', 'typescript', 'uglify']);
    grunt.registerTask('dev', ['typescript:dist', 'watch']);
};
