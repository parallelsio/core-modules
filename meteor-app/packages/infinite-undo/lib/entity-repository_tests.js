var
  util = Npm.require('util'),
  events = new Meteor.Collection('StubPrototype.events'),
  snapshots = new Meteor.Collection('StubPrototype.snapshots'),
  repo, StubPrototype;

function getStubPrototype () {
  function StubPrototype () {
    InfiniteUndo.Entity.apply(this, arguments);
  }
  util.inherits(StubPrototype, InfiniteUndo.Entity);

  return StubPrototype;
}

function reset () {
  events.remove({});
  snapshots.remove({});
  StubPrototype = getStubPrototype();
  repo = new InfiniteUndo.EntityRepository(StubPrototype);
  InfiniteUndo.CommandRegistry.registeredEvents = [];
}

Tinytest.add('EntityRepository - get - should create a new canvas with the specified ID', function (test) {
  reset();

  var getEntity = Meteor.wrapAsync(repo.get, repo);
  var entity = getEntity("1");

  test.equal(entity.id, "1");
});

Tinytest.addAsync('EntityRepository - get - should wire up listeners on the entity for all registered commands from the command registry and emit an entity event on the EventStream object', function (test, done) {
  reset();

  InfiniteUndo.CommandRegistry.registerCommand(StubPrototype.prototype, {
    name: 'doSomething',
    event: 'bit.something-happened',
    execute: function (canvas, payload, onComplete) {
      onComplete(null, {payload: payload, result: {}});
    }
  });

  var getEntity = Meteor.wrapAsync(repo.get, repo);
  var entity = getEntity("1");

  InfiniteUndo.EventStream.once('entity.bit.something-happened', Meteor.bindEnvironment(function () {
    test.ok();
    done();
  }));

  entity.doSomething();

  var commitEntity = Meteor.wrapAsync(repo.commit, repo);
  commitEntity(entity);
});

Tinytest.add('EntityRepository - commit - should save a snapshot of the entity to a mongo collection', function (test) {
  reset();

  var getEntity = Meteor.wrapAsync(repo.get, repo);
  var canvas = getEntity("1");
  var commitEntity = Meteor.wrapAsync(repo.commit, repo);
  commitEntity(canvas, {forceSnapshot: true});

  test.equal(snapshots.find().count(), 1);
});
