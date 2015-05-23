describe('CanvasRepository', function() {

  xit('should be able to rollback changes to a canvas', function(done) {
    // get repository
    var getCanvas = Meteor.wrapAsync(CanvasRepo.get, CanvasRepo);
    var rollbackCanvas = Meteor.wrapAsync(CanvasRepo.rollback, CanvasRepo);
    var canvas = getCanvas('1');

    // make change to canvas
    var firstBitId = Random.id();
    var secondBitId = Random.id();
    canvas.createBit({_id: firstBitId, content: 'First Bit'});
    canvas.createBit({_id: secondBitId, content: 'Second Bit'});

    // rollback change
    expect(canvas.bits.length).toEqual(2);
    expect(canvas.bits[0]._id).toEqual(firstBitId);
    expect(canvas.bits[1]._id).toEqual(secondBitId);

    //expect(Events.find({})).toEqual('test');
    CanvasRepo.events.find({ id: '1' }).toArray(function (err, events) {
      expect(events).toEqual('test');
      done();
    });

    // rollbackCanvas('1')

    // get canvas and ensure changes are rolled back
  });
});
