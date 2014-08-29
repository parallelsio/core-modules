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


// // http://famous.vararu.org
// // TODO:
// // I have no idea how to clean the famous container.
// // So I'll just do this.
// Router.onRun(function() {
//   $('.famous-container').remove();
// });
