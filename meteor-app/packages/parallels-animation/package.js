Package.describe({
  name: 'parallels-animation',
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
    "parallels-lib@0.0.2"
  ], 'client', {weak: false, unordered: false});

  api.addFiles([
    'namespace.js',
    'general.js',
    'image.js'
  ], 'client');
});
