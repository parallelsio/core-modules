'use strict';

var fs = require('fs'), util = require('util'), busboy = require('connect-busboy');

module.exports = function (grunt) {

  var target = grunt.option('target') || 'local';

  var config = {
    dist: 'extensions/chrome/build',
    test: 'tests',
    testImageUploads: 'end2end-tests/.tmp/',
    chromeExt: 'extensions/chrome/source',
    appRootUrl: {
      local: 'localhost:3000',
      ci: 'parallels-ci.meteor.com',
      dist: 'parallels.meteor.com'
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
        '<%= config.chromeExt %>/scripts/**/*.js',
        '!<%= config.chromeExt %>/scripts/lib/**/*',
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
   
      meteorTests: {
        cmd: [
          'cd meteor-app',
          'meteor --test --release velocity:METEOR@1.1.0.2_2 --settings settings.json'
        ].join('&&'),
        bg: false,
        stdout: true,
        stderr: true,
        fail: true
      },
   
      resetTestDb: {
        cmd: 'mongo parallels_test --eval "printjson(db.dropDatabase())"',
        bg: false,
        stdout: true,
        stderr: true,
        fail: true
      },

      resetMeteorDb: {
        cmd: [
          'cd meteor-app',
          'meteor reset'
        ].join('&&'),
        bg: false,
        stdout: true,
        stderr: true,
        fail: true
      },

      resetNeo4jDb: {
        cmd: 'curl -X POST http://localhost:7474/db/data/cypher --data \'{"query":"MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r"}\' --header "Content-Type: application/json" --header "Accept: application/json"',
        bg: false,
        stdout: true,
        stderr: true,
        fail: false
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
          'cd <%= config.chromeExt %>',
          '../../../node_modules/.bin/bower install'
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
   
    sass: {
      options: {
        sourceMap: false
      },
      dist: {
        files: {
          '<%= config.chromeExt %>/styles/compiled/main.css': '<%= config.chromeExt %>/styles/main.scss',
          '<%= config.chromeExt %>/styles/compiled/typefaces.css': '<%= config.chromeExt %>/styles/typefaces.scss',
          '<%= config.chromeExt %>/styles/compiled/jquery.tag.override.css': '<%= config.chromeExt %>/styles/vendor/jquery.tag.override.css'
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
          '<%= config.chromeExt %>/html/web_clipper.html': ['<%= config.chromeExt %>/templates/web_clipper.jade']
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
  
    watch: {
      js: {
        files: '<%= config.chromeExt %>/scripts/**/*.js',
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
   
      sass: {
        files: ['<%= config.chromeExt %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass']
      },
   
      gruntfile: {
        files: ['Gruntfile.js']
      },
   
      styles: {
        files: ['<%= config.chromeExt %>/styles/compiled/{,*/}*.css', '<%= config.chromeExt %>/styles/vendor/{,*/}*.css'],
        tasks: [],
        options: {
          livereload: true
        }
      },
   
      templates: {
        files: ['<%= config.chromeExt %>/templates/{,*/}*.jade'],
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
          '<%= config.chromeExt %>/html/*.html',
          '<%= config.chromeExt %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= config.chromeExt %>/manifest.json',
          '<%= config.chromeExt %>/_locales/{,*/}*.json'
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
            '<%= config.chromeExt %>',
            '<%= config.testImageUploads %>'
          ],
          middleware: function (connect, options) {
            var middlewares = [
              connect().use(busboy()),

              // Add CORS Headers for testing Image Upload
              connect().use(function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                return next();
              }),

              // Add mock upload server for testing Image Upload
              connect().use('/upload', function (req, res) {
                if (req.method === 'OPTIONS') {
                  res.statusCode = 200;
                  res.end();
                } else {
                  var fstream;
                  req.pipe(req.busboy);
                  req.busboy.on('file', function (fieldname, file, filename) {
                    fstream = fs.createWriteStream(__dirname + '/' + config.testImageUploads + filename);
                    file.pipe(fstream);
                    fstream.on('close', function () {
                      res.statusCode = 200;
                      res.end();
                    });
                  });
                }
              })
            ];

            // add the static paths in options.base
            options.base.forEach(function (base) {
              middlewares.unshift(connect.static(base));
            });

            return middlewares;
          }
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
          outfile : '<%= config.chromeExt %>/tests/_SpecRunner.html',
          specs: '<%= config.chromeExt %>/tests/*spec.js',
          helpers: '<%= config.chromeExt %>/tests/*helper.js',
          host: 'http://127.0.0.1:8000/',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: '<%= config.chromeExt %>/scripts/lib/requireConfig.js',
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
            '<%= config.chromeExt %>/styles/**/*.css'
          ]
        }
      }
    }
  });

  // Load all grunt tasks
  require('matchdep').filterDev(['grunt-*', '!grunt-cli', '!grunt-template-jasmine-requirejs']).forEach(grunt.loadNpmTasks);

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
    require('dotenv').load();

    if (target !== 'debug')
      target = '';

    var tasks = [
      'bgShell:bowerChromeExt',
      'sass',
      'jade',
      'connect:chrome',
      'concurrent:server' + target
    ];

    grunt.task.run(tasks);
  });

  grunt.registerTask('all-tests', 'Run units + integration tests', [
    'jshint',
    'bgShell:meteorTests',
    'connect:test',
    'connect:chrome',
    'jasmine',
    'env:' + target,
    'build:' + target,
    'bgShell:resetTestDb',
    'bgShell:e2e'
  ]);

  grunt.registerTask('unit-tests', 'Run unit tests', ['jshint', 'bgShell:meteorTests', 'connect:test', 'jasmine']);

  grunt.registerTask('e2e-tests', 'Run integration tests', ['jshint', 'env:' + target, 'connect:chrome', 'build:' + target, 'bgShell:resetTestDb', 'bgShell:e2e']);

  grunt.registerTask('default', 'server');
};
