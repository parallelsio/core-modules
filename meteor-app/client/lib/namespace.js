MeteorSettings.setDefaults({
  public: { options: { uploader: 'fileSystemUploader' } }
});

Parallels = {
  AppModes: {},
  Handlers: Inverter,
  Uploader: new Slingshot.Upload(Meteor.settings.public.options.uploader)
};
