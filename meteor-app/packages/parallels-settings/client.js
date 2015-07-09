Meteor.call('__getEnvironmentSettings', function (err, settings) {
  settings.forEach(function (envSetting) {
    Parallels.log.debug('setting env:', envSetting);
    Parallels.settings.set(envSetting.key, envSetting.value);
  });
});
