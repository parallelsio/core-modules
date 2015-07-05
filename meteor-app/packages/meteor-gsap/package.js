Package.describe({
  name: 'angelcabo:meteor-gsap',
  summary: 'GreenSock Animation Platform : Professional-Grade HTML5 Animation.',
  version: "1.16.0",
  git: "https://github.com/angelcabo/meteor-gsap/"
});

Package.on_use(function (api) {
  api.versionsFrom("METEOR@1.0");

  api.add_files([
    'header.js'
  ], 'server');
  api.add_files([
    'vendor/Draggable.js'
  ], 'client');
  api.add_files([
    'vendor/TweenMax_client.js'
  ], 'client');

  api.add_files([
    'vendor/TweenMax_server.js'
  ], 'server');

  api.add_files([
    'vendor/GreenSock-JS/src/uncompressed/plugins/ColorPropsPlugin.js'
  ], ['client', 'server']);

  // api.add_files([
  //     'exports.js',
  // ], 'server');

  // api.export('TweenLite', ['client', 'server']);
  // api.export('TweenMax', ['client', 'server']);
});
