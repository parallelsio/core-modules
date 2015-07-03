function reset () {
  InfiniteUndo.RollbackReplayStack.remove({});
}

Tinytest.add('RollbackReplayStack - should insert a new event record on the RollbackReplayStack', function (test) {
  reset();

  InfiniteUndo.EventStream.emit('entity.some-event', {data: {entity: {id: 'abc', version: '1'}}});
  InfiniteUndo.EventStream.emit('entity.namespace.some-event', {data: {entity: {id: '123', version: '1'}}});

  test.length(InfiniteUndo.RollbackReplayStack.find().fetch(), 2);
});

Tinytest.add('RollbackReplayStack - should only listen for events that start with entity on the EventStream object', function (test) {
  reset();

  InfiniteUndo.EventStream.emit('namespace.some-event', {data: {entity: {id: '123', version: '2'}}});

  test.length(InfiniteUndo.RollbackReplayStack.find().fetch(), 0);
});
