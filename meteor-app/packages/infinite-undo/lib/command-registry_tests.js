var StubPrototype;

function reset () {
  StubPrototype = function () {};
  InfiniteUndo.CommandRegistry.registeredEvents = [];
}

Tinytest.addAsync('CommandRegistry - registerCommand - accepts a command definition object with an "execute" function which will be invoked when the command\'s name is called on the prototype object', function (test, done) {
  reset();

  InfiniteUndo.CommandRegistry.registerCommand(StubPrototype.prototype, {
    name: 'doSomething',
    event: 'bit.something-happened',
    execute: function () {
      test.ok();
      done();
    },
    undo: function () {}
  });

  var stubInstance = new StubPrototype();

  stubInstance.doSomething();
});

Tinytest.addAsync('CommandRegistry - registerCommand - will call the "undo" function when the command is un-done and the command has an "undo" definition', function (test, done) {
  reset();

  InfiniteUndo.CommandRegistry.registerCommand(StubPrototype.prototype, {
    name: 'doSomething',
    event: 'bit.something-happened',
    execute: function () {},
    undo: function () {
      test.ok();
      done();
    }
  });

  var stubInstance = new StubPrototype();

  stubInstance.undo_doSomething();
});

Tinytest.addAsync('CommandRegistry - registerCommand - will call the "execute" function when the command is un-done and the command does not have an "undo" definition', function (test, done) {
  reset();

  InfiniteUndo.CommandRegistry.registerCommand(StubPrototype.prototype, {
    name: 'doSomething',
    event: 'bit.something-happened',
    execute: function () {
      test.ok();
      done();
    }
  });

  var stubInstance = new StubPrototype();

  stubInstance.undo_doSomething();
});

Tinytest.addAsync('CommandRegistry - registerCommand - will call the "execute" function when the command is re-done', function (test, done) {
  reset();

  InfiniteUndo.CommandRegistry.registerCommand(StubPrototype.prototype, {
    name: 'doSomething',
    event: 'bit.something-happened',
    execute: function () {
      test.ok();
      done();
    },
    undo: function () {}
  });

  var stubInstance = new StubPrototype();

  stubInstance.redo_doSomething();
});

Tinytest.add('CommandRegistry - registerCommand - should throw an error if the prototype object already has a function defined with the command\'s name', function (test) {
  reset();

  InfiniteUndo.CommandRegistry.registerCommand(StubPrototype, {
    name: 'doSomething',
    event: 'bit.something-happened',
    execute: function () {},
    undo: function () {}
  });

  test.throws(function () {
    InfiniteUndo.CommandRegistry.registerCommand(StubPrototype, {
      name: 'doSomething',
      event: 'bit.something-happened',
      execute: function () {},
      undo: function () {}
    });
  });
});

Tinytest.add('CommandRegistry - registeredEvents - should return an array of all events added to the prototype', function (test) {
  reset();

  InfiniteUndo.CommandRegistry.registerCommand(StubPrototype.prototype, {
    name: 'foo',
    event: 'bit.fooed',
    execute: function () {},
    undo: function () {}
  });

  InfiniteUndo.CommandRegistry.registerCommand(StubPrototype.prototype, {
    name: 'bar',
    event: 'bit.barred',
    execute: function () {},
    undo: function () {}
  });

  test.length(InfiniteUndo.CommandRegistry.registeredEvents, 6);
  test.include(InfiniteUndo.CommandRegistry.registeredEvents, 'bit.fooed');
  test.include(InfiniteUndo.CommandRegistry.registeredEvents, 'bit.undo_fooed');
  test.include(InfiniteUndo.CommandRegistry.registeredEvents, 'bit.redo_fooed');
  test.include(InfiniteUndo.CommandRegistry.registeredEvents, 'bit.barred');
  test.include(InfiniteUndo.CommandRegistry.registeredEvents, 'bit.undo_barred');
  test.include(InfiniteUndo.CommandRegistry.registeredEvents, 'bit.redo_barred');
});
