'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            src: {
                mainjs: 'app/js/',
                test: 'test/',
            },
            dist: 'dist/'
        },
        useminPrepare: {
          html: '<%=meta.dist %>app/index.html'/*,
          css: ['<%=meta.dist %>app/style/css/client.css']*/
        },
        usemin: {
          html: '<%=meta.dist %>app/index.html'
        },
        /* Kör less med cleancss:true ist */
        cssmin: {
          
          client: {
            files: {
              '<%=meta.dist %>app/style/css/vendor.min.css': ['<%=meta.dist %>app/style/css/vendor.css']
            }
          }
        },
        concat: {
          options: {
            separator: ';',
            stripBanners: true,
            
            /*banner: '/*\n' +
             'AngularJS v1.2.15\n' +
             '(c) 2010-2014 Google, Inc. http://angularjs.org\n' +
             'License: MIT\n' +
             '\n',*/
          },
          js: {
            src: ['<%=meta.dist %>app/lib/jquery-2.1.0.min.js',
                  '<%=meta.dist %>app/lib/sockjs-min-0.3.4.js',
                  '<%=meta.dist %>app/lib/angular/angular.min.js',
                  '<%=meta.dist %>app/lib/angular/angular-cookies.min.js',
                  '<%=meta.dist %>app/lib/angular/angular-route.min.js',
                  '<%=meta.dist %>app/lib/angular/angular-animate.min.js',
                  '<%=meta.dist %>app/lib/ngQuickDate/ng-quick-date.min.js',
                  '<%=meta.dist %>app/lib/bootstrap-3.1.1-dist/js/bootstrap.min.js',
                  '<%=meta.dist %>app/lib/vertxbus.tmp.js'],
            dest: '<%=meta.dist %>app/lib/vendor.min.js',
          },
          vendorcss: {
            src: ['<%=meta.dist %>app/lib/ngQuickDate/ng-quick-date-default-theme.css',
                  '<%=meta.dist %>app/lib/ngQuickDate/ng-quick-date.css'],
            dest: '<%=meta.dist %>app/style/css/vendor.css',
          },
          allcss: {
            src: ['app/style/css/client.css',
                  '<%=meta.dist %>app/style/css/vendor.min.css'],
            dest: '<%=meta.dist %>app/style/css/all.min.css',
          }
        },
        uglify: {
            options: {
              beautify:true,
              banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\nConsid 2014 */',
              mangle: {
                except: ['window','angular','vertx','$','jQuery','console','module','document']
              }/*,
              sourceMap: true,
              sourceMapName: 'names.map'*/
            },
            client: {
              files: {
                '<%=meta.dist %>app/js/client.min.js': [
                  '<%=meta.dist %>app/js/app.js',
                  '<%=meta.dist %>app/js/services/*.js',
                  '<%=meta.dist %>app/js/controllers/*.js',
                  '<%=meta.dist %>app/js/services.js']
              }
            },
            vertbus: {
              files: {
                '<%=meta.dist %>app/lib/vertxbus.tmp.js': ['<%=meta.dist %>app/lib/vertxbus.js']
              }
            }
        },
        copy: {
          main: {
            src: 'app/**',
            dest: '<%=meta.dist %>',
          },
        },
        compress: {
          dist: {
            options: {
              archive: 'build.zip'
            },
            files: [
              {src: ['dist/**']} // includes files in path
            ]
          }
        },
        clean: {
          js: ['<%=meta.dist %>app/js/controllers/*.js','<%=meta.dist %>app/js/services/*.js',
              '<%=meta.dist %>app/js/*.js','!<%=meta.dist %>app/js/client.min.js',
              '<%=meta.dist %>app/lib/**/*.js', '!<%=meta.dist %>app/lib/**/*.min.js',
              '!<%=meta.dist %>app/lib/sockjs-min-0.3.4.js'],
          css: ['<%=meta.dist %>app/lib/**/*.css'],
          less: ['<%=meta.dist %>app/style/**/*.less', '<%=meta.dist %>app/lib/**/*.less'],
          fonts: ['<%=meta.dist %>app/lib/bootstrap-3.1.1-dist/fonts/*'],
          dist: ["<%=meta.dist %>"],
          temp: [".tmp/*"]
        },
        watch: {
           js: {
                files: [
                        '<%= meta.src.mainjs %>**/*.js',
                        '<%= meta.src.test %>*Spec.js'
                ],
                tasks: ['jasmine:test']
            },
            options: {
                spawn: false
            },
            less: {
                files: ['app/style/less/*.less'],
                tasks: ['less:compileClient']
            }/*,
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/*.html',
                    'app/styles/{,*remove/}*.css',
                    'app/scripts/{,*remove/}*.js',
                    'app/images/{,*remove/}*.{png,jpg,jpeg,gif,webp,svg}',
                ]
            }*/
        },
        less: {
          compileClient: {
            options: {
              paths: ['app/lib/bootstrap-3.1.1-dist/less', 'app/lib/bootstrap-3.1.1-dist/less/mixins', 'app/lib/bootstrap-3.1.1-dist/less/swatch'],
              cleancss:true
            },
            files: {
              'app/style/css/client.css': 'app/style/less/client.less'
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
            src: '<%= meta.src.mainjs %>**/*.js',
            options: {
                vendor: [
                    'app/lib/angular/angular.js',
                    'app/lib/angular/angular-route.js',
                    'app/lib/angular/angular-cookies.js',
                    'app/lib/angular/angular-animate.min.js',
                    'test/lib/angular/angular-mocks.js',
                    'app/lib/jquery-2.1.0.min.js'
                    ],
                    specs: 'test/unit/**/*.js'
                }
            }
            
       }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('clean-build', [
      'clean:js',
      'clean:css',
      'clean:less',
      'clean:fonts'
    ]);

    grunt.registerTask('build', [
      'clean:temp',
      'clean:dist',
      'copy',
      'useminPrepare',
      'less:compileClient',
      'uglify:client',
      'uglify:vertbus',
      'concat:js',
      'concat:vendorcss',
      'cssmin:client',
      'concat:allcss',
      'clean-build',
      'usemin',
      'compress:dist',
      'clean:temp'
    ]);
};
