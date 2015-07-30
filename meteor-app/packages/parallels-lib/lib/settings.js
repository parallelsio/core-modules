if (Meteor.isClient) {
  Env = new Meteor.Collection('parallels.env');
  Meteor.subscribe('settings', function () {
    Env.find().forEach(function (setting) {
      Session.set(setting._id, setting.value);
    });
    this.stop();
  });
}

if (Meteor.isServer) {
  Meteor.publish("settings", function () {
    var self = this;
    for (var key in process.env) {
      if (process.env.hasOwnProperty(key) && key.indexOf('PARALLELS_') === 0) {
        self.added("parallels.env", key, {value: process.env[key]});
      }
    }
    self.ready();
  });
}
