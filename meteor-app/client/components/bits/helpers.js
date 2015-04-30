Template.bit.helpers({

  isEditingThisBit: function() {
    return Session.equals('bitEditingId', this._id);
  }
});