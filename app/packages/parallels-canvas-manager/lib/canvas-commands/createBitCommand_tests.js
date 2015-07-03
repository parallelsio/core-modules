Tinytest.addAsync('CreateBitCommand - execute - should add a new Bit to the ParallelsCanvasManager.Canvas\'s list of Bits', function (test, done) {
  var canvas = new ParallelsCanvasManager.Canvas();

  canvas.createBit({title: 'foo', content: 'bar'}, function (err, bit) {
    test.length(canvas.bits, 1);
    test.equal(canvas.bits[0], bit);
    test.equal(bit.title, 'foo');
    test.equal(bit.content, 'bar');
    done();
  });
});

Tinytest.addAsync('CreateBitCommand - execute - should generate an ID for a new Bit if one is not provided', function (test, done) {
  var canvas = new ParallelsCanvasManager.Canvas();

  canvas.createBit({title: 'foo', content: 'bar'}, function (err, bit) {
    test.isNotNull(bit._id);
    done();
  });
});

Tinytest.addAsync('CreateBitCommand - execute - should use the given ID for a new Bit if one is provided', function (test, done) {
  var canvas = new ParallelsCanvasManager.Canvas();

  canvas.createBit({_id: 'abc123', title: 'foo', content: 'bar'}, function (err, bit) {
    test.equal(bit._id, 'abc123');
    done();
  });
});

Tinytest.add('CreateBitCommand - undo - should remove a Bit with the given ID from the ParallelsCanvasManager.Canvas\'s list of Bits', function (test) {
  var canvas = new ParallelsCanvasManager.Canvas();
  canvas.createBit({_id: "acb123", title: 'foo', content: 'bar'});

  canvas.undo_createBit({_id: "acb123", title: 'foo', content: 'bar'});

  test.length(canvas.bits, 0);
});
