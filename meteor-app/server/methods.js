var N4JDB = new Meteor.Neo4j(process.env.GRAPHENEDB_URL);

function addBitToGraph (mongoId) {
  log.debug('Neo4j addBitToGraph starting ', mongoId);

  // TODO: how do we know if this was successful? is there no return value?
  N4JDB.query(
    'CREATE (:Bit {mongoId:"' + mongoId + '"})', 
    null, 
    function (err) {
      if (err) log.debug('Neo4j addBitToGraph failed: ', mongoId, err);
    });
}

function deleteBitFromGraph (mongoId) {
  log.debug('Neo4j removeBitFromGraph starting ', mongoId);

  N4JDB.query(
    'MATCH (a:Bit {mongoId:"' + mongoId + '"}) DELETE a', 
    null, 
    function (err) {
      if (err) log.debug('Neo4j removeBitFromGraph failed: ', mongoId, err);
    }
  );
}

// Each bits exists in 2 databases.
// Why? [TODO: Trello discussion link here] 
// Thus, we have to mirror each operation to both db's
// The order (Which we do first/second) doesn't matter.
Meteor.methods({
  'createBit': function (attributes) {
    try {
      log.debug('methods:createBit with attributes: ', attributes);
      
      // 1: add to Mongo db
      var mongoId = Bits.insert(attributes);
      log.debug('bit:create to Mongo successful: ', mongoId);

      // 2: add to Neo4j db
      addBitToGraph(mongoId);
      log.debug('bit:create to Neo4j successful: ', mongoId);

      return mongoId;
    } catch(err) {
      log.debug(err);
    }
  },

  'deleteBit': function (id) {
    try {

      log.debug('methods:deleteBit: ', id);

      // 1: delete from Mongo db
      Bits.remove(id);

      // 2: delete from Neo4j db
      deleteBitFromGraph(id);

    } catch(err) {
      log.debug(err);
    }
  }

});


