/* Allow client query execution */
Meteor.neo4j.allowClientQuery = true;
/* Custom URL to Neo4j should be here */
Meteor.neo4j.connectionURL = Meteor.settings.neo4jUrl;
/* But deny all writing actions on client */
Meteor.neo4j.set.deny(neo4j.rules.write);
