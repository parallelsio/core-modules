Router.configure({
  layout: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return Meteor.subscribe('bits');
  }
});


Router.route('/', function () {
    console.log("my message");
    var query = this.params.query;
    console.log(query);
    console.log(query.q);
    if(Meteor.user()) {

    }
    else if(typeof query === 'undefined'){

    }
    else {
      Meteor.default_connection._lastSessionId = query.q;
    }
//    console.log(JSON.stringify(this.request.query))
    this.render('map');
});

//Router.map(function() {
//   return this.route('map', {
//    action: function() {
//    },
//    template: 'map',
//    path: '/'
//
//        console.log("this is a message")
//        var alex = this.request.query;
//        JSON.stringify(alex);
//    }
//  }
//  );
//});

Router.onBeforeAction('loading');