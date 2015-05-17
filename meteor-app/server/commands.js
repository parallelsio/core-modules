// Sample message from the client:
// {
//   command: 'createBit',
//   data: {
//     canvasId: 'ABC123',
//     content: 'Initial Content',
//   }
// }

var getCanvas = Meteor.wrapAsync(CanvasRepo.get, CanvasRepo);
var commitRepo = Meteor.wrapAsync(CanvasRepo.commit, CanvasRepo);

Meteor.methods({
  'changeState': function (msg) {
    log.debug('changeState: [command]:[canvas]:[bit]', msg.command, msg.data.canvasId, msg.data._id);
    var canvas = getCanvas(msg.data.canvasId);
    var canvasAction = canvas[msg.command];

    if (canvasAction) {
      var action = Meteor.wrapAsync(canvasAction, canvas);
      var response = action(msg.data);
      commitRepo(canvas, {/* forceSnapshot: true */});
      return response;
    } else {
      log.error("Command not recognized");
    }
  }
});
