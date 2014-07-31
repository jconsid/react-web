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
          html: '<%=meta.dist %>app/index.html'
        },
        usemin: {
          html: '<%=meta.dist %>app/index.html'
        },
        cssmin: {
          /* Kör less med cleancss:true ist */
          client: {
            files: {
              '<%=meta.dist %>app/style/css/client.min.css': ['<%=meta.dist %>app/style/css/client.css']
            }
          }
        },
        concat: {
          options: {
            stripBanners: true,
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %> */',
          },
          js: {
            src: ['<%=meta.dist %>app/lib/angular/angular.js','<%=meta.dist %>app/lib/angular/angular-cookies.js','<%=meta.dist %>app/lib/angular/angular-route.js','<%=meta.dist %>app/lib/angular/animate.min.js'],
            dest: '<%=meta.dist %>app/lib/angular/ng-all.min.js'
          }
        },
        uglify: {
            options: {
              beautify:true,
              banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\nConsid 2014 */',
              mangle: {
                except: ['window','angular','vertx','$','jQuery','console','module','document']
              }
            },
            client: {
              files: {
                '<%=meta.dist %>app/js/client.min.js': [
                  '<%=meta.dist %>app/js/app.js',
                  '<%=meta.dist %>app/js/controllers/anmalanCtrl.js',
                  '<%=meta.dist %>app/js/controllers/registerCtrl.js',
                  '<%=meta.dist %>app/js/controllers/editAnmalanCtrl.js',
                  '<%=meta.dist %>app/js/controllers/loginCtrl.js',
                  '<%=meta.dist %>app/js/controllers/listCtrl.js',
                  '<%=meta.dist %>app/js/controllers/msgCtrl.js',
                  '<%=meta.dist %>app/js/controllers/aboutCtrl.js',
                  '<%=meta.dist %>app/js/services.js']
              }
            },
            vertbus: {
              files: {
                '<%=meta.dist %>app/lib/vertxbus.min.js': ['<%=meta.dist %>app/lib/vertxbus.js']
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
          js: ['<%=meta.dist %>app/js/controllers/*.js',
              '<%=meta.dist %>app/js/*.js','!<%=meta.dist %>app/js/client.min.js',
              '<%=meta.dist %>app/lib/**/*.js', '!<%=meta.dist %>app/lib/**/*.min.js',
              '!<%=meta.dist %>app/lib/sockjs-min-0.3.4.js'],
          css: ['<%=meta.dist %>app/lib/**/*.css'],
          less: ['<%=meta.dist %>app/style/**/*.less', '<%=meta.dist %>app/lib/**/*.less'],
          fonts: ['<%=meta.dist %>app/lib/bootstrap-3.1.1-dist/fonts/*'],
          dist: ["<%=meta.dist %>"]
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
        /*less: {
            server: {
                options: {
                    paths: ['app/components/bootstrap/less', 'app/styles']
                },
                files: {
                    'app/styles/main.css': 'app/styles/main.less'
                }
            }
        },*/
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
      'clean:dist',
      'copy',
      'useminPrepare',
      'less:compileClient',
      'uglify:client',
      'uglify:vertbus',
      'clean-build',
      'usemin',
      'compress:dist'
    ]);
};
