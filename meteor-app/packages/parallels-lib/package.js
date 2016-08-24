Package.describe({
  name: 'parallels-lib',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.1');

  api.use([
    'reactive-dict',
    'session',
    "practicalmeteor:loglevel@1.2.0_2"
  ], ['client', 'server'], {weak: false, unordered: false});

  api.addFiles([
    'namespace.js',
    'lib/log.js',
    'lib/settings.js',
    'lib/utils.js'
  ], ['server', 'client']);

  api.export("Parallels", ['client', 'server']);
});
