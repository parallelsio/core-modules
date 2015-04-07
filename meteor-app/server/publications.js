// Meteor.publish('bits', function() {
//   return Bits.find();
// });

Meteor.neo4j.methods({
	'allBits': function(){
	  return 'MATCH a RETURN a';
	}
});