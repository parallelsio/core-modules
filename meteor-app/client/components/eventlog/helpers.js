Template.eventlog.helpers({
  events: function () {
    return Events.find({rolledBack: null}, {sort: {timestamp: -1}});
  }
});

Template.event.helpers({
  time: function () {
    return moment(this.timestamp).fromNow();
  }
});
