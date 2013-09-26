# both client + server
Bits = new Meteor.Collection("bits")


if Meteor.isClient
  Template.map.bits = -> 
  	Bits.find()

