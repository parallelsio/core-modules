var N4JDB = new Meteor.Neo4j(process.env.GRAPHENEDB_URL);

function addBitToGraph (mongoId) {
  N4JDB.query('CREATE (:Bit {mongoId:"' + mongoId + '"})', null, function (err) {
    if (err) {
      log.debug('Neo4j addBitToGraph failed: ', mongoId, err);
    }
  });
}

function removeBitFromGraph (mongoId, cb) {
  N4JDB.query('MATCH (a:Bit {mongoId:"' + mongoId + '"}) DELETE a', null, function (err) {
    if (err) {
      log.debug('Neo4j removeBitFromGraph failed: ', mongoId, err);
    }
    cb(err, null);
  });
}

Meteor.methods({
  'insertBit': function (attributes) {
    try {
      var mongoId = Bits.insert(attributes);
      log.debug('methods:insertBit: created ', mongoId);
      addBitToGraph(mongoId);
      return mongoId;
    } catch(err) {
      log.debug(err);
    }
  },
  'removeBit': function (id) {
    try {
      Bits.remove(id);
      log.debug('methods:removeBit: ', id);
      var removeBitFromGraphPromise = Meteor.wrapAsync(removeBitFromGraph);
      return removeBitFromGraphPromise(id);
    } catch(err) {
      log.debug(err);
    }
  }
});
