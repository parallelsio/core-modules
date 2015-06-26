// NOTE: this file is nested 2x in /client/lib/core/core only to ensure it loads first
// TODO: refactor as a package or other load order insure mechanism.
Meteor.subscribe('events');

Parallels = {
  AppModes: {},
  Animation: {},
  Audio: {
    Definition: {}
  },
  FileUploads: {},
  Handlers: Inverter,
  KeyCommands: {}
};
