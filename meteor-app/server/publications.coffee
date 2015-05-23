Meteor.publish 'bits', ->
	return Bits.find()

Meteor.publish 'errors', ->
  return Errors.find()

Meteor.publish 'events', ->
  return Events.find()