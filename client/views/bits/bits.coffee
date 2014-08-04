##########################################################################################
root = global ? window
##########################################################################################



Template.bit.rendered = ->

	this.$(".bit").addClass("test")

	console.log "Template.bit.rendered"



	# BIT : DRAG + DROP
	$(".bit").draggable
		handle: "p"		# wire drag to handle only

		stop: (event, ui) ->

			bitId = $(this).attr('id')
		
			positionX = Math.round(ui.position.left)
			positionY = Math.round(ui.position.top)
			# console.log "#{ bitId } : #{ positionX } : #{ positionY }"

			Bits.update( id: bitId, { position_x: positionX, position_y: positionY  })
			
			# Bits.insert( { id: 8, type: 'text', content: 'yow3za', position_x:544, position_y: 400 })

			content: $(this).find('.face.front .content').text().trim()
			# url: '/bits/' + $(this).attr('id')

			root.showNotification("bit #{ bitId } position saved: x: #{ positionX } y: #{ positionY }")

			true



Template.bit.events = 
	"click": (event) ->

		# prevent browser from executing event’s default behavior
		event.preventDefault()

		console.log "The button was clicked"







