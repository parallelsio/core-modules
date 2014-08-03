Router.configure {
	layout: 'layout'

	onBeforeAction: ->
    	console.log "onBeforeAction:"
}


Router.map ->
	this.route 'map', { 
		template: 'map'
		path: '/' }