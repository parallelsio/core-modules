// This creates Collections on both client and server
// More here: https://stackoverflow.com/questions/19826804/understanding-meteor-publish-subscribe/21853298#21853298
// the server one gets records once publish is called
// the client gets filled once the subscribe is wired.

Bits = new Mongo.Collection("bits");
CanvasEvents = new Mongo.Collection("Canvas.events");
