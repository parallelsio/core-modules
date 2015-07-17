Meteor.call('getSetting', 'isMeteorHotCodePushEnabled', function (err, isMeteorHotCodePushEnabled) {
  
  if (isMeteorHotCodePushEnabled === 'false') {
    Meteor._reload.onMigrate(function() {
      return [false];
    });
  }

});