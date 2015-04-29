Meteor.neo4j.methods({
  'addBitToGraph': function(){
    return 'CREATE (a:Bit {mongoId: {mongoId}})';
  },
  'removeBitFromGraph': function(){
    return 'MATCH (a:Bit {mongoId: {mongoId}}) DELETE a';
  }
});

Meteor.methods({
  'insertBit': function (attributes) {
    try {
      console.log('methods:insertBit: ', attributes);
      var mongoId = Bits.insert(attributes);
      Meteor.call('addBitToGraph', {mongoId: mongoId});
      return mongoId;
    } catch(err) {
      console.log(err);
    }
  },
  'removeBit': function (id) {
    try {
      console.log('methods:removeBit: ', id);
      Bits.remove(id);
      return Meteor.call('removeBitFromGraph', {mongoId: id});
    } catch(err) {
      console.log(err);
    }
  }
});
