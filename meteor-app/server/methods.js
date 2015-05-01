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
      var mongoId = Bits.insert(attributes);
      console.log('methods:insertBit: created ', mongoId);
      Meteor.call('addBitToGraph', {mongoId: mongoId});
      return mongoId;
    } catch(err) {
      console.log(err);
    }
  },
  'removeBit': function (id) {
    try {
      Bits.remove(id);
      console.log('methods:removeBit: ', id);
      return Meteor.call('removeBitFromGraph', {mongoId: id});
    } catch(err) {
      console.log(err);
    }
  }
});
