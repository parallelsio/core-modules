// Meteor.publish 'bits', ->
//  if(typeof query === 'undefined'){
//    return Bits.find({'creator':'anonymous'})
//  }
//  else
//  {
//    return null
//  }
// on the server

Meteor.publish('bits', function() {
  //var query = this.params.query;
  if(typeof query === 'undefined'){
  // no link attached
    return Bits.find({'creator':null});
  }
  else
  {
    return Bits.find({'creator':'anonymous'});
  }
});

// https://github.com/yasaricli/metrello