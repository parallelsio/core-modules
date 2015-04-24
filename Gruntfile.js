'use strict';

var fs = require('fs'), util = require('util');

module.exports = function (grunt) {
  var config = {
    "dist": "extensions/chrome/build",
    "test": "tests",
    "chrome_ext": "extensions/chrome/source",
    "appRootUrl": {
      "local": "localhost:3000",
      "ci": "parallels-ci.meteor.com",
      "dist": "parallels.meteor.com"
    }
  };

  function preprocessChromeExtensionConfig(environment) {
    return {
      options: {
        context: {
          APPROOTURL: config.appRootUrl[environment]
        }
      },
      src: 'tmp/scripts/modules/config.template.js',
      dest: '<%= config.dist %>/scripts/modules/config.js'
    };
  }

  //TODO: lock version of meteor to use with --release [VERSION] while starting meteor?
  grunt.initConfig({
    config: config,
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'extensions/chrome/source',
            src: [
              '_locales/**',
              'bower_components/jquery/dist/jquery.js',
              'bower_components/gsap/src/minified/TweenMax.min.js',
              'bower_components/ddp.js/src/ddp.js',
              'bower_components/q/q.js',
              'bower_components/asteroid/dist/asteroid.chrome.js',
              'bower_components/requirejs/require.js',
              'bower_components/mousetrap/mousetrap.js',
              'html/*',
              'images/*',
              'scripts/**',
              '!scripts/modules/config.template.js',
              'styles/compiled/*',
              'styles/vendor/*',
              'typefaces/*',
              'manifest.json'
            ],
            dest: '<%= config.dist %>/'
          },
          {expand: true, cwd: 'extensions/chrome/source', src: ['scripts/modules/config.template.js'], dest: 'tmp/'}
        ]
      }
    },
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '<%= config.dist %>/*',
              '!<%= config.dist %>/.git*'
            ]
          }
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.chrome_ext %>/scripts/**/*.js',
        '!<%= config.chrome_ext %>/scripts/lib/**/*',
        'test/spec/{,*/}*.js'
      ]
    },
    preprocess: {
      dist: preprocessChromeExtensionConfig('dist'),
      ci: preprocessChromeExtensionConfig('ci'),
      local: preprocessChromeExtensionConfig('local')
    },
    crx: {
      dist: {
        src: '<%= config.dist %>/',
        dest: '<%= config.dist %>/parallels.crx',
        exclude: ['.git', '*.pem'],
        privateKey: 'extensions/chrome/chrome.pem'
      }
    },
    encode: {
      client: {
        src: ['<%= config.dist %>/parallels.crx'],
        dest: '<%= config.dist %>'
      }
    },
    bgShell: {
      e2e: {
        cmd: './end2end-tests/bin/run_tests.sh',
        bg: false,
        stdout: true,
        stderr: true,
        fail: true
      },
      meteor: {
        cmd: [
          'cd meteor-app',
          'meteor run --settings settings.json'
        ].join('&&'),
        bg: false,
        stdout: true,
        stderr: true
      },
      resetTestDb: {
        cmd: 'mongo parallels_test --eval "printjson(db.dropDatabase())"',
        bg: false,
        stdout: true,
        stderr: true,
        fail: true
      },
      meteordebug: {
        cmd: [
          'cd meteor-app',
          'NODE_OPTIONS=\'--debug-brk\' meteor run --settings settings.json'
        ].join('&&'),
        bg: false,
        stdout: true,
        stderr: true
      },
      bowerChromeExt: {
        cmd: [
          'cd <%= config.chrome_ext %>',
          'bower install'
        ].join('&&'),
        bg: false,
        stdout: true,
        stderr: true
      },
      tests: {
        cmd: 'echo "NOTHING HERE YET"',
        bg: false,
        stdout: true,
        stderr: true
      }
    },
    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      chrome: {
        options: {
          sassDir: '<%= config.chrome_ext %>/styles',
          cssDir: '<%= config.chrome_ext %>/styles/compiled'
        }
      }
    },
    sass: {
      options: {
        sourceMap: false
      },
      dist: {
        files: {
          '<%= config.chrome_ext %>/styles/compiled/main.css': '<%= config.chrome_ext %>/styles/main.scss',
          '<%= config.chrome_ext %>/styles/compiled/typefaces.css': '<%= config.chrome_ext %>/styles/typefaces.scss',
          '<%= config.chrome_ext %>/styles/compiled/jquery.tag.override.css': '<%= config.chrome_ext %>/styles/vendor/jquery.tag.override.css'
        }
      }
    },
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          '<%= config.chrome_ext %>/html/web_clipper.html': ['<%= config.chrome_ext %>/templates/web_clipper.jade']
        }
      }
    },
    concurrent: {
      serverdebug: [
        'bgShell:meteordebug',
        'watch'
      ],
      server: [
        'bgShell:meteor',
        'watch'
      ],
      options: {
        limit: 5,
        logConcurrentOutput: true
      }
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: '<%= config.chrome_ext %>/scripts/**/*.js',
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      sass: {
        files: ['<%= config.chrome_ext %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.chrome_ext %>/styles/compiled/{,*/}*.css', '<%= config.chrome_ext %>/styles/vendor/{,*/}*.css'],
        tasks: [],
        options: {
          livereload: true
        }
      },
      templates: {
        files: ['<%= config.chrome_ext %>/templates/{,*/}*.jade'],
        tasks: ['jade'],
        options: {
          livereload: true
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.chrome_ext %>/html/*.html',
          '<%= config.chrome_ext %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= config.chrome_ext %>/manifest.json',
          '<%= config.chrome_ext %>/_locales/{,*/}*.json'
        ]
      }
    },
    connect: {
      options: {

      },
      chrome: {
        options: {
          port: 9000,
          livereload: 35729,
          // change this to '0.0.0.0' to access the server from outside
          hostname: 'localhost',
          open: false,
          base: [
            '<%= config.chrome_ext %>',
            './'
          ]
        }
      },
      test : { }
    },
    env : {
      ci : {
        PARALLELS_DOMAIN : 'parallels-ci.meteor.com'
      },
      local : {
        PARALLELS_DOMAIN : '127.0.0.1:3000'
      }
    },
    jasmine: {
      all: {
        options: {
          display: 'short',
          keepRunner: true,
          outfile : '<%= config.chrome_ext %>/tests/_SpecRunner.html',
          specs: '<%= config.chrome_ext %>/tests/*spec.js',
          helpers: '<%= config.chrome_ext %>/tests/*helper.js',
          host: 'http://127.0.0.1:8000/',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: '<%= config.chrome_ext %>/scripts/lib/requireConfig.js',
            requireConfig: {
              baseUrl: '../scripts/',
              paths: {
                'Squire': '../bower_components/squire/src/Squire',
                'browser': '../tests/stubs/browser.stub',
                'modules/server': '../tests/stubs/server.stub'
              }
            }
          },
          styles: [
            '<%= config.chrome_ext %>/styles/**/*.css'
          ]
        }
      }
    }
  });

  // Load all grunt tasks
  require('matchdep').filterDev(['grunt-*', '!grunt-template-jasmine-requirejs']).forEach(grunt.loadNpmTasks);

  //chromeOptions needs the extension to be a Base64 encoded string
  //so encode it, then build a requirejs module for it
  grunt.registerMultiTask('encode', 'Convert the .crx to a Base64 encoded string', function () {
    this.files.forEach(function (filePair) {
      var dest = filePair.dest;
      filePair.src.map(function (file) {
        var binaryData = fs.readFileSync(file);

        // convert binary data to base64 encoded string
        var encoded = new Buffer(binaryData).toString('base64');

        // setup as json
        var moduleTemplate = '{\n' +
          '   "base64":"%s"\n' +
          '}';

        var output = util.format(moduleTemplate, encoded);

        var fileName = file.substr(file.lastIndexOf('/'));
        file = dest + fileName + '.json';

        grunt.file.write(file, output);
      });
    });
  });

  // builds the chrome extension
  grunt.registerTask('build', 'Build chrome extension', function (target) {
    var tasks = [
      'bgShell:bowerChromeExt',
      'sass',
      'jade'
    ];

    if (target === 'local') {
      tasks = tasks.concat(['clean:dist', 'copy:dist', 'preprocess:local', 'crx:dist', 'encode']);
    } else if (target === 'ci') {
      tasks = tasks.concat(['clean:dist', 'copy:dist', 'preprocess:ci', 'crx:dist', 'encode']);
    } else {
      tasks = tasks.concat(['clean:dist', 'copy:dist', 'preprocess:dist', 'crx:dist', 'encode']);
    }

    grunt.task.run(tasks);
  });

  grunt.registerTask('server', 'Run server', function (target) {
    if (target !== 'debug')
      target = '';

    var tasks = [
      'jshint',
      'bgShell:bowerChromeExt',
      'sass',
      'jade',
      'connect:chrome',
      'concurrent:server' + target
    ];

    grunt.task.run(tasks);
  });

  //grunt.registerTask('test', 'Run the testing tasks', function (target) {
  //  if (target !== 'debug')
  //    target = '';
  //
  //  grunt.task.run('bgShell:tests' + target);
  //});
  grunt.registerTask('test', ['connect:test', 'jasmine']);

  grunt.registerTask('e2e-tests', 'Run integration tests', function (target) {
    var tasks;

    if (target === 'ci') {
      tasks = ['env:ci', 'build:ci'];
    } else {
      tasks = ['env:local', 'build:local'];
    }

    tasks = tasks.concat(['bgShell:resetTestDb', 'bgShell:e2e']);

    grunt.task.run(tasks);
  });


  grunt.registerTask('default', 'server');
};
