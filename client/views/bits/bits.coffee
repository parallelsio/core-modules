##########################################################################################
root = global ? window
##########################################################################################

Template.map.helpers bits: ->
	Bits.find()



Template.bit.rendered = ->
	console.log "Template.bit.rendered"



	# BIT : DRAG + DROP
	$(".bit").draggable
		handle: "p"		# wire drag to handle only

		stop: (event, ui) ->

			bitId = $(this).attr('id')
		
			positionX = Math.round(ui.position.left)
			positionY = Math.round(ui.position.top)
			# console.log positionX + ": " + positionY

			Bits.update( _id: bitId, { position_x: positionX, position_y: positionY  })

			content: $(this).find('.face.front .content').text().trim()
			# url: '/bits/' + $(this).attr('id')

			root.showNotification("bit #{ bitId } position saved: x: #{ positionX } y: #{ positionY }")

			true