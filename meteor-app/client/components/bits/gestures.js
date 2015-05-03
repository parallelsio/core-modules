Template.bit.gestures({
  'press .bit': function (event, template) {
    /* `event` is the Hammer.js event object */
    /* `template` is the `Blaze.TemplateInstance` */
    /* `this` is the data context of the element in your template */

    Parallels.Sound.play(Parallels.Sound.definitions.impulseDrop);
    console.log('bit:long-press');
  }
});
