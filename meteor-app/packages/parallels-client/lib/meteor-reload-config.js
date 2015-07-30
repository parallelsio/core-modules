
var enableHotCodePush = Parallels.utils.stringToBoolean(Session.get('PARALLELS_IS_METEOR_HOT_CODE_PUSH_ENABLED') || true);
if (!enableHotCodePush) {
  Meteor._reload.onMigrate(function() {
    return [false];
  });
}
