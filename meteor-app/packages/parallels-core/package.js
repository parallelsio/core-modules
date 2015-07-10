Package.describe({
  name: 'parallels-core',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    "xolvio:inverter@0.2.0",
    "chuangbo:marked@0.3.2_4",
    "practicalmeteor:loglevel@1.2.0_1",
    "awatson1978:mousetrap@1.0.2"
  ], 'client', {weak: false, unordered: false});

  api.addFiles([
    'vendor/flocking/flocking-no-jquery.min.js',
    'vendor/particle.emitter.js/particle.emitter.js',
    'vendor/two/two.min.js',
    'vendor/verge/verge.js',
    'log.js',
    'namespace.js',
    'no-reload.js',
    'key-bindings.js',
    'markdown-config.js'
  ], 'client');

  api.export("Parallels", 'client');
});
