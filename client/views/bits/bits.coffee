##########################################################################################
root = global ? window
##########################################################################################



Template.bit.rendered = ->



	# this.$(".bit").addClass("debug")
	console.log "Template.bit.rendered: #{ this.data._id }"
	console.log this.data
	console.log this
	console.log ""

	

	# jquery implementation drag + drop works,
	# but want to replace to use Draggabilly instead

	# $(".bit").draggable
	# 	handle: "p"		# wire drag to handle only

	# 	stop: (event, ui) ->

	# 		mongoId = UI.getElementData(this)._id
	# 		positionX = Math.round(ui.position.left)
	# 		positionY = Math.round(ui.position.top)

	# 		console.log "stop dragging: #{ mongoId } : #{ positionX } : #{ positionY }"

	# 		Bits.update( mongoId, { $set: {"position_x": positionX, "position_y": positionY } })
			
	# 		root.showNotification("#{ mongoId } position saved: x: #{ positionX } y: #{ positionY }")

	# 		true











