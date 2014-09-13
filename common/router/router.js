Router.configure({
  layout: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return Meteor.subscribe('bits');
  }
});

Router.map(function() {
  return this.route('map', {
    template: 'map',
    path: '/'
  });
});

Router.onBeforeAction('loading');
