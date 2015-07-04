var EventEmitter = Npm.require('eventemitter2').EventEmitter2;

InfiniteUndo = {
  EventStream: new EventEmitter({wildcard: true})
};

var connectToMongo = Meteor.wrapAsync(function (cb) {
  var mongo = Npm.require('sourced-repo-mongo/mongo');
  mongo.on('error', function (err) {
    cb(err);
  });
  mongo.on('connected', function (db) {
    cb(null, db);
  });
  mongo.connect(process.env.MONGOLAB_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:3001/meteor');
});

Meteor.startup(function () {
  connectToMongo();
});
