Router.configure({
  layout: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return Meteor.subscribe('bits');
  }
});

Router.route('/', function () {
  this.render('map');
});

Router.route('/debug', function () {
  this.render('debug');
});

Router.onBeforeAction('loading');
