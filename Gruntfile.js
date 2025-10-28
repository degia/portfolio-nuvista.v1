module.exports = function(grunt) {
grunt.loadNpmTasks('grunt-postcss');


  require('load-grunt-tasks')(grunt);

var PathConfig = require('./grunt-settings.js');

  // tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: PathConfig,

    //clean files
    clean: {
      options: { force: true },
      temp: {
        src: ["<%= config.cssDir %>**/*.map", "<%= config.imgDir %>", "<%= config.cssMainFileDir %><%= config.cssMainFileName %>.css.map", "./jpgtmp.jpg"]
      }
    },

    uncss: {
      dist: {
        options: {
          ignoreSheets : [
            'css/bootstrap.css', 'vendors/font-awesome/css/font-awesome.css', 'vendors/animate/animate.css'
          ]
        },

        files: {
          'css/intro.css': ['intro.html']
        }
      }
    },

    postcss: {
      dev: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({
                    browsers: [
      'Chrome >= 35', 
      'Firefox >= 38', 
      'Edge >= 12',
      'Explorer >= 10',
      // Out of leniency, we prefix these 1 version further back than the official policy.
      'iOS >= 8',
      'Safari >= 8',
      // The following remain NOT officially supported, but we're lenient and include their prefixes to avoid severely breaking in them.
      'Android 2.3',
      'Android >= 4',
      'Opera >= 12'
    ]

            })
          ]
        },
        src: ['<%= config.cssDir %>*.css',
              '<%= config.cssMainFileDir %><%= config.cssMainFileName %>.css'
              ]
      },
      dist: {
        options: {
          map: false,
          processors: [
            require('autoprefixer')({
              browsers: [
              'Chrome >= 35', 
              'Firefox >= 38', 
              'Edge >= 12',
              'Explorer >= 10',
              // Out of leniency, we prefix these 1 version further back than the official policy.
              'iOS >= 8',
              'Safari >= 8',
              // The following remain NOT officially supported, but we're lenient and include their prefixes to avoid severely breaking in them.
              'Android 2.3',
              'Android >= 4',
              'Opera >= 12'
            ]
            })
          ]
        },
        src: ['<%= config.cssDir %>*.css',
              '<%= config.cssMainFileDir %><%= config.cssMainFileName %>.css'
              ]
      }
    },

    //sass
    sass: {
      options: PathConfig.hasBower,
      dev: {
        options: {
          sourceMap: true,
          style: 'nested'
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.sassDir %>',
            src: ['**/*.scss', '!<%= config.sassMainFileName %>.scss'],
            dest: '<%= config.cssDir %>',
            ext: '.css'
          },
          {src: '<%= config.sassDir %><%= config.sassMainFileName %>.scss', dest: '<%= config.cssMainFileDir %><%= config.cssMainFileName %>.css'}
        ]
      },
      dist: {
        options: {
          sourceMap: false,
          style: 'nested'
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.sassDir %>',
            src: ['**/*.scss', '!<%= config.sassMainFileName %>.scss'],
            dest: '<%= config.cssDir %>',
            ext: '.css'
          },
          {src: '<%= config.sassDir %><%= config.sassMainFileName %>.scss', dest: '<%= config.cssMainFileDir %><%= config.cssMainFileName %>.css'}
        ]
      },
      min: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.sassDir %>',
            src: ['**/*.scss', '!<%= config.sassMainFileName %>.scss'],
            dest: '<%= config.cssDir %>',
            ext: '.min.css'
          },
          {src: '<%= config.sassDir %><%= config.sassMainFileName %>.scss', dest: '<%= config.cssMainFileDir %><%= config.cssMainFileName %>.min.css'}
        ]
      }
    },

    //watcher project
    watch: {
      options: {
        debounceDelay: 1,
      },

      php: {
          files: ['*.php'],
      },

      images: {
        files: ['<%= config.imgSourceDir %>**/*.*'],
        tasks: [/*'img:jpg', 'newer:pngmin:all', 'newer:svgmin'*/ 'newer:copy:images'],
        options: {
            spawn: false
        }
      },
      svgSprites: {
        files: ['<%= config.imgSourceDir %>svg-icons/*.*'],
        tasks: ['svgstore', 'svg2string'],
        options: {
            spawn: false
        }
      },
      css: {
        files: ['<%= config.sassDir %>**/*.scss'],
        tasks: ['sass:dev', 'postcss:dev'],
        options: {
            spawn: false,
        }
      }
    },

    copy: {
      images: {
        expand: true,
        cwd: '<%= config.imgSourceDir %>',
        src: '**',
        dest: '<%= config.imgDir %>',
        flatten: true,
        filter: 'isFile',
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: '<%= config.imgSourceDir %>',
          src: ['**/*.{jpg,gif}'],   
          dest: '<%= config.imgDir %>'
        }]
      }
    },

    svgmin: {
      options: {
       plugins: [
         {
             removeViewBox: false
         }, {
             removeUselessStrokeAndFill: false
         }
       ]
      },
      dist: {
       files: [
          {
            expand: true,
            src: ['**/*.svg'],
            cwd: '<%= config.imgSourceDir %>',
            dest: '<%= config.imgDir %>'
          }
        ]
      }
    },

    svgstore: {
      options: {
        prefix : 'icon-', // This will prefix each ID
        svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
          viewBox : '0 0 100 100',
          xmlns: 'http://www.w3.org/2000/svg'
        },
        cleanup: ['fill']
      },
      your_target: {
        files: {
          '<%= config.imgDir %>svg-sprites/sprite.svg': ['<%= config.imgDir %>svg-icons/*.svg'],
        },
      },
    },

    svg2string: {
      elements: {
        options: {
          template: '(window.SVG_SPRITES = window.SVG_SPRITES || {})["[%= filename %]"] = [%= content %];',
          wrapLines: false
        },
        files: {
          '<%= config.jsDir %>svg-sprites.js': [
            // '<%= config.imgDir %>sprite.svg',
            '<%= config.imgDir %>svg-sprites/sprite.svg'
          ]
        }
      }
    },

    // lossy image optimizing (compress png images with pngquant)
    pngmin: {
      all: {
        options: {
          ext: '.png',
          force: true
        },
        files: [
          {
            expand: true,
            src: ['**/*.png'],
            cwd: '<%= config.imgSourceDir %>',
            dest: '<%= config.imgDir %>'
          }
        ]
      },
    },

    //Keep multiple browsers & devices in sync when building websites.
    browserSync: {
      dev: {
        bsFiles: {
          src : ['*.html','<%= config.cssDir %>*.css', '*.css']
        },
        options: {
            proxy: 'local.roxine-new.net', //our PHP server
            port: 8080, // our new port
            open: true,
            watchTask: true
        }
      }
    },

    php: {
      dev: {
            options: {
                port: 8010,
                base: ''
            }
        }
    },

    notify: {
      options: {
        enabled: true,
        max_js_hint_notifications: 5,
        title: "WP project"
      },
      watch: {
        options: {
          title: 'Task Complete',  // optional
          message: 'SASS finished running', //required
        }
      },
    }, 

    csscomb: {
      all: {
        expand: true,
        src: ['css/*.css','css/**/*.css','<%= config.cssDir %>*.css', 
              '<%= config.cssMainFileDir %><%= config.cssMainFileName %>.css',
              '!<%= config.cssDir %>ie.css',
              '!<%= config.cssDir %>ie8.css'
              ],
        ext: '.css'
      },
      dist: {
        expand: true,
        files: {
          // '<%= config.cssMainFileDir %><%= config.cssMainFileName %>.css' : '<%= config.cssMainFileDir %><%= config.cssMainFileName %>.css'
          'css/main.css' : ['css/main.css'],
          'css/theme-v2.css' : ['css/theme-v2.css'],
          'css/theme-v3.css' : ['css/theme-v3.css'],
          'css/theme-v4.css' : ['css/theme-v4.css'],
          'css/theme-v5.css' : ['css/theme-v5.css'],
          'css/theme-v6.css' : ['css/theme-v6.css']
        },
      }
    },

    cmq: {
      options: {
        log: false
      },
      all: {
        files: [
          {
            expand: true,
            src: ['**/*.css', '!bootstrap.css'],
            cwd: '<%= config.cssDir %>',
            dest: '<%= config.cssDir %>'
          }
        ]
      },
      dist: {
        files: {
          '<%= config.cssMainFileDir %><%= config.cssMainFileName %>.css' : '<%= config.cssMainFileDir %><%= config.cssMainFileName %>.css'
        },
      }
    },

    'sftp-deploy': {
      build: {
        auth: {
          host: '<%= config.sftpServer %>',
          port: '<%= config.sftpPort %>',
          authKey: {
                    "username": "<%= config.sftpLogin %>",
                    "password": "<%= config.sftpPas %>"
                  }
        },
        cache: 'sftpCache.json',
        src: 'css',
        dest: '<%= config.sftpDestination %>',
        //exclusions: ['/path/to/source/folder/**/.DS_Store', '/path/to/source/folder/**/Thumbs.db', 'dist/tmp'],
        serverSep: '/',
        concurrency: 4,
        progress: true
      }
    }

  });

// run task
//dev 
  //watch
  grunt.registerTask('w', ['watch']);
  //browser sync
  grunt.registerTask('bs', ['browserSync']);

  //watch + browser sync
  grunt.registerTask('dev', ['php', 'browserSync', 'watch']);

  //create svg sprite
  grunt.registerTask('svgsprite', ['svgmin', 'svgstore', 'svg2string']);
  
  grunt.registerTask('default', ['dev']);

  // upload to server
  grunt.registerTask('sftp', ['sftp-deploy']);

//finally 
  //css beautiful
  grunt.registerTask('cssbeauty', ['sass:dist', 'cmq:dist', 'postcss:dist', 'csscomb:dist']);
  //img minify
  grunt.registerTask('imgmin', ['imagemin', 'pngmin:all', 'svgmin']);

  //final build
  grunt.registerTask('dist', ['clean:temp', 'imgmin', 'cssbeauty']);

};