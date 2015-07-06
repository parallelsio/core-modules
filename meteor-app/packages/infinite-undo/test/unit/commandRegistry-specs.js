var
  assert = require('chai').assert,
  path = require('path'),
  loadFile = require('./loadFile.js');

describe('CommandRegistry', function() {

  describe('#registerCommand', function () {

    beforeEach(function () {
      this.Stub = function () {};
      this.context = loadFile(path.resolve(__dirname, '../../lib/command-registry.js'), { InfiniteUndo: {} });
    });

    it('should accept a command definition object with an "execute" function which will be invoked when the command\'s name is called on the prototype object', function (done) {
      this.context.InfiniteUndo.CommandRegistry.registerCommand(this.Stub.prototype, {
        name: 'doSomething',
        event: 'bit.something-happened',
        execute: function () {
          assert.ok("execute function called");
          done();
        },
        undo: function () {}
      });

      var stub = new this.Stub();
      stub.doSomething();
    });

    it('should call the "undo" function when the command is un-done and the command has an "undo" definition', function (done) {
      this.context.InfiniteUndo.CommandRegistry.registerCommand(this.Stub.prototype, {
        name: 'doSomething',
        event: 'bit.something-happened',
        execute: function () {},
        undo: function () {
          assert.ok("undo function called");
          done();
        }
      });

      var stub = new this.Stub();

      stub.undo_doSomething();
    });

    it('should call the "execute" function when the command is un-done and the command does not have an "undo" definition', function (done) {
      this.context.InfiniteUndo.CommandRegistry.registerCommand(this.Stub.prototype, {
        name: 'doSomething',
        event: 'bit.something-happened',
        execute: function () {
          assert.ok("execute function called");
          done();
        }
      });

      var stub = new this.Stub();

      stub.undo_doSomething();
    });

    it('should call the "execute" function when the command is re-done', function (done) {
      this.context.InfiniteUndo.CommandRegistry.registerCommand(this.Stub.prototype, {
        name: 'doSomething',
        event: 'bit.something-happened',
        execute: function () {
          assert.ok("execute function called");
          done();
        },
        undo: function () {}
      });

      var stub = new this.Stub();

      stub.redo_doSomething();
    });

    it('should throw an error if the prototype object already has a function defined with the command\'s name', function () {
      this.context.InfiniteUndo.CommandRegistry.registerCommand(this.Stub.prototype, {
        name: 'doSomething',
        event: 'bit.something-happened',
        execute: function () {},
        undo: function () {}
      });

      assert.throw(function () {
        this.context.InfiniteUndo.CommandRegistry.registerCommand(this.Stub.prototype, {
          name: 'doSomething',
          event: 'bit.something-happened',
          execute: function () {},
          undo: function () {}
        });
      });
    });

    it('should return an array of all events added to the prototype', function () {
      this.context.InfiniteUndo.CommandRegistry.registerCommand(this.Stub.prototype, {
        name: 'foo',
        event: 'bit.fooed',
        execute: function () {},
        undo: function () {}
      });

      this.context.InfiniteUndo.CommandRegistry.registerCommand(this.Stub.prototype, {
        name: 'bar',
        event: 'bit.barred',
        execute: function () {},
        undo: function () {}
      });

      assert.lengthOf(this.context.InfiniteUndo.CommandRegistry.registeredEvents, 6);
      assert.include(this.context.InfiniteUndo.CommandRegistry.registeredEvents, 'bit.fooed');
      assert.include(this.context.InfiniteUndo.CommandRegistry.registeredEvents, 'bit.undo_fooed');
      assert.include(this.context.InfiniteUndo.CommandRegistry.registeredEvents, 'bit.redo_fooed');
      assert.include(this.context.InfiniteUndo.CommandRegistry.registeredEvents, 'bit.barred');
      assert.include(this.context.InfiniteUndo.CommandRegistry.registeredEvents, 'bit.undo_barred');
      assert.include(this.context.InfiniteUndo.CommandRegistry.registeredEvents, 'bit.redo_barred');
    });
  });

});
