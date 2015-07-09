Meteor.methods({
  __getEnvironmentSettings: function () {
    var env = [];

    for (var key in process.env) {
      if (process.env.hasOwnProperty(key) && key.indexOf('PARALLELS_') === 0) {
        env.push({key: key, value: process.env[key]});
        Parallels.log.debug('setting env:', key, process.env[key]);
        Parallels.settings.set(key, process.env[key]);
      }
    }

    return env;
  }
});
