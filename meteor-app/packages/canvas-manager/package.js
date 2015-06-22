Package.describe({
  name: 'angelcabo:canvas-manager',
  version: '0.0.1',
  summary: 'Manages a canvas object',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('canvas-manager.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('angelcabo:canvas-manager');
  api.addFiles('canvas-manager-tests.js');
});
