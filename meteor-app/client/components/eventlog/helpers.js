var FriendlyEventDescription = {
  'createBit': 'Created a bit',
  'undo_createBit': 'Rewind: Created a bit',
  'redo_createBit': 'Replay: Created a bit',
  'deleteBit': 'Deleted bit',
  'undo_deleteBit': 'Rewind: Deleted bit',
  'redo_deleteBit': 'Replay: Deleted bit',
  'updateBitPosition': 'Moved bit coordinates',
  'undo_updateBitPosition': 'Rewind: Moved bit coordinates',
  'redo_updateBitPosition': 'Replay: Moved bit coordinates',
  'uploadImage': 'Uploaded image for bit',
  'undo_uploadImage': 'Rewind: Uploaded image for bit',
  'redo_uploadImage': 'Replay: Uploaded image for bit',
  'updateBitContent': 'Updated bit',
  'undo_updateBitContent': 'Rewind: Updated bit',
  'redo_updateBitContent': 'Replay: Updated bit',
  'clipWebpage': 'Clipped webpage',
  'undo_clipWebpage': 'Rewind: Clipped webpage',
  'redo_clipWebpage': 'Replay: Clipped webpage'
};

Template.eventlog.helpers({
  events: function () {
    return Eventlog.find({}, {sort: {timestamp: -1}});
  }
});

Template.event.helpers({
  description: function () {
    return FriendlyEventDescription[this.method]
  },

  meta: function () {
    return this.data.filename || this.data.content
  },

  time: function () {
    return moment(this.timestamp).fromNow();
  }
});
