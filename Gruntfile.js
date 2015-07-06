'use strict';

var fs = require('fs'), util = require('util'), busboy = require('connect-busboy'), shell = require('shelljs');

module.exports = function (grunt) {

  var config = {
    dist: 'extensions/chrome/build',
    webApp: 'meteor-app',
    test: 'tests',
    testImageUploads: 'test-scripts/.tmp/',
    chromeExt: 'extensions/chrome/source',
    appRootUrl: {
      local: 'localhost:3000',
      dist: 'makeparallels.herokuapp.com'
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
      server: [
        'meteorServer',
        'watch',
        'connect:clipperServer:keepalive'
      ],
      desktop: [
        'desktopServer',
        'connect:clipperServer:keepalive'
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
      options: {},

      clipperServer: {
        options: {
          port: 9000,
          livereload: 35729,
          hostname: 'localhost',
          base: [
            '<%= config.chromeExt %>',
            '<%= config.testImageUploads %>'
          ],
          middleware: function (connect, options, middlewares) {

            middlewares.unshift(
              busboy(),

              function setCORSHeaders (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                return next();
              },

              function uploadImageRoute (req, res, next) {
                if (req.url !== '/upload') return next();

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
              }
            );

            return middlewares;
          }
        }
      },
      clipperTestServer: {}
    },

    env: {
      dev: {
        src: ".env"
      }
    },

    jasmine: {
      clipperUnitTests: {
        options: {
          display: 'short',
          keepRunner: true,
          outfile: '<%= config.chromeExt %>/tests/_SpecRunner.html',
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
      'env:dev',
      'bowerInstall',
      'sass',
      'jade'
    ];

    if (target === 'local') {
      tasks = tasks.concat(['clean:dist', 'copy:dist', 'preprocess:local', 'crx:dist', 'encode']);
    } else {
      tasks = tasks.concat(['clean:dist', 'copy:dist', 'preprocess:dist', 'crx:dist', 'encode']);
    }

    grunt.task.run(tasks);
  });

  grunt.registerTask('bowerInstall', function () {
    grunt.task.requires('env:dev');
    shell.cd(grunt.config('config').chromeExt);
    shell.exec('bower install');
  });

  grunt.registerTask('meteorReset', function () {
    grunt.task.requires('env:dev');
    shell.cd(grunt.config('config').webApp);
    shell.exec('meteor reset');
  });

  grunt.registerTask('meteorRun', function () {
    grunt.task.requires('env:dev');
    shell.cd(grunt.config('config').webApp);
    shell.exec('meteor run');
  });
  grunt.registerTask('meteorServer', ['env:dev', 'meteorRun']);

  grunt.registerTask('desktopRun', function () {
    grunt.task.requires('env:dev');
    shell.exec('node desktop-app/setup.js');
    shell.exec('node desktop-app/run.js');
  });
  grunt.registerTask('desktopServer', ['env:dev', 'desktopRun']);

  grunt.registerTask('meteorPackageIntegration', function () {
    grunt.task.requires('env:dev');
    shell.cd(grunt.config('config').webApp);
    shell.exec('spacejam test-packages');
  });

  grunt.registerTask('meteorPackagesTestServer', function () {
    grunt.task.requires('env:dev');
    shell.cd(grunt.config('config').webApp);
    shell.exec('meteor test-packages -p 3030');
  });

  grunt.registerTask('neo4jReset', function () {
    grunt.task.requires('env:dev');
    shell.exec('curl -X POST ' + process.env.GRAPHENEDB_URL + '/db/data/cypher --data \'{"query":"MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r"}\' --header "Content-Type: application/json" --header "Accept: application/json"');
  });

  grunt.registerTask('neo4jDrop', function () {
    grunt.task.requires('env:dev');
    shell.exec('neo4j stop && rm -rf ' + process.env.NEO4J_DB_PATH + ' && neo4j start');
  });

  grunt.registerTask('server', 'Run server', function () {
    var tasks = [
      'env:dev',
      'bowerInstall',
      'sass',
      'jade',
      'concurrent:server'
    ];

    grunt.task.run(tasks);
  });

  grunt.registerTask('default', 'server');
};
