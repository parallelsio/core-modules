Template.aboutContent.onDestroyed(function () {
  var template = this;
  console.log('destroying about');

  if (template.waveInstance.rafHandle){
    Parallels.log.debug("about to cancelAnimationFrame on rafHandle:", template.waveInstance.rafHandle);
    cancelAnimationFrame(template.waveInstance.rafHandle);
  }

  // erase the canvas by setting re-setting it's width [to anything]
  $(template.waveInstance.canvas).width = 0;
  $(template.waveInstance.canvas).remove();

});

