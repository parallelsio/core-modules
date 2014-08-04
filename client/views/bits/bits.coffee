##########################################################################################
root = global ? window
##########################################################################################



Template.bit.rendered = ->

	# this.$(".bit").addClass("debug")
	console.log "Template.bit.rendered: #{ this.data._id }"
	console.log this.data
	console.log this
	console.log ""

	$(".bit").draggable
		handle: "p"		# wire drag to handle only

		stop: (event, ui) ->

			mongoId = UI.getElementData(this)._id
			positionX = Math.round(ui.position.left)
			positionY = Math.round(ui.position.top)

			console.log "stop dragging: #{ mongoId } : #{ positionX } : #{ positionY }"

			Bits.update( mongoId, { $set: {"position_x": positionX, "position_y": positionY } })
			
			root.showNotification("#{ mongoId } position saved: x: #{ positionX } y: #{ positionY }")

			true



Template.bit.events = 
	"click": (event) ->

		# prevent browser from executing event’s default behavior
		event.preventDefault()

		console.log "bit was clicked"

		# $(event.currentTarget).addClass("debug")

		# debug
		# console.log event.currentTarget
		# console.log $(event.currentTarget)
		# console.log this








