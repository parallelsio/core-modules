Meteor.publish 'bits', ->
	return Bits.find()

Meteor.publish 'errors', ->
  return Errors.find()

Meteor.publish 'Canvas.events', ->
  return CanvasEvents.find()