Template.map.gestures({
  'press .map': function (event, template) {
    /* `event` is the Hammer.js event object */
    /* `template` is the `Blaze.TemplateInstance` */
    /* `this` is the data context of the element in your template */

    sound.play('glue.mp3');
  }
});
