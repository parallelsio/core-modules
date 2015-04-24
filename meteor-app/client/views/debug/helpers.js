Template.debug.helpers({
  bits: function() {
    return Bits.find();
  },
  
  isWebpage: function() {
    return this.type === 'webpage';
  }
});