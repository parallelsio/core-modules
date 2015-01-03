// 2 options for ID generation in collections:
// Object ID via Mongo
// String ID via Meteor

// https://groups.google.com/forum/#!searchin/meteor-talk/id$20mongo/meteor-talk/f-ljBdZOwPk/UGxzC0QlD3cJ
// https://groups.google.com/forum/#!topic/meteor-talk/tkH-p_B-wbY

// TODO: for this map only
Bits = new Meteor.Collection("bits");

// set controls, requires user to be logged in
//Bits.allow({
//    update: function (objectId, bit) {
//        return objectId;
//    },
//    insert: function (objectId, bit) {
//        return objectId;
//    },
//    remove: function (objectId, bit) {
//        return objectId
//    }
//});