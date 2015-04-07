  Meteor.N4JDB.query('CREATE (a:Bit {  type: { type }, position_x: { position_x }, position_y: { position_y }, color: { color }, content: { content } } )', 
    // Meteor.N4JDB.query('CREATE (a:Bit);',

    {
        type: "text",
        position_x: 500,
        position_y: 300,
        content: "This is parallels with NEO4j!",
        color: "white"
    }
  );