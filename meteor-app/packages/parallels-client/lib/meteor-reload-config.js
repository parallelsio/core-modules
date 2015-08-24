
var isHotCodePushDisabled = Session.get('PARALLELS_IS_METEOR_HOT_CODE_PUSH_DISABLED') || 0;

if (isHotCodePushDisabled) {
  Meteor._reload.onMigrate(function() {
    return [false];
  });
}

