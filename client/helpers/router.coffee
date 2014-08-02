Router.configure {
	# layout: 'layout'
	loadingTemplate: 'loading'

	onBeforeAction: ->
    	# console.log "yo!"
}


Router.map ->
	this.route 'map', { 
		template: 'map'
		path: '/' }