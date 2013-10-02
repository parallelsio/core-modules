Template.map.helpers bits: ->
	Bits.find()

# Template.bit.events = "click .bit": (event) ->
# 	console.log "bit click"
# 	$("#" + event.currentTarget.id).slideUp "slow"



Template.bit.rendered = ->
	console.log "Template.bit.rendered"


	# BIT : DRAG + DROP
	$(".bit").draggable
		handle: "p"		# wire drag to handle only

		stop: (event, ui) ->

			# TODO : dont send drag of a form to save
			request = $.ajax( 
				url: '/bits/' + $(this).data('bit-id')
				type: 'PUT'
				data: {
					position_x: Math.round(ui.position.left)
					position_y: Math.round(ui.position.top)
					content: $(this).find('.face.front .content').text().trim()
				}
			)

			request.done (data) -> 
				console.log "drag done"
				showNotification("bit #{ data.id } position saved: x: #{ data.position_x } y: #{ data.position_y }")
				true

			request.fail (data) -> $('#notice').text "bit #{ data.id } position save failed ", "error"

			true