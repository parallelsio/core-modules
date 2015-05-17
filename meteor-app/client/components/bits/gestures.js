Template.bit.gestures({
  'press .bit': function (event, template) {
    /* `event` is the Hammer.js event object */
    /* `template` is the `Blaze.TemplateInstance` */
    /* `this` is the data context of the element in your template */

    // Parallels.Audio.player.play('impulseDrop');
    console.log('bit:long-press');
  }
});
