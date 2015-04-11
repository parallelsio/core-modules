// TODO: add in check to prevent fixtures from running if any data exists
  Meteor.N4JDB.query('MATCH n RETURN COUNT(n) as count',{},function(error,data) {
    console.log("getting count");
    if (error)
    {
        console.log("ERRORS!");
        console.log(error);    
    }
    else
    {
        console.log(data[0]['count'])
        var nodeCount = data[0]['count'];
        if(nodeCount > 0)
        {
            //Do nothing
            console.log("nodes already exist, doing nothing");
        }
        else
        {
            console.log("count is zero");
            Meteor.N4JDB.query('CREATE (a:Bit {  type: { type }, position_x: { position_x }, position_y: { position_y }, color: { color }, content: { content } } )', 

            {
                type: "text",
                position_x: 500,
                position_y: 300,
                content: "This is parallels with NEO4j!",
                color: "white"
            });
        }
    }
  });
  