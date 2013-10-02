Meteor.subscribe('bits')

Deps.autorun -> 
	console.log Bits.find().count() + ' bits'



###########################################
# init

Meteor.startup ->
	console.log "ready!"

	return