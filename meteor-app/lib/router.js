Router.configure({
  layout: 'layout',
  loadingTemplate: 'loading',
  fastRender: true
});

Router.route('/', function () {
  this.redirect('/canvas/demo');
});

Router.route('/canvas/:canvasId', {

  waitOn: function () {
    // return one handle, a function, or an array
    return Meteor.subscribe('canvas-bits', this.params.canvasId);
  },

  action: function () {
    this.render('map');
  },

  onBeforeAction: function () {
    Session.set('canvasId', this.params.canvasId);
    this.next();
  }
});

Router.onBeforeAction('loading');
