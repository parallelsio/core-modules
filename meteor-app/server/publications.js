// Meteor.publish('bits', function() {
//   return Bits.find();
// });

Meteor.neo4j.methods({
	'allBits': function(){
	  return 'MATCH a RETURN a';
	},
	'updateBitPosition': function(){
		console.log("position_x");
		return 'MATCH n WHERE id(n)={_id} SET n.position_x = { position_x } ';
	}
});