
// Add all configuration options the app will use here.
const ConfigurationOptions = {
  displayIntroAnimation: {key: 'DISPLAY_INTRO_ANIMATION', defaultValue: "true", valueType: 'boolean' },
  uploader: {key: 'UPLOADER', defaultValue: 'fileSystemUploader', valueType: 'string' }
};

function stringToBool(string) {
  switch (string.trim().toLowerCase()) {
    case "false":
    case "no":
    case "0":
    case "":
      return false;
    default:
      return true;
  }
}

Meteor.methods({
  getSetting: function (name) {
    check(name, String);
    var setting = ConfigurationOptions[name];

    if (!setting) {
      throw new Meteor.Error("setting-not-found", "Can't find a configuration for " + name);
    }

    var value = process.env[setting.key] || setting.defaultValue;

    if (setting.valueType === 'boolean') {
      return stringToBool(value);
    } else {
      return value.trim();
    }
  }
});
