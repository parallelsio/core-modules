Router.configure {
	layout: 'layout'
	loadingTemplate: 'loading'

	onBeforeAction: ->
    	console.log "yo!"
}


# not working yet
Router.map ->
	this.route 'map', { 
		template: 'map'
		path: '/' }

	this.route 'home', {
		path: '/home'
	}