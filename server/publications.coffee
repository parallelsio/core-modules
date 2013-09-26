Meteor.publish 'bits', ->
	return Bits.find()
