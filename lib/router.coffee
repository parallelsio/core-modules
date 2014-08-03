Router.configure {
	layout: 'layout'
	waitOn: ->
		return Meteor.subscribe('bits')
}


Router.map ->
	this.route 'map', { 
		template: 'map'
		path: '/' }