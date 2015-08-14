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
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [ 'bin/*.js' ]
                }
            }
        },
        typescript: {
            dist: {
                src: [
                    'ts/**/*.ts'
                ],
                dest: 'bin/<%= pkg.name %>.js',
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-banner');

    grunt.registerTask('dist', ['clean', 'typescript', 'uglify', 'usebanner']);
    grunt.registerTask('dev', ['typescript:prod']);
};
