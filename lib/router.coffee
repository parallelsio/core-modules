Router.configure {
	layout: 'layout'
	loadingTemplate: 'loading'
	waitOn: ->
		return Meteor.subscribe('bits')
}


Router.map ->
	this.route 'map', { 
		template: 'map'
		path: '/' }


Router.onBeforeAction('loading');