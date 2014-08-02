##########################################################################################
root = global ? window
##########################################################################################

# keep track of current mouse position
# used when bit:new/create, use mouse position to create bit at that location
root.x = 0
root.y = 0

root.showNotifications = true




root.showNotification = (message, type) ->

	# default to info. other options: success, error, notice
	type = "info" if typeof (type) is "undefined"

	if root.showNotifications
		$.pnotify
			text: message
			shadow: false
			animation: 'fade'
			type: type
			delay: 1500

	console.log message


#########################################

Meteor.subscribe('bits')

Deps.autorun -> 
	console.log Bits.find().count() + ' bits'




###########################################
# init

Meteor.startup ->
	console.log "ready!"

	Mousetrap.bind "4", ->
		console.log "pressed 4"
		return


	return