EventEmitter = Meteor.npmRequire('eventemitter2').EventEmitter2;
StateChangeEvents = new EventEmitter({wildcard: true});

Meteor.wrapAsync(function (cb) {
  var mongo = Meteor.npmRequire('sourced-repo-mongo/mongo');
  mongo.on('error', function (err) {
    cb(err);
  });
  mongo.on('connected', function (db) {
    cb(null, db);
  });
  mongo.connect(process.env.MONGOLAB_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:3001/meteor');
})();

CanvasRepo = new CanvasRepository();
