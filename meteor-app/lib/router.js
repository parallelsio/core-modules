Router.configure({
  layout: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return Meteor.subscribe('bits');
  },
  fastRender: true

});

Router.route('/', function () {
  this.render('map');
});

Router.onBeforeAction('loading');
