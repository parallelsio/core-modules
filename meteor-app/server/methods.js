var N4JDB = new Meteor.Neo4j(process.env.GRAPHENEDB_URL);

function addBitToGraph (mongoId) {
  N4JDB.query('CREATE (:Bit {mongoId:"' + mongoId + '"})', null, function (err) {
    if (err) {
      console.log('Neo4j addBitToGraph failed: ', mongoId, err);
    }
  });
}

function removeBitFromGraph (mongoId, cb) {
  N4JDB.query('MATCH (a:Bit {mongoId:"' + mongoId + '"}) DELETE a', null, function (err) {
    if (err) {
      console.log('Neo4j removeBitFromGraph failed: ', mongoId, err);
    }
    cb(err, null);
  });
}

Meteor.methods({
  'insertBit': function (attributes) {
    try {
      var mongoId = Bits.insert(attributes);
      console.log('methods:insertBit: created ', mongoId);
      addBitToGraph(mongoId);
      return mongoId;
    } catch(err) {
      console.log(err);
    }
  },
  'removeBit': function (id) {
    try {
      Bits.remove(id);
      console.log('methods:removeBit: ', id);
      var removeBitFromGraphPromise = Meteor.wrapAsync(removeBitFromGraph);
      return removeBitFromGraphPromise(id);
    } catch(err) {
      console.log(err);
    }
  }
});
