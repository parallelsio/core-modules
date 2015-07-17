Meteor.call('getSetting', 'isMeteorHotCodePushEnabled', function (err, isMeteorHotCodePushEnabled) {

  if (!isMeteorHotCodePushEnabled) {
    Meteor._reload.onMigrate(function() {
      return [false];
    });
  }

});
