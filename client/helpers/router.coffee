Router.configure {
	# layout: 'layout'
	loadingTemplate: 'loading'
}


# not working yet
Router.map ->
	this.route 'map', { 
		template: 'map'
		path: '/' }

	this.route 'home', {
		path: '/home'
	}