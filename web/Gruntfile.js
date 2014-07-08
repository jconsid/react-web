'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        meta: {
            src: {
                mainjs: 'app/js/',
                test: 'test/',
            }
        },
        watch: {
           js: {
                files: [
                        '<%= meta.src.mainjs %>*.js',
                        '<%= meta.src.test %>*Spec.js'
                ],
                tasks: ['jasmine:test']
            },
            options: {
                spawn: false
            },
            less: {
                files: ['app/styles/*.less'],
                tasks: ['less:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/*.html',
                    'app/styles/{,*/}*.css',
                    'app/scripts/{,*/}*.js',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                ]
            }
        },
        less: {
            server: {
                options: {
                    paths: ['app/components/bootstrap/less', 'app/styles']
                },
                files: {
                    'app/styles/main.css': 'app/styles/main.less'
                }
            }
        },
        jshint: {
          files: ['Gruntfile.js', 'app/js/**/*.js'],
          options: {
            jshintrc: '.jshintrc',
          }
        },
        karma: {
          unit: {
            configFile: 'config/karma.conf.js'
          }
        },
        jasmine: {
           test: {
            src: '<%= meta.src.mainjs %>*.js',
            options: {
                vendor: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/jasmine-jquery/lib/jasmine-jquery.js'
                    ],
                    specs: '<%= meta.src.test %>*Spec.js'
                }
            }
            
       }

    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    
    /*grunt.registerTask('server', function (target) {

        grunt.task.run([
            'less:server',
            'jasmine:test',
            'watch',
        ]);
    });*/
};
