Template.createTextBit.events({
  
  'keyup .bit': function (event, template) {
    var createTextBit = Session.get('createTextBit');
    if (createTextBit && event.which === 13) {
      Parallels.AppModes['create-bit'].success(template, createTextBit);
    }
  }
});
