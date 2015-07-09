
var enableHotCodePush = Parallels.settings.get('PARALLELS_IS_METEOR_HOT_CODE_PUSH_ENABLED');
if (!Parallels.utils.stringToBoolean(enableHotCodePush)) {
  Meteor._reload.onMigrate(function() {
    return [false];
  });
}
