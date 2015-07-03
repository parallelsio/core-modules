Template.infoMenu.helpers({
   
  currentModeLabel: function () {
    if (Session.get('currentMode')){
      return 'in ' + Session.get('currentMode') + ' mode';
    }
  },
  
  progress: function () {
    return Session.get('uploadProgress');
  }

});