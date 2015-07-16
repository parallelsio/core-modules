Package.describe({
  name: 'angelcabo:mousetrap',
  summary: "Mousetrap packaged for Meteor",
  version: "1.0.0",
  git: "https://github.com/angelcabo/mousetrap.git"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.2.2');

  api.addFiles('mousetrap.js', 'client');
	api.addFiles('export-mousetrap.js', 'client');
	api.addFiles('plugins/global-bind/mousetrap-global-bind.js', 'client');

});
