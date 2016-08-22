// var N4JDB = new Meteor.Neo4j(process.env.GRAPHENEDB_URL || "http://localhost:7474");

// // todo: we should be listening for undo logic here as well:
// InfiniteUndo.EventStream.on('entity.bit.created', function (event) {
//   var bit = event.data.payload;
//   Parallels.log.debug('Neo4j addBitToGraph starting ', bit._id);

//   // TODO: how do we know if this was successful? is there no return value?
//   N4JDB.query(
//     'CREATE (:Bit {mongoId:"' + bit._id + '"})',
//     null,
//     function (err) {
//       if (err) Parallels.log.error('Neo4j addBitToGraph failed: ', bit._id, err);
//     });
// });

// InfiniteUndo.EventStream.on('entity.bit.deleted', function (event) {
//   var bit = event.data.payload;
//   Parallels.log.debug('Neo4j removeBitFromGraph starting ', bit._id);

//   N4JDB.query(
//     'MATCH (a:Bit {mongoId:"' + bit._id + '"}) DELETE a',
//     null,
//     function (err) {
//       if (err) Parallels.log.error('Neo4j removeBitFromGraph failed: ', bit._id, err);
//     }
//   );
// });


