if Bits.find().count() is 0

	Bits.insert
		_id : new Meteor.Collection.ObjectID()
		id: 1
		type: "text"
		position_x: 100
		position_y: 200
		content: "Hello world!"
		color: "white"
		created_at: null
		updated_at: null
		height: null
		width: null
		format: null
		
	Bits.insert
		_id : new Meteor.Collection.ObjectID()
		id: 2
		type: "text"
		position_x: 200
		position_y: 300
		content: "This is parallels!"
		color: "white"
		created_at: null
		updated_at: null
		height:  null
		width:  null
		format: null


